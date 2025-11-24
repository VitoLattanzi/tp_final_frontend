import { useState, useEffect } from "react";
import LoginScreen from "./LoginScreen/LoginScreen.jsx";
import RegisterScreen from "./RegisterScreen/RegisterScreen.jsx";
import { useSearchParams } from "react-router-dom";
import "../../styles/InitialScreen.css";

export default function InitialScreen({ defaultTab = "login" }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const qTab = searchParams.get("tab");
    
    const [tab, setTab] = useState(
        qTab === "register" || qTab === "login" ? qTab : defaultTab
    ); 

    // 1. EFECTO PARA DETECTAR VERIFICACIÓN DE EMAIL
    useEffect(() => {
        const verified = searchParams.get("verified");

        if (verified === "true") {
            // Éxito: Mostramos mensaje y forzamos la pestaña de Login
            alert("¡Email verificado con éxito! Ya podés iniciar sesión.");
            setTab("login");
            
            // Limpiamos la URL para sacar el "?verified=true" sin recargar
            setSearchParams({}); 
        } 
        
        if (verified === "error") {
            // Error: Mostramos mensaje
            alert("El link de verificación es inválido o expiró.");
            setSearchParams({});
        }
    }, [searchParams, setSearchParams]);

    // 2. EFECTO PARA DETECTAR CAMBIOS EN LA PESTAÑA
    useEffect(() => {
        if (qTab === "login" || qTab === "register") setTab(qTab);
    }, [qTab]);

    const isLogin = tab === "login";
    const isRegister = tab === "register";

    const handleTabChange = (tab) => {
        setTab(tab);
    };
    
    return (
        <div className="auth-conteiner">      
            <div className="auth-header">
                <p className="auth-tittle">MOMENTUM</p>
            </div>

            {/* recuadro de registro/login*/}
            <div className="auth-card">
                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${isLogin ? "active" : ""}`}
                        onClick={() => handleTabChange("login")}
                    >
                    Login
                    </button>
                    <button
                        className={`auth-tab ${isRegister ? "active" : ""}`}
                        onClick={() => handleTabChange("register")}
                    >
                    Register
                    </button>
                </div>

                <div className="auth-content">
                    {isLogin ? <LoginScreen /> : <RegisterScreen />}
                </div>
            </div>
        </div>
    );
}