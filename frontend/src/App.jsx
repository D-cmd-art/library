import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Ebooks from './pages/Ebooks';
import Home from './pages/Home';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import About from './pages/About';
import Login from './auth/Login';
import Register from './auth/Register';
import MyAccount from './pages/MyAccount';
import AdminApp from './AdminPanel';
import BookPreview from './pages/Bookpreview';
import BorrowBooks from './pages/Browsebook';
import DonateBook from './pages/Donatebook';
import UpdateProfile from './pages/Updateprofile';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/ebooks" element={<><Navbar /><Ebooks /></>} />
        <Route path="/reviews" element={<><Navbar /><Reviews /></>} />
        <Route path="/contact" element={<><Navbar /><Contact /></>} />
        <Route path="/account" element={<><Navbar /><MyAccount /></>} />
        <Route path="/about" element={<><Navbar /><About /></>} />
        <Route path="/browsebook" element={<><Navbar /><BorrowBooks /></>} />
        <Route path="/preview/:id" element={<><Navbar /><BookPreview /></>} />
          <Route path="/donate" element={<><Navbar /><DonateBook /></>} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/update-profile" element={<UpdateProfile />} /> {/* New Route */}
        {/* Add your other routes here, e.g., home page */}
        <Route path="/" element={<div>Home Page (Placeholder)</div>} /> 
        
        {/* Admin Dashboard */}
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </Router>
  );
};

export default App;
