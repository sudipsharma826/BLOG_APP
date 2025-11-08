import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import App from './App.jsx';
import { store, persistor } from './redux/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import ThemeProvider from './components/ThemeProvider.jsx';
import { BrowserRouter as Router } from 'react-router-dom';  // Import BrowserRouter
import axios from 'axios';

// Ensure axios sends cookies for cross-site requests
axios.defaults.withCredentials = true;

// Correct render tree: Provider must wrap PersistGate so PersistGate can access the store via context
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <ThemeProvider>
        <Router>
          <App />
        </Router>
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
