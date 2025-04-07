import { useState, useRef, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageWrapperContext } from '../pages/PageWrapper.jsx';
import Loader from '../components/Loader.jsx';
import validationService from '../services/validationService.js';
import userService from '../services/userService.js';
import '../styles/Login.css';

function Login({ isLogin }) {
  const navigate = useNavigate();

  const {
    setUser,
    setErrorMsg,
    setSuccessMsg,
    setSuccessMsgCallback,
    setSuccessMsgMillis,
  } = useContext(PageWrapperContext);

  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const loginFormRef = useRef();
  const passwordInputRef = useRef();

  function successCallback() {
    navigate('/blog');
  }

  const title = isLogin ? 'Log in' : 'Sign up';

  const msg = isLogin
    ? "Don't have an account yet? Please, click "
    : 'Have an account already? Please, click ';

  function handleValueChange(e) {
    const input = e.target;
    setValues((prev) => ({ ...prev, [input.name]: input.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setIsLoading(true);

    try {
      const user = await validationService.validateLoginForm(
        loginFormRef.current,
        isLogin,
        setErrors,
      );

      if (loginFormRef.current.checkValidity()) {
        if (isLogin) {
          setUser(user);
          setSuccessMsg("You've logged in successfully!");
          setSuccessMsgCallback(successCallback);
          setSuccessMsgMillis(3000);
        } else {
          const newUser = await userService.createUser(
            values.email,
            values.password,
          );

          setUser(newUser);
          setSuccessMsg("You've created a user successfully!");
          setSuccessMsgCallback(successCallback);
          setSuccessMsgMillis(3000);
        }
      }
    } catch {
      setErrorMsg(`Error ${isLogin ? 'authenticating' : 'creating'} a user!`);
    } finally {
      setIsLoading(false);
    }
  }

  function togglePasswordVisibility() {
    if (isPasswordShown) {
      passwordInputRef.current.type = 'password';
    } else {
      passwordInputRef.current.type = 'text';
    }

    setIsPasswordShown(!isPasswordShown);
  }

  return (
    <section className="login-page">
      <div className="login-wrapper">
        {isLoading && (
          <Loader
            text={(isLogin ? 'Authenticating' : 'Creating') + ' a user'}
            spinner={2}
            background={true}
          />
        )}

        <header className="login-title">
          <h2>{title}</h2>
        </header>
        <form
          ref={loginFormRef}
          className="login-form"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="login-fields">
            <div className="login-field">
              <label htmlFor="email">Email address</label>
              <input
                value={values.email}
                onChange={handleValueChange}
                type="email"
                name="email"
                placeholder="Email"
                required
                minLength="5"
                maxLength="30"
              />
              {errors.email && (
                <>
                  <div className="err">{errors.email}</div>
                </>
              )}
            </div>
            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  ref={passwordInputRef}
                  value={values.password}
                  onChange={handleValueChange}
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  minLength="5"
                  maxLength="30"
                />
                <div className="password-visibility">
                  {!isPasswordShown && (
                    <button
                      type="button"
                      className="show"
                      onClick={togglePasswordVisibility}
                    >
                      <span className="material-symbols-outlined">
                        visibility
                      </span>
                    </button>
                  )}

                  {isPasswordShown && (
                    <button
                      type="button"
                      className="hide"
                      onClick={togglePasswordVisibility}
                    >
                      <span className="material-symbols-outlined">
                        visibility_off
                      </span>
                    </button>
                  )}
                </div>
              </div>
              {errors.password && (
                <>
                  <div className="err">{errors.password}</div>
                </>
              )}
            </div>
          </div>
          <div className="login-legend">
            {msg}
            <Link to={isLogin ? '/signup' : '/login'}>here</Link>
            {'!'}
          </div>
          <div className="login-submit">
            <button type="submit" className="login-submit">
              {title}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;
