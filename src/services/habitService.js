import ENVIRONMENT from "../config/environment";

function getAuthHeaders(extra = {}) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
        throw new Error("No hay token de autenticación. Iniciá sesión nuevamente.");
    }
    return {
        ...extra,
        Authorization: `Bearer ${token}`,
    };
}

// GET /api/habits
export async function getHabits() {
    try {
        const response_http = await fetch(
            ENVIRONMENT.URL_APP_API + "/api/habits",
            {
                method: "GET",
                headers: getAuthHeaders(),
            }
        );
        if (!response_http.ok) {
            throw new Error("Error al obtener la lista de hábitos");
        }

        const response = await response_http.json();
        // el back devuelve { ok: true, habits: ..., etc}
        return response;
    } catch (error) {
        console.error("Error al obtener hábitos:", error);
        throw new Error(error.message || "Error interno del servidor");
    }
}

// POST /api/habits
export async function createHabit(habitData) {
    try {
        const response_http = await fetch(
            ENVIRONMENT.URL_APP_API + "/api/habits",
            {
                method: "POST",
                headers: getAuthHeaders({
                    "Content-Type": "application/json",
                }),
                body: JSON.stringify(habitData),
            }
        );

        const response = await response_http.json();

        if (!response_http.ok || !response.ok) {
 
        const message =
            response?.details?.[0]?.message ||
            response?.message ||
            "Error al crear el hábito";
            throw new Error(message);
        }

        // { ok: true, habit: {...} }
        return response;
    } catch (error) {
        console.error("Error al crear hábito:", error);
        throw new Error(error.message || "Error interno del servidor");
    }
}

// POST /api/habits/:habitId/entries
export async function createHabitEntry(habitId, { date, value }) {
    try {
        const body = { date, value };

        const response_http = await fetch(
            ENVIRONMENT.URL_APP_API + `/api/habits/${habitId}/entries`,
            {
                method: "POST",
                headers: getAuthHeaders({
                    "Content-Type": "application/json",
                }),
                body: JSON.stringify(body),
            }
        );

        const response = await response_http.json();

        if (!response_http.ok || !response.ok) {
            const message =
                response?.details?.[0]?.message ||
                response?.message ||
                "Error al registrar la entrada del hábito";
            throw new Error(message);
        }

        // { ok: true, entry: {...} }
        return response;
    } catch (error) {
        console.error("Error al crear entrada de hábito:", error);
        throw new Error(error.message || "Error interno del servidor");
    }
}
