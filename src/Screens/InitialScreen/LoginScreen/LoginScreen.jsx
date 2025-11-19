import React, { useContext, useEffect, useState} from 'react'
import { useLocation, useNavigate } from 'react-router'
import { login } from '../../../services/authService.js'
import useForm from '../../../hooks/useForm.jsx'
import useFetch from '../../../hooks/useFetch.jsx'
import { AuthContext} from "../../../context/AuthContext.jsx"
import "../../../styles/Register-Login.css"


const LoginScreen = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {onLogin} = useContext(AuthContext)
  useEffect(
    () => {
      const query = new URLSearchParams(location.search)
      const from = query.get('from')
      if (from === 'verified_email') {
        alert('Has validado tu mail exitosamente')
      }
    },
    [] //Solo queremos que se ejecute cuando se monte el componente
  )
  
  const [showPassword, setShowPassword] = useState(false);
  const LOGIN_FORM_FIELDS = {
        EMAIL: 'email',
        PASSWORD: 'password'
    }

    const initial_form_state = {
        [LOGIN_FORM_FIELDS.EMAIL]: '',
        [LOGIN_FORM_FIELDS.PASSWORD]: ''
    }

    const { response, error, loading, sendRequest, resetResponse } = useFetch()

    function handleLogin(form_state_sent) {
        resetResponse()
        sendRequest(
            () => {
                return login(
                    form_state_sent[LOGIN_FORM_FIELDS.EMAIL],
                    form_state_sent[LOGIN_FORM_FIELDS.PASSWORD]
                )
            }
        )
    }

    const {
        form_state,
        onInputChange,
        handleSubmit,
        resetForm
    } = useForm(initial_form_state, handleLogin)

    useEffect(() => {
      if (!response) return;

      console.log("Respuesta de login:", response); 

      if (response.ok && response.auth_token) {        
        onLogin(response.auth_token);
      } else {
        console.warn("Respuesta sin auth_token o sin ok:", response);
      }
    }, [response]);

  return (
    <div className="Form-login-container">
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="email">Email: </label>
          <input
            type="text"
            placeholder="correo electronico"
            value={form_state[LOGIN_FORM_FIELDS.EMAIL]}
            name={LOGIN_FORM_FIELDS.EMAIL}
            onChange={onInputChange}
            id="email"
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Password: </label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="contraseña"
              value={form_state[LOGIN_FORM_FIELDS.PASSWORD]}
              name={LOGIN_FORM_FIELDS.PASSWORD}
              onChange={onInputChange}
              id="password"
            />
            <button
              type="button"
              className={`password-toggle-btn ${showPassword ? "is-active" : ""}`}
              onClick={() => setShowPassword(prev => !prev)}
            >
              <svg viewBox="0 0 24 24" className="password-toggle-icon">
                <path d="M12 5C7 5 3.3 8.1 2 12c1.3 3.9 5 7 10 7s8.7-3.1 10-7c-1.3-3.9-5-7-10-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
              </svg>
            </button>
          </div>
        </div>

        {error && <span className="form-message form-message--error">{error}</span>}
        {response && <span className="form-message form-message--success">Successful Login</span>}

        {loading
          ? <button className="auth-submit-btn" disabled>Loggin In</button>
          : <button className="auth-submit-btn">Login</button>
        }
      </form>
    </div>
  );
}
export default LoginScreen