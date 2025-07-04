import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout'; 
import LandingPage from './components/LandingPage'; // NEU: Importieren
import Register from './components/Register';
import Profile from './components/Profile';
import RoomList from './components/RoomList';
import RoomView from './components/RoomView';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Die LandingPage ist jetzt die Startseite */}
          <Route index element={<LandingPage />} /> 
          <Route path="register" element={<Register />} />
          <Route path="profile/:userId" element={<Profile />} />
          <Route path="rooms" element={
  <ProtectedRoute>
    <RoomList />
  </ProtectedRoute>
} />
<Route path="rooms/:roomId" element={
  <ProtectedRoute>
    <RoomView />
  </ProtectedRoute>
} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<div><h2>404 - Seite nicht gefunden</h2></div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
