import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Profile from './components/Profile';
import RoomList from './components/RoomList'; // Neu
import RoomView from './components/RoomView'; // Neu

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/rooms">Themenräume</Link></li>
            {/* Im MVP: Simulierter Link zum eigenen Profil */}
            <li><Link to="/profile/1">Mein Profil (User 1)</Link></li>
          </ul>
        </nav>
        <hr />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/rooms" element={<RoomList />} /> {/* Neu */}
          <Route path="/rooms/:roomId" element={<RoomView />} /> {/* Neu */}
          <Route path="/" element={<RoomList />} /> {/* Default auf RoomList */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
