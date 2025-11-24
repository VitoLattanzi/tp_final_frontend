import React, { useState } from 'react'
import useForm from '../../../hooks/useForm'
import { register } from '../../../services/authService'
import useFetch from '../../../hooks/useFetch'
import "../../../styles/Register-Login.css"

const RegisterScreen = () => {
    //Guardamos los campos que tendra nuestro form
    const REGISTER_FORM_FIELDS = {
        USERNAME: 'username',
        EMAIL: 'email',
        PASSWORD: 'password'
    }
    
    const [showPassword, setShowPassword] = useState(false);

    //Que valor tendra inicialmente el estado de formulario
    const initial_form_state = {
        [REGISTER_FORM_FIELDS.USERNAME]: '',
        [REGISTER_FORM_FIELDS.EMAIL]: '',
        [REGISTER_FORM_FIELDS.PASSWORD]: ''
    }

    //Estados para manejar una consulta al servidor
    const {response, error, loading, sendRequest} = useFetch()

    function onRegister (form_state_sent) {

        sendRequest(
            () => {
                return register(
                    form_state_sent[REGISTER_FORM_FIELDS.USERNAME], 
                    form_state_sent[REGISTER_FORM_FIELDS.EMAIL], 
                    form_state_sent[REGISTER_FORM_FIELDS.PASSWORD]
                )
            }
        )
    }

    //Alternativa, usar react hook forms / React formik
    const {
        form_state, 
        onInputChange, 
        handleSubmit, 
        resetForm
    } = useForm(
        initial_form_state, 
        onRegister
    )
    
    return (
        <div>
        <form onSubmit={handleSubmit}>
            <div className="form-field">
            <label htmlFor="username">Nombre:</label>
            <input 
                type="text" 
                placeholder="nombre de usuario" 
                value={form_state[REGISTER_FORM_FIELDS.USERNAME]}
                name={REGISTER_FORM_FIELDS.USERNAME}
                id="username"
                onChange={onInputChange}
            />
            </div>

            <div className="form-field">
            <label htmlFor="email">Email:</label>
            <input 
                type="text" 
                placeholder="correo electronico" 
                value={form_state[REGISTER_FORM_FIELDS.EMAIL]}
                name={REGISTER_FORM_FIELDS.EMAIL}
                onChange={onInputChange}
                id="email"
            />
            </div>

            <div className="form-field">
            <label htmlFor="password">Contraseña:</label>
            <div className="password-input-wrapper">
                <input 
                type={showPassword ? "text" : "password"} 
                placeholder="contraseña" 
                value={form_state[REGISTER_FORM_FIELDS.PASSWORD]}
                name={REGISTER_FORM_FIELDS.PASSWORD}
                onChange={onInputChange}
                id="password"
                />
                <button
                type="button"
                className={`password-toggle-btn ${showPassword ? "is-active" : ""}`}
                    onClick={() => setShowPassword(prev => !prev)}
                    >
                {/* “Icono” de ojo simple con SVG */}
                <svg viewBox="0 0 24 24" className="password-toggle-icon">
                    <path d="M12 5C7 5 3.3 8.1 2 12c1.3 3.9 5 7 10 7s8.7-3.1 10-7c-1.3-3.9-5-7-10-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
                </svg>
                </button>
            </div>
            </div>

            {error && <span className="form-message form-message--error">{error}</span>}
            {response && <span className="form-message form-message--success">Usuario registrado con exito!</span>}

            {loading
            ? <button className="auth-submit-btn" disabled>Registrando</button>
            : <button className="auth-submit-btn">Registrarse</button>
            }
        </form>
        </div>
    );
}

export default RegisterScreen