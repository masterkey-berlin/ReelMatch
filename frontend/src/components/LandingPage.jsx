// frontend/src/components/LandingPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css'; // Wir erstellen diese CSS-Datei als Nächstes
import logo from '../assets/logo.png'; // Stelle sicher, dass dein Logo in src/assets liegt

function LandingPage() {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroContent}>
        <img src={logo} alt="ReelMatch Logo" className={styles.heroLogo} />

        <h1 className={styles.heroTitle}>ReelMatch</h1>

        <p className={styles.heroSubtitle}>
          Authentische Verbindungen durch <span>Video & Themen.</span>
        </p>

        <nav className={styles.heroNav}>
          <Link to="/register">
            <button>Jetzt Registrieren</button>
          </Link>
          <Link to="/rooms">
            <button>Räume Entdecken</button>
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default LandingPage;