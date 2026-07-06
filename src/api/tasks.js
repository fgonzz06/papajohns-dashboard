import { tasksClient, ordersClient, TENANT_ID } from "./client";

// Mapeo de estación → endpoint
const STAGE_ENDPOINTS = {
  COCINA:  "/tasks/cocina",
  EMPAQUE: "/tasks/empaque",
  DESPACHO: "/tasks/despacho",
};

/**
 * Obtiene las tareas pendientes de una estación.
 * GET /tasks/{stage}  (extrae de SQS + enriquece con DynamoDB)
 *
 * @param {"COCINA"|"EMPAQUE"|"DESPACHO"} stage
 * @returns {Promise<Array>}
 */
export async function getTasks(stage) {
  const endpoint = STAGE_ENDPOINTS[stage];
  if (!endpoint) throw new Error(`Estación inválida: ${stage}`);
  const { data } = await tasksClient.get(endpoint);
  // El backend puede devolver { tasks: [...] } o un array directo
  return Array.isArray(data) ? data : (data.tasks ?? []);
}

/**
 * Confirma que un trabajador terminó su tarea y avanza el pedido.
 * PATCH /tenants/{tenantId}/orders/{id}/status
 *
 * @param {string} orderId
 * @param {string} newStatus  - Estado al que SE PASA (ej: "COCINA" → "EMPAQUE")
 * @param {string} responsable - Nombre del trabajador
 * @param {string} taskToken  - Token de Step Functions (del mensaje SQS)
 */
export async function updateOrderStatus({ orderId, newStatus, responsable, taskToken }) {
  const { data } = await tasksClient.patch(
    `/tenants/${TENANT_ID}/orders/${orderId}/status`,
    { status: newStatus, responsable, taskToken }
  );
  return data;
}
