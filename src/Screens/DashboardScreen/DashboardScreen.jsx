import { useEffect, useState } from "react";
import { getHabits, createHabitEntry } from "../../services/habitService";
import "../../styles/DashboardScreen.css";

const DashboardScreen = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submittingId, setSubmittingId] = useState(null);

  const loadHabits = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getHabits(); // { ok, habits }
      setHabits(response.habits || []);
    } catch (err) {
      console.error("Error cargando hábitos:", err);
      setError(err.message || "Error al cargar los hábitos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const todayISO = () => new Date().toISOString().slice(0, 10);

  const handleAddToday = async (habit) => {
    try {
      setSubmittingId(habit._id);
      setError("");

      const value =
        habit.type === "boolean" ? 1 : habit.dailyGoal || 1;

      await createHabitEntry(habit._id, {
        date: todayISO(),
        value,
      });

      // Podrías recargar streaks desde el back si los actualizás ahí
      await loadHabits();
    } catch (err) {
      console.error("Error registrando entrada:", err);
      setError(err.message || "Error al registrar la entrada");
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Visualizá tus hábitos y registrá el progreso de hoy.
          </p>
        </div>
      </header>

      {loading && <p className="dashboard-status">Cargando hábitos...</p>}
      {error && <p className="dashboard-status dashboard-status--error">{error}</p>}

      {!loading && !error && habits.length === 0 && (
        <p className="dashboard-status">
          Todavía no tenés hábitos. Creá uno desde <strong>Add Habit</strong>.
        </p>
      )}

      {!loading && !error && habits.length > 0 && (
        <div className="habit-grid">
          {habits.map((habit) => (
            <article
              key={habit._id}
              className="habit-card"
              style={{
                borderTopColor: habit.color || "#6366f1",
              }}
            >
              <div className="habit-card-header">
                <h2 className="habit-name">{habit.name}</h2>
                <span className="habit-type">
                  {habit.type === "boolean" ? "Sí / No" : "Numérico"}
                </span>
              </div>

              <p className="habit-detail">
                Objetivo diario:&nbsp;
                <strong>
                  {habit.dailyGoal} {habit.unit}
                </strong>
              </p>

              <p className="habit-detail">
                Racha actual:&nbsp;
                <strong>{habit.currentStreak ?? 0}</strong> · Mejor racha:&nbsp;
                <strong>{habit.bestStreak ?? 0}</strong>
              </p>

              <button
                className="habit-button"
                onClick={() => handleAddToday(habit)}
                disabled={submittingId === habit._id}
              >
                {submittingId === habit._id
                  ? "Guardando..."
                  : "Registrar hoy"}
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardScreen;
