import React, { useState, useEffect } from 'react';
import { Button, Form, InputGroup, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const VoiceSearch = ({ onSearch, placeholder = "Search products..." }) => {
  const [isListening, setIsListening] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if Web Speech API is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
      };
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        handleSearch(transcript);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const handleSearch = (term) => {
    if (term.trim()) {
      if (onSearch) {
        onSearch(term);
      } else {
        navigate(`/products?search=${encodeURIComponent(term)}`);
      }
    }
  };

  const startListening = () => {
    if (recognition && speechSupported && !isListening) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  if (!speechSupported) {
    return (
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" variant="primary">
            <i className="fas fa-search"></i>
          </Button>
        </InputGroup>
      </Form>
    );
  }

  return (
    <div role="search" aria-label="Product search">
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <span className="input-group-text bg-white border-end-0">
            <i className="fas fa-search text-muted"></i>
          </span>
          <Form.Control
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search for products"
            aria-describedby="search-help"
            className="border-start-0 border-end-0"
            style={{ borderLeft: 'none', borderRight: 'none' }}
          />
          <Button
            type="button"
            variant={isListening ? "danger" : "outline-primary"}
            onClick={isListening ? stopListening : startListening}
            disabled={!speechSupported}
            className="voice-btn border-start-0"
            aria-label={isListening ? "Stop voice search" : "Start voice search"}
            aria-pressed={isListening}
            title={speechSupported ? (isListening ? "Stop listening" : "Use voice search") : "Voice search not supported"}
          >
            {isListening ? (
              <i className="fas fa-stop text-white" aria-hidden="true"></i>
            ) : (
              <i className="fas fa-microphone" aria-hidden="true"></i>
            )}
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            aria-label="Search products"
            className="border-start-0"
          >
            <i className="fas fa-search" aria-hidden="true"></i>
          </Button>
        </InputGroup>
      </Form>
      
      <div id="search-help" className="visually-hidden">
        Enter keywords to search for products, or use the microphone button for voice search
      </div>
      
      {isListening && (
        <Alert variant="info" className="mt-2 mb-0 d-flex align-items-center" role="status" aria-live="polite">
          <div className="me-2">
            <i className="fas fa-microphone-alt text-primary fa-pulse" aria-hidden="true"></i>
          </div>
          <div>
            <span className="fw-bold">Listening...</span> Speak clearly now!
          </div>
        </Alert>
      )}

      {!speechSupported && (
        <Alert variant="warning" className="mt-2 mb-0 d-flex align-items-center">
          <i className="fas fa-exclamation-triangle me-2" aria-hidden="true"></i>
          Voice search is not supported in your browser. Try Chrome or Edge.
        </Alert>
      )}
    </div>
  );
};

export default VoiceSearch;
