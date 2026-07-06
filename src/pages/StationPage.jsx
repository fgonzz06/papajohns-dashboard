import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTasks } from "../api/tasks";
import TaskCard from "../components/TaskCard";

const STATION_META = {
  COCINA:   { label: "Cocina",   icon: "🔥", color: "text-orange-400" },
  EMPAQUE:  { label: "Empaque",  icon: "📦", color: "text-cheese-400" },
  DESPACHO: { label: "Despacho", icon: "🛵", color: "text-basil-600"  },
};

const POLL_INTERVAL_MS = 10000;

export default function StationPage() {
  const { stage } = useParams();
  const navigate = useNavigate();
  const station = stage?.toUpperCase();
  const meta = STATION_META[station];

  const [tasks, setTasks] = useState([]);
  const [workerName, setWorkerName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const intervalRef = useRef(null);

  const fetchTasks = useCallback(async () => {
    if (!station || !meta) return;
    try {
      const data = await getTasks(station);
      setTasks(data);
      setLastUpdated(new Date());
      setErrorMsg("");
    } catch (err) {
      setErrorMsg("No pudimos obtener las tareas. Reintentando…");
    } finally {
      setIsLoading(false);
    }
  }, [station, meta]);

  useEffect(() => {
    fetchTasks();
    intervalRef.current = setInterval(fetchTasks, POLL_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [fetchTasks]);

  function handleCompleted(orderId) {
    setTasks((prev) => prev.filter((t) => (t.orderId || t.order_id) !== orderId));
  }

  if (!meta) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-dough-100/50 mb-4">Estación no reconocida: {stage}</p>
          <button onClick={() => navigate("/")} className="text-cheese-400 underline text-sm">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-crust-950/80 backdrop-blur border-b border-crust-700 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="text-dough-100/40 hover:text-dough-100 transition-colors text-sm"
              aria-label="Cambiar estación"
            >
              ← Estaciones
            </button>
            <span className="text-crust-700">|</span>
            <span className={`font-display text-lg font-bold ${meta.color}`}>
              {meta.icon} {meta.label}
            </span>
          </div>

          {/* Contador de tareas */}
          <div className="flex items-center gap-2">
            {tasks.length > 0 && (
              <span className="bg-sauce-600 text-dough-50 text-xs font-bold px-2.5 py-1 rounded-full">
                {tasks.length} pendiente{tasks.length !== 1 ? "s" : ""}
              </span>
            )}
            <button
              onClick={fetchTasks}
              className="text-dough-100/40 hover:text-cheese-400 transition-colors text-xs"
              aria-label="Actualizar tareas"
            >
              ↻
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-5 py-8">
        {/* Input nombre del trabajador */}
        <div className="mb-6 bg-crust-800/40 border border-crust-700 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-dough-100/40 text-sm whitespace-nowrap">Tu nombre:</span>
          <input
            type="text"
            value={workerName}
            onChange={(e) => setWorkerName(e.target.value)}
            placeholder="Ej: Juan Pérez"
            className="flex-1 bg-transparent text-dough-50 placeholder:text-dough-100/20 outline-none text-sm font-medium"
          />
          {workerName && (
            <span className="text-basil-600 text-xs">✓</span>
          )}
        </div>

        {/* Estado de carga */}
        {isLoading && (
          <div className="text-center py-16">
            <p className="text-dough-100/40 text-sm animate-pulse">Buscando tareas en cola…</p>
          </div>
        )}

        {/* Error */}
        {errorMsg && !isLoading && (
          <p className="text-center text-sauce-600 text-sm mb-6">{errorMsg}</p>
        )}

        {/* Sin tareas */}
        {!isLoading && tasks.length === 0 && !errorMsg && (
          <div className="text-center py-16">
            <p className="text-4xl mb-4" aria-hidden="true">✅</p>
            <p className="font-display text-xl text-dough-50">Todo al día</p>
            <p className="text-dough-100/40 text-sm mt-2">
              No hay pedidos pendientes en {meta.label}.
            </p>
            <p className="text-dough-100/20 text-xs mt-6">
              Actualizando cada {POLL_INTERVAL_MS / 1000}s…
            </p>
          </div>
        )}

        {/* Lista de tareas */}
        {tasks.length > 0 && (
          <div className="space-y-4">
            {tasks.map((task, idx) => (
              <TaskCard
                key={task.orderId || task.order_id || idx}
                task={task}
                station={station}
                workerName={workerName}
                onCompleted={handleCompleted}
              />
            ))}
          </div>
        )}

        {/* Última actualización */}
        {lastUpdated && (
          <p className="text-center text-dough-100/20 text-xs mt-8">
            Última actualización: {lastUpdated.toLocaleTimeString("es-PE")}
          </p>
        )}
      </main>
    </div>
  );
}
