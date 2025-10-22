import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import { Administrator } from "./components/Admin.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />              {/* Main home page */}
      <Route path="/admin" element={<Administrator />} /> {/* Admin dashboard */}
    </Routes>
  </BrowserRouter>
);
