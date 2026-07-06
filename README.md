# 🍕 papajohns-dashboard

Dashboard de operaciones para el staff de Papa John's. Permite a Cocina, Empaque y Despacho ver y completar sus tareas en tiempo real.

## Stack
- React 19 + Vite + Tailwind CSS v4

## Configuración
```bash
npm install
cp .env.example .env
npm run dev
```

## Variables de entorno (Amplify)
| Variable | Valor |
|---|---|
| `VITE_EMPLEADOS_API_BASE_URL` | `https://aa5r6uvg0b.execute-api.us-east-1.amazonaws.com/dev` |
| `VITE_TENANT_ID` | `SURCO-01` |

## Flujo
1. El trabajador elige su estación (Cocina / Empaque / Despacho).
2. El dashboard hace `GET /tasks/{stage}` extrayendo tareas de SQS enriquecidas con DynamoDB.
3. El trabajador ingresa su nombre y marca la tarea como lista.
4. Se dispara `PATCH /tenants/{tenantId}/orders/{id}/status` con el `taskToken` para avanzar Step Functions.
5. El dashboard hace polling cada 10s para nuevas tareas automáticamente.
