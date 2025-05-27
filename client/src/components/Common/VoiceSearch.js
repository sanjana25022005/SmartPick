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
          <Form.Control
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search for products"
            aria-describedby="search-help"
          />
          <Button
            type="button"
            variant={isListening ? "danger" : "outline-primary"}
            onClick={isListening ? stopListening : startListening}
            disabled={!speechSupported}
            className="voice-btn"
            aria-label={isListening ? "Stop voice search" : "Start voice search"}
            aria-pressed={isListening}
            title={speechSupported ? (isListening ? "Stop listening" : "Use voice search") : "Voice search not supported"}
          >
            <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'}`} aria-hidden="true"></i>
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            aria-label="Search products"
          >
            <i className="fas fa-search" aria-hidden="true"></i>
          </Button>
        </InputGroup>
      </Form>
      
      <div id="search-help" className="visually-hidden">
        Enter keywords to search for products, or use the microphone button for voice search
      </div>
      
      {isListening && (
        <Alert variant="info" className="mt-2 mb-0" role="status" aria-live="polite">
          <i className="fas fa-microphone me-2" aria-hidden="true"></i>
          Listening... Speak now!
        </Alert>
      )}
    </div>
  );
};

export default VoiceSearch;
