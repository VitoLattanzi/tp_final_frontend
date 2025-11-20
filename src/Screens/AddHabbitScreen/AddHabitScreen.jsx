import { useState } from "react";
import { createHabit } from "../../services/habitService";
import "../../styles/AddHabitScreen.css";

const AddHabitScreen = ({ onHabitCreated }) => {
  const [form, setForm] = useState({
    name: "",
    type: "numeric",
    unit: "",
    dailyGoal: "",
    color: "#6366f1",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      setError("");

      const payload = {
        name: form.name.trim(),
        type: form.type,
        unit: form.unit.trim(),
        dailyGoal: Number(form.dailyGoal),
        color: form.color || "#6366f1",
      };

      if (!payload.name || !payload.unit || !payload.dailyGoal) {
        setError("Completá todos los campos obligatorios.");
        setSubmitting(false);
        return;
      }

      const response = await createHabit(payload);
      console.log("Hábito creado:", response.habit);

      setForm({
        name: "",
        type: "numeric",
        unit: "",
        dailyGoal: "",
        color: "#6366f1",
      });

      if (onHabitCreated) onHabitCreated();
    } catch (err) {
      console.error("Error creando hábito:", err);
      setError(err.message || "Error al crear el hábito");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-habit">
      <header className="add-habit-header">
        <h1 className="add-habit-title">Agregar hábito</h1>
        <p className="add-habit-subtitle">
          Definí un nuevo hábito para empezar a trackear tu progreso.
        </p>
      </header>

      <form className="add-habit-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre del hábito</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Leer, Tomar agua, Entrenar..."
          />
        </div>

        <div className="form-group">
          <label>Tipo</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <option value="numeric">Numérico (km, páginas, vasos...)</option>
            <option value="boolean">Booleano (hecho / no hecho)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Unidad</label>
          <input
            type="text"
            name="unit"
            value={form.unit}
            onChange={handleChange}
            placeholder="páginas, vasos, km..."
          />
        </div>

        <div className="form-group">
          <label>Objetivo diario</label>
          <input
            type="number"
            name="dailyGoal"
            value={form.dailyGoal}
            min="1"
            onChange={handleChange}
            placeholder="10"
          />
        </div>

        <div className="form-group form-group--color">
          <label>Color</label>
          <div className="color-input-wrapper">
            <input
              type="color"
              name="color"
              value={form.color}
              onChange={handleChange}
            />
            <span className="color-code">{form.color}</span>
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button
          type="submit"
          className="form-submit"
          disabled={submitting}
        >
          {submitting ? "Guardando..." : "Crear hábito"}
        </button>
      </form>
    </div>
  );
};

export default AddHabitScreen;
