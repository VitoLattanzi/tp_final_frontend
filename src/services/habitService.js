/* frontend/src/services/habitService.js */

const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080";

/* HELPER PARA TOKEN */
function getAuthHeaders(extra = {}) {
  const token = localStorage.getItem("auth_token");
  if (!token) throw new Error("No hay token. Iniciá sesión nuevamente.");
  return { ...extra, Authorization: `Bearer ${token}` };
}

/* GET HABITS */
export async function getHabits() {
  try {
    // Usamos la constante API_URL definida arriba
    const response_http = await fetch(`${API_URL}/api/habits`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const text = await response_http.text();
    let response;
    try {
        response = JSON.parse(text);
    } catch (e) {
        throw new Error("El backend no respondió un JSON válido (Revisar URL/Puerto)");
    }

    if (!response_http.ok || !response.ok) {
      throw new Error(response?.message || "Error al obtener hábitos");
    }
    return response;
  } catch (error) {
    console.error("Error al obtener hábitos:", error);
    throw error;
  }
}

/* CREATE HABIT */
export async function createHabit(habitData) {
  try {
    const response_http = await fetch(`${API_URL}/api/habits`, {
      method: "POST",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(habitData),
    });

    const response = await response_http.json();
    if (!response_http.ok || !response.ok) {
      throw new Error(response?.message || "Error al crear hábito");
    }
    return response;
  } catch (error) {
    console.error("Error al crear hábito:", error);
    throw error;
  }
}

/* DELETE HABIT */
export async function deleteHabit(habitId) {
  try {
    const response_http = await fetch(`${API_URL}/api/habits/${habitId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    const response = await response_http.json();
    if (!response_http.ok || !response.ok) {
      throw new Error(response?.message || "Error al eliminar hábito");
    }
    return response;
  } catch (error) {
    console.error("Error al eliminar hábito:", error);
    throw error;
  }
}

/* CREATE ENTRY */
export async function createHabitEntry(habitId, { date, value }) {
  try {
    const response_http = await fetch(`${API_URL}/api/habits/${habitId}/entries`, {
      method: "POST",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ date, value }),
    });

    const response = await response_http.json();
    if (!response_http.ok || !response.ok) {
      throw new Error(response?.message || "Error al registrar entrada");
    }
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

/* HISTORIAL */
export async function getHabitHistory(habitId, days = 7) {
  try {
    const response_http = await fetch(
      `${API_URL}/api/entries/${habitId}/history?days=${days}`,
      { headers: getAuthHeaders() }
    );

    const response = await response_http.json();
    if (!response_http.ok || !response.ok) {
      throw new Error(response?.message || "Error al obtener historial");
    }

    const normalized = response.days.map((d) => ({
      date: d.date,
      status: d.status,
    }));
    return { habitId: response.habitId, days: normalized };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

/* UPDATE HABIT */
export const updateHabit = async (habitId, habitData) => {
  try {
    const response_http = await fetch(`${API_URL}/api/habits/${habitId}`, {
      method: "PUT",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(habitData),
    });

    const response = await response_http.json();
    if (!response_http.ok || !response.ok) {
      throw new Error(response?.message || "Error al actualizar");
    }
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};