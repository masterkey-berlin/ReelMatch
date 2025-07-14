import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.leftSection}>
          <nav className={styles.footerNav}>
            <Link to="/impressum">Impressum</Link>
            <Link to="/datenschutz">Datenschutz</Link>
            <Link to="/agb">AGB</Link>
            <Link to="/kontakt">Kontakt</Link>
          </nav>
        </div>
        <div className={styles.centerSection}>
          <span>©{new Date().getFullYear()} M.H. - ReelMatch</span>
        </div>
        <div className={styles.rightSection}>
          {/* Dieser Bereich ist leer und dient als Platzhalter */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;