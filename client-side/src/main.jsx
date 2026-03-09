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
import { signoutSuccess } from './redux/user/authSlice.js';

// Ensure axios sends cookies for cross-site requests
axios.defaults.withCredentials = true;

// Setup axios interceptor to handle 401 errors globally
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const errorMessage = error.response.data?.message || '';
      
      if (
        errorMessage.includes('Invalid token') || 
        errorMessage.includes('No token') ||
        errorMessage.includes('Authentication failed')
      ) {
        // Clear Redux and persisted state
        store.dispatch(signoutSuccess());
        await persistor.purge();
        
        // Redirect to signin
        window.location.href = '/signin';
      }
    }
    
    return Promise.reject(error);
  }
);

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
