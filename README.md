🎨 Momentum Web – Frontend

    Frontend moderno y responsivo para el seguimiento de hábitos, diseñado con Vite + React y comunicación completa con la API Momentum.

🧩 📌 1. OBJETIVO

    El frontend permite:

        Registrar e iniciar sesión.

        Visualizar hábitos en un Dashboard moderno.

        Registrar progreso diario con un clic.

        Ver rachas actuales y mejores marcas.

        Visualizar historial con pelotitas FULL / PARTIAL / NONE.

        Crear / editar / eliminar hábitos.

🧠 📌 2. STACK TECNOLÓGICO
        Tecnología	        Uso
        React 18	        Frontend
        Vite	            Bundler
        Context API         Manejo global de sesión
        Fetch API	        Requests
        Lucide Icons	    UI Icons
        CSS puro	        Estilos

📁 📌 3. ESTRUCTURA DEL PROYECTO
    
    src/
    ├── config/
    │   └── environment.js
    ├── context/
    │   └── AuthContext.jsx
    ├── hooks/
    │   ├── useFetch.jsx
    │   └── useForm.jsx
    ├── Middleware/
    │   └── AuthMiddleware.jsx
    ├── Screens/
    │   ├── AddHabitScreen/
    │   ├── DailyEntriesScreen/
    │   ├── DashboardScreen/
    │   ├── EditHabitModal/
    │   ├── HomeScreen/
    │   ├── InitialScreen/
    │   ├── LoginScreen/
    │   ├── RegisterScreen/
    │   ├── SettingsScreen/
    │   └── StatsScreen/
    ├── services/
    │   ├── authService.js
    │   ├── habitService.js
    │   └── workspaceService.js
    ├── styles/
    └── App.jsx

🔐 📌 4. AUTENTICACIÓN (Context + Middleware)

    AuthContext almacena:

        token

        userName

        Middleware redirige automáticamente si no hay sesión válida.

🔗 📌 5. INTEGRACIÓN CON LA API

    Todas las llamadas usan Fetch mediante servicios propios:

    src/services/habitService.js
    src/services/authService.js

    Ejemplo:

    export async function getHabits() {
        return fetch(API_URL + "/api/habits", {
            headers: { Authorization: "Bearer " + token }
        });
    }

🎯 📌 6. FUNCIONALIDADES PRINCIPALES
    ✔ Dashboard

        Lista de hábitos

        Racha actual / mejor racha

        Historial 7 días (pelotitas verde/amarillo/rojo)

        Botón "Registrar hoy"

        Boton editar

        Botón eliminar

    ✔ Add Habit

        Crear hábitos (numéricos / booleanos)

    ✔ Daily Entries

        Cargar valores manualmente

    ✔ Auth (Login / Register)

        Validaciones

        Feedback visual

        Redirección automática

⚙️ 📌 7. INSTALACIÓN

    npm install
    npm run dev

    Variables:

    VITE_APP_API_URL=http://localhost:8080

🚀 📌 8. DEPLOY

    Frontend desplegado en Vercel:  

        👉 https://momentum-orcin-six.vercel.app/

✔️ 📌 9. ESTADO ACTUAL

    Todo funcionando:

        Login/registro/verificación

        Dashboard

        Rachas

        Historial 7 días

        Crear/editar/eliminar hábitos

        Registrar progreso

🎉 Autor

Vito Lattanzi – Full Stack Developer