import { useEffect, useState } from "react";
import {
  getHabits,
  createHabitEntry,
  deleteHabit,
  getHabitHistory,
} from "../../services/habitService";
import "../../styles/DashboardScreen.css"; 
import { Trash2 } from "lucide-react";

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function DashboardScreen() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submittingId, setSubmittingId] = useState(null);

  const [confirmHabit, setConfirmHabit] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const today = todayISO();

  /* CARGAR HÁBITOS */
  async function loadHabits() {
    try {
      setLoading(true);
      const response = await getHabits();
      setHabits(response.habits || []);
    } catch (err) {
      console.error("Error cargando hábitos:", err);
      setError(err?.message || "Error al obtener hábitos");
    } finally {
      setLoading(false);
    }
  }

  /* CARGAR HISTORIAL */
  async function loadHistory() {
    try {
      const updated = [];
      for (let h of habits) {
        const history = await getHabitHistory(h._id, 7);
        updated.push({ ...h, history: history.days });
      }
      setHabits(updated);
    } catch (err) {
      console.error("Error cargando historial de hábito:", err);
    }
  }

  /* REGISTRAR ENTRADA */
  async function handleAddToday(habit) {
    try {
      setSubmittingId(habit._id);
      const isBool = habit.type === "boolean";
      const value = isBool ? 1 : Number(habit.dailyGoal);

      await createHabitEntry(habit._id, { date: today, value });

      await loadHabits();
      await loadHistory();
    } catch (error) {
      console.error("Error registrando entrada:", error);
      alert(error.message);
    } finally {
      setSubmittingId(null);
    }
  }

  /* ELIMINAR HÁBITO */
  async function handleDeleteHabit() {
    if (!confirmHabit) return;
    try {
      setDeleting(true);
      await deleteHabit(confirmHabit._id);
      setConfirmHabit(null);
      await loadHabits();
    } catch (error) {
      console.error("Error eliminando hábito:", error);
      alert(error.message);
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    if (habits.length > 0) loadHistory();
  }, [habits.length]);

  function renderHistoryDots(history = []) {
    const statusClasses = {
      FULL: "habit-history-dot--full",
      PARTIAL: "habit-history-dot--partial",
      NONE: "habit-history-dot--none",
    };

    return (
      <div className="habit-history">
        {history.map((d, idx) => {
          const statusClass = statusClasses[d.status] || "habit-history-dot--none";
          return (
            <div
              key={idx}
              className={`habit-history-dot ${statusClass}`}
              title={d.date}
            />
          );
        })}
      </div>
    );
  }

  if (loading) return <div className="dashboard"><p>Cargando hábitos...</p></div>;
  if (error) return <div className="dashboard"><p className="dashboard-status dashboard-status--error">{error}</p></div>;

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Visualizá tus hábitos y registrá el progreso de hoy.
          </p>
        </div>
      </div>

      {/* GRID */}
      <div className="habit-grid">
        {habits.map((habit) => (
          <div key={habit._id} className="habit-card">
            
            {/* CARD HEADER */}
            <div className="habit-card-header">
              <div>
                <h3 className="habit-name">{habit.name}</h3>                
              </div>
              
              <button 
                className="habit-delete-btn"
                onClick={() => setConfirmHabit(habit)}
                title="Eliminar hábito"
              >
                <Trash2 className="habit-delete-icon" />
              </button>
            </div>

            {/* INFO */}
            <p className="habit-detail">
              <strong>Meta:</strong> {habit.dailyGoal} {habit.unit}
            </p>
            
            {/* RACHAS  */}
            <p className="habit-detail">
              Racha: <strong>{habit.currentStreak}</strong> 🔥 · Mejor: <strong>{habit.bestStreak}</strong> 🏆
            </p>

            {/* HISTORIAL */}
            {renderHistoryDots(habit.history)}

            {/* BOTÓN DE ACCIÓN */}
            <button
              disabled={submittingId === habit._id}
              onClick={() => handleAddToday(habit)}
              className="habit-button"
            >
              {submittingId === habit._id ? "Guardando..." : "Registrar hoy"}
            </button>
          </div>
        ))}
      </div>

      {/* panel de eliminación de hábito confirmar */}
      {confirmHabit && (
        <div className="dashboard-confirm-overlay">
          <div className="dashboard-confirm-dialog">
            <h3 className="dashboard-confirm-title">Eliminar hábito</h3>
            <p className="dashboard-confirm-text">
              ¿Estás seguro que querés eliminar <strong>"{confirmHabit.name}"</strong>?
            </p>

            <div className="dashboard-confirm-actions">
              <button 
                className="dashboard-confirm-btn dashboard-confirm-btn--secondary"
                onClick={() => setConfirmHabit(null)}
              >
                Cancelar
              </button>

              <button
                disabled={deleting}
                className="dashboard-confirm-btn dashboard-confirm-btn--danger"
                onClick={handleDeleteHabit}
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}