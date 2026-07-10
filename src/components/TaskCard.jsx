import { useState } from "react";
import { updateOrderStatus } from "../api/tasks";

// Mapa: cuál es el siguiente estado después de cada estación
const NEXT_STATUS = {
  COCINA:   "COCINA",
  EMPAQUE:  "DESPACHO",
  DESPACHO: "ENTREGADO",
};

function formatCurrency(amount) {
  return `S/ ${Number(amount).toFixed(2)}`;
}

function timeSince(isoString) {
  if (!isoString) return "—";
  const diff = Math.floor((Date.now() - new Date(isoString)) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  return `${Math.floor(diff / 3600)}h`;
}

export default function TaskCard({ task, station, workerName, onCompleted }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // El backend puede devolver los campos con distintos nombres según el Claim Check
  const orderId = task.orderId || task.order_id;
  const customerName = task.customerName || task.customer_name || "Cliente";
  const items = task.items || [];
  const totalAmount = task.totalAmount || task.total_amount;
  const taskToken = task.taskToken || task.task_token;
  const startedAt = task.stages?.[station]?.startedAt || task.startedAt;

  async function handleComplete() {
  if (!workerName.trim()) {
    setError("Ingresa tu nombre primero.");
    return;
  }
  setIsLoading(true);
  setError("");
  console.log("Task completa:", task);
  console.log("Mandando PATCH:", {
    orderId,
    newStatus: NEXT_STATUS[station],
    responsable: workerName.trim(),
    taskToken,
  });
  try {
    await updateOrderStatus({
      orderId,
      newStatus: NEXT_STATUS[station],
      responsable: workerName.trim(),
      taskToken,
      receiptHandle,
    });
    onCompleted(orderId);
  } catch (err) {
    console.error("Error PATCH:", err?.response?.data);
    setError("No se pudo actualizar el pedido. Intenta de nuevo.");
  } finally {
    setIsLoading(false);
  }
}

  return (
    <article className="bg-crust-800/60 border border-crust-700 rounded-2xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-bold text-dough-50">{customerName}</p>
          <p className="font-mono text-xs text-dough-100/40 mt-0.5">
            #{orderId?.slice(0, 8)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {totalAmount && (
            <span className="font-mono text-sm text-cheese-400 font-medium">
              {formatCurrency(totalAmount)}
            </span>
          )}
          <span className="text-xs text-dough-100/40">
            hace {timeSince(startedAt)}
          </span>
        </div>
      </div>

      {/* Items */}
      {items.length > 0 && (
        <ul className="space-y-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex justify-between text-sm">
              <span className="text-dough-100/80">
                {item.qty}× {item.name}
              </span>
              <span className="font-mono text-dough-100/40">
                {formatCurrency(item.price * item.qty)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Error */}
      {error && (
        <p role="alert" className="text-sm text-sauce-600">{error}</p>
      )}

      {/* Acción */}
      <button
        onClick={handleComplete}
        disabled={isLoading}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-all bg-basil-700 hover:bg-basil-600 text-dough-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Enviando…" : `✓ Listo para ${NEXT_STATUS[station]}`}
      </button>
    </article>
  );
}
