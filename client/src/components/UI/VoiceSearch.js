import React, { useState, useEffect } from 'react';
import { Button, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const VoiceSearch = ({ onSearch }) => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
        setError('');
      };

      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript;
        setTranscript(transcriptResult);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        if (transcript) {
          handleSearch(transcript);
        }
        setShowModal(false);
      };

      recognitionInstance.onerror = (event) => {
        setError(`Voice recognition error: ${event.error}`);
        setIsListening(false);
        setShowModal(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [transcript]);

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      if (onSearch) {
        onSearch(searchTerm);
      } else {
        navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      }
      setTranscript('');
    }
  };

  const startListening = () => {
    if (recognition) {
      setShowModal(true);
      setTranscript('');
      recognition.start();
    } else {
      setError('Speech recognition not supported in this browser');
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  return (
    <>
      <Button
        variant="outline-primary"
        size="sm"
        onClick={startListening}
        disabled={isListening}
        className="voice-search-btn"
        style={{
          borderRadius: '50px',
          padding: '8px 16px',
          transition: 'all 0.3s ease',
          transform: isListening ? 'scale(1.1)' : 'scale(1)'
        }}
      >
        <i className={`fas ${isListening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
        {isListening && <span className="ms-2">Listening...</span>}
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Voice Search</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <>
              <div className="mb-3">
                <i 
                  className={`fas fa-microphone ${isListening ? 'text-danger' : 'text-muted'}`}
                  style={{ 
                    fontSize: '3rem',
                    animation: isListening ? 'pulse 1.5s infinite' : 'none'
                  }}
                ></i>
              </div>
              <p className="text-muted">
                {isListening ? 'Listening... Speak now!' : 'Click the microphone to start'}
              </p>
              {transcript && (
                <div className="mt-3">
                  <strong>You said:</strong>
                  <div className="bg-light p-2 rounded mt-2">"{transcript}"</div>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          {isListening && (
            <Button variant="danger" onClick={stopListening}>
              Stop Listening
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </>
  );
};

export default VoiceSearch;
