import { useContext, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { PageWrapperContext } from '../pages/PageWrapper.jsx';
import '../styles/Header.css';

function Header() {
  const { user, setUser, theme, setTheme } = useContext(PageWrapperContext);
  const navigate = useNavigate();

  const navRef = useRef();

  function handleLogout() {
    localStorage.removeItem('loggedInUser');
    setUser();
    navigate('/login');
  }

  function handleThemeChange() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }

  function handleMenuClick() {
    if (navRef.current.checkVisibility()) {
      navRef.current.style.display = 'none';
    } else {
      navRef.current.style.display = 'flex';
    }
  }

  return (
    <header className="page-header">
      <Link className="logo-container" to="/">
        <img
          className="logo-img"
          src="https://img.icons8.com/pulsar-color/240/chat-message.png"
          alt="site logo"
        />
        <span className="logo-legend">WriteWave</span>
      </Link>

      <nav className="navigation">
        <button
          onClick={handleMenuClick}
          type="button"
          className="material-symbols-outlined nav-menu"
        >
          menu
        </button>

        <ul ref={navRef}>
          <li>
            <NavLink className="nav-btn" to="/blog">
              Blog
            </NavLink>
          </li>
          {user && (
            <>
              <li>
                <NavLink className="nav-btn" to="/about">
                  About
                </NavLink>
              </li>
              <li>
                <NavLink className="nav-btn" to="/favorites">
                  Favorites
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className="right-content-wrapper">
        <section className="theme-switcher">
          {theme === 'dark' && (
            <button
              type="button"
              className="theme light"
              onClick={handleThemeChange}
            >
              <span className="theme-label">Light</span>
              <span className="material-symbols-outlined theme-icon">
                light_mode
              </span>
            </button>
          )}

          {theme === 'light' && (
            <button
              type="button"
              className="theme dark"
              onClick={handleThemeChange}
            >
              <span className="theme-label">Dark</span>
              <span className="material-symbols-outlined theme-icon">
                dark_mode
              </span>
            </button>
          )}
        </section>

        {user ? (
          <section className="user-wrapper">
            <Link to="/about" className="username">
              {user.email}
            </Link>
            <button
              onClick={handleLogout}
              type="button"
              className="logout nav-btn"
            >
              <span className="logout-label">Log Out</span>
              <span className="material-symbols-outlined logout-icon">
                logout
              </span>
            </button>
          </section>
        ) : (
          <section className="login-wrapper">
            <Link to="/login" className="login nav-btn">
              <span className="login-label">Log In</span>
              <span className="material-symbols-outlined login-icon">
                login
              </span>
            </Link>
            <Link to="/signup" className="signup nav-btn">
              <span className="signup-label">Sign Up</span>
              <span className="material-symbols-outlined signup-icon">
                person_add
              </span>
            </Link>
          </section>
        )}
      </div>
    </header>
  );
}

export default Header;
