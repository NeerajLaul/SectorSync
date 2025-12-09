import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import AdminPage from "./pages/admin";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      {/* everything else in the app */}
      <Route path="/*" element={<App />} />

      {/* admin route */}
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  </BrowserRouter>
);
