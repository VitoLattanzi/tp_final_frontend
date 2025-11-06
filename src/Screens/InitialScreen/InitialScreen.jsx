import React, { useState, useEffect } from "react";
import LoginScreen from "./LoginScreen/LoginScreen.jsx";
import RegisterScreen from "./RegisterScreen/RegisterScreen.jsx";
import { useSearchParams } from "react-router-dom";

export default function InitialScreen({ defaultTab = "login" }) {
    const [searchParams] = useSearchParams();
    const qTab = searchParams.get("tab");
    const [tab, setTab] = useState(
        qTab === "register" || qTab === "login" ? qTab : defaultTab
    );

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
                <p>Bienvenido a MOMENTUM</p>
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




/* ruta /auth/login o regstres

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoginScreen from "./LoginScreen/LoginScreen.jsx";
import RegisterScreen from "./RegisterScreen/RegisterScreen.jsx";

export default function InitialScreen({ defaultTab = "login" }) {
    const location = useLocation();
    const navigate = useNavigate();

    const isRegister = location.pathname.includes("register");
    const isLogin = !isRegister;

    const handleTabChange = (tab) => {
        navigate(`/auth/${tab}`);
    };
*/

    /*  */