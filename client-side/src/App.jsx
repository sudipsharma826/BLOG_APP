import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import Footer from './components/FooterPage';
import PrivateRoute from './components/PrivateRoutes';
import DashBoard from './pages/DashBoard';
import NotFound from './pages/NotFound';


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
        <Route element={<PrivateRoute  />}>
        <Route path="/dashboard" element={<DashBoard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
