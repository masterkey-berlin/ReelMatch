import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Profile from './components/Profile';
import RoomList from './components/RoomList';
import RoomView from './components/RoomView';
import logo from './assets/logo.png';
import './index.css';

function App() {
  return (
    <div className="app-bg">
      <Router>
        <header className="header">
          <img src={logo} alt="ReelMatch Logo" className="logo" />
          <h1 className="title">ReelMatch</h1>
          <p className="slogan">
            Authentische Verbindungen durch <br /> Video & Themen.
          </p>
          <nav className="nav">
            <Link to="/register" className="nav-link">
              Register
            </Link>
            <Link to="/rooms" className="nav-link">
              Themenräume
            </Link>
            <Link to="/profile/1" className="nav-link">
              Mein Profil
            </Link>
          </nav>
        </header>
        <main className="main-content">
          <div className="content-box">
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/rooms" element={<RoomList />} />
              <Route path="/rooms/:roomId" element={<RoomView />} />
              <Route path="/" element={<RoomList />} />
            </Routes>
          </div>
        </main>
        <footer className="footer">
          &copy; {new Date().getFullYear()} Max Mustermann
        </footer>
      </Router>
    </div>
  );
}

export default App;
