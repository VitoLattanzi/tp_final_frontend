import { useEffect, useState } from "react";
import {
  getHabits,
  createHabitEntry,
  deleteHabit,
  getHabitHistory,
} from "../../services/habitService";
import EditHabitModal from "./EditHabitModal/EditHabitModal.jsx"; 
import "../../styles/DashboardScreen.css";
import { Trash2, Edit2 } from "lucide-react"; 

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function DashboardScreen() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submittingId, setSubmittingId] = useState(null);

  // Estados para los Modales
  const [confirmHabit, setConfirmHabit] = useState(null); // Para borrar
  const [editingHabit, setEditingHabit] = useState(null); // Para editar (NUEVO)
  const [deleting, setDeleting] = useState(false);

  const today = todayISO();

  /* --- 1. CARGAR HÁBITOS --- */
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

  /* --- 2. CARGAR HISTORIAL (PELOTITAS) --- */
  async function loadHistory() {
    try {
      const updated = [];
      for (let h of habits) {
        const history = await getHabitHistory(h._id, 7);
        updated.push({ ...h, history: history.days });
      }
      setHabits(updated);
    } catch (err) {
      console.error("Error cargando historial:", err);
    }
  }

  /* --- 3. REGISTRAR DÍA --- */
  async function handleAddToday(habit) {
    try {
      
      setSubmittingId(habit._id);
      
      const isBool = habit.type === "boolean";
      const value = isBool ? 1 : Number(habit.dailyGoal);
      
      await createHabitEntry(habit._id, { date: today, value });
      
      window.location.reload();

    } catch (error) {
      console.error("Error registrando entrada:", error);
      alert(error.message);
      setSubmittingId(null); // Si falló "Guardando"
    }
  }
  /* --- 4. ELIMINAR HÁBITO --- */
  async function handleDeleteHabit() {
    if (!confirmHabit) return;
    try {
      setDeleting(true);
      await deleteHabit(confirmHabit._id);
      setConfirmHabit(null);
      await loadHabits();
    } catch (error) {
      console.error("Error eliminando:", error);
      alert(error.message);
    } finally {
      setDeleting(false);
    }
  }

  // Efectos de carga
  useEffect(() => {
    loadHabits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (habits.length > 0) loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habits.length]);

  // Renderizado de las pelotitas
  function renderHistoryDots(history = []) {
    const statusClasses = {
      FULL: "habit-history-dot--full",
      PARTIAL: "habit-history-dot--partial",
      NONE: "habit-history-dot--none",
    };

    return (
      <div className="habit-history">
        {history.map((d, idx) => (
          <div
            key={idx}
            className={`habit-history-dot ${statusClasses[d.status] || "habit-history-dot--none"}`}
            title={d.date}
          />
        ))}
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

      {/* GRID DE HÁBITOS */}
      <div className="habit-grid">
        {habits.map((habit) => (
          <div key={habit._id} className="habit-card">
            
            {/* CABECERA DE LA TARJETA (NOMBRE + BOTONES) */}
            <div className="habit-card-header">
              <div>
                <h3 className="habit-name">{habit.name}</h3>
              </div>
              
              <div style={{ display: 'flex', gap: '4px' }}>
                {/* Botón Editar (Lápiz) */}
                <button 
                  className="habit-delete-btn"
                  onClick={() => setEditingHabit(habit)} // Abre el modal nuevo
                  title="Editar hábito"
                  style={{ color: '#6366f1' }}
                >
                  <Edit2 className="habit-delete-icon" style={{ width: '18px', height: '18px' }} />
                </button>

                {/* Botón Eliminar (Basura) */}
                <button 
                  className="habit-delete-btn"
                  onClick={() => setConfirmHabit(habit)}
                  title="Eliminar hábito"
                >
                  <Trash2 className="habit-delete-icon" />
                </button>
              </div>
            </div>

            {/* DETALLES */}
            <p className="habit-detail">
              <strong>Meta:</strong> {habit.dailyGoal} {habit.unit}
            </p>
            
            <p className="habit-detail">
              Racha: <strong>{habit.currentStreak}</strong> 🔥 · Mejor: <strong>{habit.bestStreak}</strong> 🏆
            </p>

            {/* HISTORIAL */}
            {renderHistoryDots(habit.history)}

            {/* BOTÓN REGISTRAR HOY */}
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

      {/*  CONFIRMACIÓN DE BORRADO  */}
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

      {/* PANEL DE EDITAR */}
      {editingHabit && (
        <EditHabitModal 
            habit={editingHabit} 
            onClose={() => setEditingHabit(null)} 
            onUpdateSuccess={() => {
                window.location.reload();
            }}
        />
      )}

    </div>
  );
}