
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n'; // Importar arquivo de configuração de idioma
import App from './App';

let rootElement = document.getElementById('root');
if (!rootElement) {
  rootElement = document.createElement('div');
  rootElement.id = 'root';
  document.body.appendChild(rootElement);
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
