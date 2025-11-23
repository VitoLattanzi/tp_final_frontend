import { useEffect, useState } from "react";
import { getHabits, createHabitEntry } from "../../services/habitService.js";
import "../../styles/DailyEntriesScreen.css";

const todayISO = () => new Date().toISOString().slice(0, 10);

const DailyEntriesScreen = () => {
  const [habits, setHabits] = useState([]);
  const [date, setDate] = useState(todayISO());
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadHabits = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getHabits();
      const habitsFromApi = response.habits || [];
      setHabits(habitsFromApi);

      const initialValues = {};
      habitsFromApi.forEach((h) => {
        if (h.type === "boolean") {
          initialValues[h._id] = false;
        } else {
          initialValues[h._id] = "";
        }
      });
      setValues(initialValues);
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

  const handleNumericChange = (habitId, inputValue) => {
    setValues((prev) => ({
      ...prev,
      [habitId]: inputValue,
    }));
  };

  const handleBooleanToggle = (habitId) => {
    setValues((prev) => ({
      ...prev,
      [habitId]: !prev[habitId],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!habits.length) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const entriesToSend = habits.map((habit) => {
        const raw = values[habit._id];

        let value;
        if (habit.type === "boolean") {
          value = raw ? 1 : 0;
        } else {
          const n = Number(raw);
          value = Number.isFinite(n) && n >= 0 ? n : 0;
        }

        return createHabitEntry(habit._id, { date, value });
      });

      await Promise.all(entriesToSend);
      setSuccess("Entradas guardadas correctamente para la fecha seleccionada.");
    } catch (err) {
      console.error("Error guardando entradas:", err);
      setError(err.message || "Error al guardar las entradas");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="daily-entries">
      <header className="daily-entries-header">
        <div>
          <h1 className="daily-entries-title">Daily Entries</h1>
          <p className="daily-entries-subtitle">
            Cargá el progreso de tus hábitos para un día específico.
          </p>
        </div>

        <div className="daily-entries-date">
          <label htmlFor="entry-date">Fecha</label>
          <input
            id="entry-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </header>

      {loading && <p className="daily-entries-status">Cargando hábitos.</p>}
      {error && (
        <p className="daily-entries-status daily-entries-status--error">
          {error}
        </p>
      )}
      {success && (
        <p className="daily-entries-status daily-entries-status--success">
          {success}
        </p>
      )}

      {!loading && !error && !habits.length && (
        <p className="daily-entries-status">
          No tenés hábitos configurados todavía. Creá uno desde <strong>Add Habit</strong>.
        </p>
      )}

      {!loading && !error && habits.length > 0 && (
        <form className="daily-entries-form" onSubmit={handleSubmit}>
          {habits.map((habit) => (
            <div key={habit._id} className="daily-entry-item">
              <div className="daily-entry-info">
                <h2 className="daily-entry-name">{habit.name}</h2>
                <p className="daily-entry-meta">
                  Objetivo diario:{" "}
                  <strong>
                    {habit.dailyGoal} {habit.unit}
                  </strong>
                  {" · "}
                  <span className="daily-entry-type">
                    {habit.type === "boolean" ? "Sí / No" : "Numérico"}
                  </span>
                </p>
              </div>

              <div className="daily-entry-input">
                {habit.type === "boolean" ? (
                  <label className="daily-entry-checkbox">
                    <input
                      type="checkbox"
                      checked={!!values[habit._id]}
                      onChange={() => handleBooleanToggle(habit._id)}
                    />
                    <span>Hecho</span>
                  </label>
                ) : (
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={values[habit._id] ?? ""}
                    onChange={(e) =>
                      handleNumericChange(habit._id, e.target.value)
                    }
                    placeholder={habit.dailyGoal}
                  />
                )}
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="daily-entries-submit"
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar entradas"}
          </button>
        </form>
      )}
    </div>
  );
};

export default DailyEntriesScreen;
