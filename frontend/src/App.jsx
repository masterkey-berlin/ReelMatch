import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Profile from './components/Profile';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/register">Register</Link></li>
            {/* Im MVP gehen wir davon aus, dass wir nach der Registrierung die User-ID kennen
                und direkt zum Profil navigieren. In einer echten App gäbe es einen Login. */}
          </ul>
        </nav>
        <hr />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/profile/:userId" element={<Profile />} />
          {/* Default Route */}
          <Route path="/" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
