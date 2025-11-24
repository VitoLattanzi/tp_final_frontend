import { useState } from "react";
import { updateHabit } from "../../../services/habitService.js"; // Ajustá la ruta ../ segun corresponda
import "../../../styles/EditHabitModal.css";

export default function EditHabitModal({ habit, onClose, onUpdateSuccess }) {
  const [formData, setFormData] = useState({
    name: habit.name,
    dailyGoal: habit.dailyGoal,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await updateHabit(habit._id, formData);
      onUpdateSuccess(); 
      onClose(); 
    } catch (err) {
      setError(err.message || "Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal-dialog">
        <h3 className="edit-modal-title">Editar Hábito</h3>
        
        <form onSubmit={handleSubmit} className="edit-modal-form">
          
          {/* Campo Nombre */}
          <div className="edit-modal-field">
            <label className="edit-modal-label">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="edit-modal-input"
              autoFocus
              required
            />
          </div>

          {/* Campo Meta */}
          <div className="edit-modal-field">
             <label className="edit-modal-label">
                Meta Diaria ({habit.unit})
             </label>
             <input
              type="number"
              name="dailyGoal"
              value={formData.dailyGoal}
              onChange={handleChange}
              min="1"
              className="edit-modal-input"
              required
            />
          </div>

          {error && <div className="edit-modal-error">{error}</div>}

          <div className="edit-modal-actions">
            <button
              type="button"
              className="edit-btn edit-btn--secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="edit-btn edit-btn--primary"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}