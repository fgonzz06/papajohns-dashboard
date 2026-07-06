import { Routes, Route, Navigate } from "react-router-dom";
import StationSelectPage from "./pages/StationSelectPage";
import StationPage from "./pages/StationPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StationSelectPage />} />
      <Route path="/station/:stage" element={<StationPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
