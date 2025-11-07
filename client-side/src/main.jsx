import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import App from './App.jsx';
import { store, persistor } from './redux/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import ThemeProvider from './components/ThemeProvider.jsx';
import { BrowserRouter as Router } from 'react-router-dom';  // Import BrowserRouter

createRoot(document.getElementById('root')).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <ThemeProvider>
        <Router>  {/* Wrap the App with Router */}
          <App />
        </Router>
      </ThemeProvider>
    </Provider>
  </PersistGate>
);
