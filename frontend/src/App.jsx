import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout'; 
import LandingPage from './components/LandingPage'; // NEU: Importieren
import Register from './components/Register';
import Profile from './components/Profile';
import RoomList from './components/RoomList';
import RoomView from './components/RoomView';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import SwipeInterface from './components/SwipeInterface';
import MatchList from './components/MatchList';
import MatchModal from './components/MatchModal';

// Platzhalter-Seiten für den Footer
const Impressum = () => (
  <div style={{ padding: '20px', color: 'var(--text-primary)' }}>
    <h2>Impressum</h2>
    <p>Angaben gemäß § 5 TMG</p>
    <p>M.H.</p>
    <p>Musterstraße 1</p>
    <p>12345 Musterstadt</p>
    <p><strong>Kontakt:</strong></p>
    <p>E-Mail: beispiel@email.de</p>
  </div>
);

const Datenschutz = () => (
  <div style={{ padding: '20px', color: 'var(--text-primary)', maxWidth: '800px', margin: '0 auto' }}>
    <h2>Datenschutzerklärung</h2>
    <p>Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zweck der Verarbeitung von personenbezogenen Daten (nachfolgend „Daten“) innerhalb unserer App ReelMatch auf.</p>
    
    <h3>1. Verantwortlicher</h3>
    <p>M.H., Musterstraße 1, 12345 Musterstadt, beispiel@email.de</p>

    <h3>2. Arten der verarbeiteten Daten</h3>
    <ul>
      <li>Bestandsdaten (z.B. Namen, Adressen)</li>
      <li>Kontaktdaten (z.B. E-Mail, Telefonnummern)</li>
      <li>Inhaltsdaten (z.B. Texteingaben, Fotografien, Videos)</li>
      <li>Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten)</li>
      <li>Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen)</li>
    </ul>

    <h3>3. Zweck der Verarbeitung</h3>
    <p>Zurverfügungstellung der App, ihrer Funktionen und Inhalte, Beantwortung von Kontaktanfragen und Kommunikation mit Nutzern, Sicherheitsmaßnahmen, Reichweitenmessung/Marketing.</p>
    <p><i>Bitte beachten Sie: Dies ist ein fiktiver Text und dient nur als Platzhalter. Er hat keine rechtliche Gültigkeit.</i></p>
  </div>
);

const Agb = () => (
  <div style={{ padding: '20px', color: 'var(--text-primary)', maxWidth: '800px', margin: '0 auto' }}>
    <h2>Allgemeine Geschäftsbedingungen (AGB)</h2>
    
    <h3>§ 1 Geltungsbereich</h3>
    <p>Für die Nutzung dieser App durch den Nutzer gelten die nachfolgenden Allgemeinen Geschäftsbedingungen. Die Nutzung der App ist nur zulässig, wenn der Nutzer diese AGB akzeptiert.</p>

    <h3>§ 2 Vertragsgegenstand</h3>
    <p>ReelMatch stellt eine Plattform zur Verfügung, auf der Nutzer Videoclips hochladen und mit anderen Nutzern interagieren können. Der genaue Umfang der Leistungen ergibt sich aus der Beschreibung in der App.</p>

    <h3>§ 3 Pflichten des Nutzers</h3>
    <p>Der Nutzer verpflichtet sich, keine Inhalte zu veröffentlichen, die gegen geltendes Recht oder die guten Sitten verstoßen. Dies umfasst insbesondere, aber nicht ausschließlich, beleidigende, rassistische, pornografische oder urheberrechtlich geschützte Inhalte.</p>
    
    <h3>§ 4 Haftungsausschluss</h3>
    <p>Wir übernehmen keine Gewähr für die von Nutzern veröffentlichten Inhalte. Jeder Nutzer ist für die von ihm eingestellten Inhalte selbst verantwortlich.</p>
    <p><i>Bitte beachten Sie: Dies ist ein fiktiver Text und dient nur als Platzhalter. Er hat keine rechtliche Gültigkeit.</i></p>
  </div>
);

const Kontakt = () => (
  <div style={{ padding: '20px', color: 'var(--text-primary)' }}>
    <h2>Kontakt</h2>
    <p>Für Fragen und Anmerkungen erreichen Sie uns unter:</p>
    <p>E-Mail: support@reelmatch.example.com</p>
  </div>
);

function App() {
  const [matchModalData, setMatchModalData] = useState(null);

  const handleMatch = (matchData) => {
    setMatchModalData(matchData);
  };

  const closeMatchModal = () => {
    setMatchModalData(null);
  };

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
          {/* Neue Match-System Routen */}
          <Route path="swipe" element={
            <ProtectedRoute>
              <SwipeInterface onMatch={handleMatch} />
            </ProtectedRoute>
          } />
          <Route path="matches" element={
            <ProtectedRoute>
              <MatchList />
            </ProtectedRoute>
          } />
          {/* Routen für die Footer-Links */}
          <Route path="impressum" element={<Impressum />} />
          <Route path="datenschutz" element={<Datenschutz />} />
          <Route path="agb" element={<Agb />} />
          <Route path="kontakt" element={<Kontakt />} />
          <Route path="*" element={<div><h2>404 - Seite nicht gefunden</h2></div>} />
        </Route>
      </Routes>
      
      {/* Match Modal - global verfügbar */}
      <MatchModal 
        match={matchModalData} 
        isOpen={!!matchModalData} 
        onClose={closeMatchModal} 
      />
    </Router>
  );
}

export default App;
