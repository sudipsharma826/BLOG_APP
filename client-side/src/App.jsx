import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NavBar from './components/NavBar';

const App = () => {
  return (
    <BrowserRouter>
    < NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Home />} />
        <Route path="/projects" element={<Home />} />
        <Route path="/sign-in" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
