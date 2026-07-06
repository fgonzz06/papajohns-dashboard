import axios from "axios";

export const tasksClient = axios.create({
  baseURL: import.meta.env.VITE_EMPLEADOS_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

export const ordersClient = axios.create({
  baseURL: import.meta.env.VITE_ORDERS_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

export const TENANT_ID = import.meta.env.VITE_TENANT_ID || "SURCO-01";
