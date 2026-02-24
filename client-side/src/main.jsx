import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import App from './App.jsx';
import { store, persistor } from './redux/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import ThemeProvider from './components/ThemeProvider.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import axios from 'axios';

// Ensure axios sends cookies for cross-site requests
axios.defaults.withCredentials = true;

// Correct render tree with HelmetProvider for SEO
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <HelmetProvider>
        <ThemeProvider>
          <Router>
            <App />
          </Router>
        </ThemeProvider>
      </HelmetProvider>
    </PersistGate>
  </Provider>
);
