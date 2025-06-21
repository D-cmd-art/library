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
import AdminNavbar from './Admin/adminnav';
import AdminPanel from './AdminPanel';
import ManageBooks from './Admin/ManageBooks';
import Ebook from './Admin/Ebook';
import { useLocation } from 'react-router-dom';
import BorrowRequests from './Admin/BorrowRequests';


const App = () => {
  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ebooks" element={<Ebooks />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/account" element={<MyAccount />} />
        <Route path="/about" element={<About />} />
        <Route path='/login' element={<Login/>}/>
         <Route path='/Register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>


         <Route path="/admin" element={<AdminPanel />} />
          <Route path="/managebook" element={<ManageBooks />} />
         <Route path="/borrowrequests" element={<BorrowRequests />} />
   <Route path="/ebook" element={<Ebook/>} />
      </Routes>
    </Router>
  );
};

export default App;
