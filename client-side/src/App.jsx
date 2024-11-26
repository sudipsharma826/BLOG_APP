import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import Footer from './components/FooterPage';


const App = () => {
  return (
    <BrowserRouter>
    < NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Home />} />
        <Route path="/projects"  />
        <Route path="/signup"  element={<SignUpPage />}/>
        <Route path="/signin"  element={< SignInPage/>}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
