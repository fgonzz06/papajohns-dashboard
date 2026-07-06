import { useNavigate } from "react-router-dom";

const STATIONS = [
  {
    key: "COCINA",
    label: "Cocina",
    icon: "🔥",
    description: "Preparación y horneado de pizzas",
    color: "hover:border-orange-500 hover:bg-orange-500/10",
    dot: "bg-orange-400",
  },
  {
    key: "EMPAQUE",
    label: "Empaque",
    icon: "📦",
    description: "Empaque y control de calidad",
    color: "hover:border-cheese-400 hover:bg-cheese-400/10",
    dot: "bg-cheese-400",
  },
  {
    key: "DESPACHO",
    label: "Despacho",
    icon: "🛵",
    description: "Despacho y entrega al cliente",
    color: "hover:border-basil-600 hover:bg-basil-600/10",
    dot: "bg-basil-600",
  },
];

export default function StationSelectPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-4xl mb-3" aria-hidden="true">🍕</p>
          <h1 className="font-display text-3xl font-bold text-dough-50">
            Papa<span className="text-sauce-600">John's</span>
          </h1>
          <p className="text-dough-100/50 mt-2 text-sm">Panel de Operaciones</p>
        </div>

        <h2 className="text-center font-semibold text-dough-100/80 mb-6 text-sm tracking-widest uppercase">
          ¿En qué estación estás hoy?
        </h2>

        <div className="space-y-3">
          {STATIONS.map((station) => (
            <button
              key={station.key}
              onClick={() => navigate(`/station/${station.key}`)}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl border border-crust-700 bg-crust-800/50 transition-all cursor-pointer ${station.color}`}
            >
              <span className="text-3xl" aria-hidden="true">{station.icon}</span>
              <div className="flex-1 text-left">
                <p className="font-semibold text-dough-50">{station.label}</p>
                <p className="text-sm text-dough-100/50">{station.description}</p>
              </div>
              <span className={`w-2.5 h-2.5 rounded-full ${station.dot}`} aria-hidden="true" />
            </button>
          ))}
        </div>

        <p className="text-center text-dough-100/30 text-xs mt-8">
          Sucursal: {import.meta.env.VITE_TENANT_ID || "SURCO-01"}
        </p>
      </div>
    </div>
  );
}
