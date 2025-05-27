import React from 'react';
import { Button } from 'react-bootstrap';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline-secondary"
      size="sm"
      onClick={toggleTheme}
      className="theme-toggle-btn"
      style={{
        borderRadius: '50px',
        padding: '8px 12px',
        transition: 'all 0.3s ease',
        border: 'none',
        background: theme === 'dark' ? '#ffd700' : '#2c3e50',
        color: theme === 'dark' ? '#000' : '#fff'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
      }}
    >
      <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
    </Button>
  );
};

export default ThemeToggle;
