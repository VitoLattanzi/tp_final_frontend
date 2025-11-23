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

/* GET HABITS  */
export async function getHabits() {
  try {
    const response_http = await fetch(
      ENVIRONMENT.URL_APP_API + "/api/habits",
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    const response = await response_http.json();

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

    return response;
  } catch (error) {
    console.error("Error al crear hábito:", error);
    throw error;
  }
}

/* DELETE HABIT */
export async function deleteHabit(habitId) {
  try {
    const response_http = await fetch(
      ENVIRONMENT.URL_APP_API + `/api/habits/${habitId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

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

/* CREATE ENTRY*/
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

    return response;
  } catch (error) {
    console.error("Error al crear entrada de hábito:", error);
    throw error;
  }
}

/* GET 7-DAY HISTORIAL */
export async function getHabitHistory(habitId, days = 7) {
  try {
    const url =
      ENVIRONMENT.URL_APP_API +
      `/api/entries/${habitId}/history?days=${days}`;

    const response_http = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const response = await response_http.json();

    if (!response_http.ok || !response.ok) {
      throw new Error(response?.message || "Error al obtener historial");
    }

    // YA VIENE COMO STRING "YYYY-MM-DD"
    const normalized = response.days.map((d) => ({
      date: d.date,
      status: d.status,
    }));

    return { habitId: response.habitId, days: normalized };
  } catch (error) {
    console.error("Error al obtener historial:", error);
    throw error;
  }
}
