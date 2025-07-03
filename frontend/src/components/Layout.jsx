// frontend/src/components/Layout.jsx
import React from 'react';
import { Link, Outlet, NavLink } from 'react-router-dom';
import styles from './Layout.module.css';
import logo from '../assets/logo.png';
import Footer from './Footer'; // <-- NEU: Importieren
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();

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
            {user && user.user_id ? (
              <>
                <NavLink to={`/profile/${user.user_id}`} className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}>
                  Mein Profil
                </NavLink>
                <button onClick={logout} className={styles.navLink} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/register" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}>
                  Registrieren
                </NavLink>
                <NavLink to="/login" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}>
                  Login
                </NavLink>
              </>
            )}
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