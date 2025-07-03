// frontend/src/components/Layout.jsx
import React from 'react';
import { Link, Outlet, NavLink } from 'react-router-dom';
import styles from './Layout.module.css';
import logo from '../assets/logo.png';
import Footer from './Footer'; // <-- NEU: Importieren

const Layout = () => {
  return (
    <div className={styles.appRoot}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/">
            <img src={logo} alt="ReelMatch Logo" className={styles.logo} />
          </Link>
          <nav className={styles.nav}>
            <NavLink to="/rooms" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}>
              Themenräume
            </NavLink>
            <NavLink to="/profile/1" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}>
              Mein Profil
            </NavLink>
            {/* Registrieren wird eher auf der Landing Page sein */}
          </nav>
        </div>
      </header>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <Footer /> {/* <-- NEU: Footer am Ende einfügen */}
    </div>
  );
};

export default Layout;