import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AdminPanel from "./pages/AdminPanel";
import OficinaPanel from "./pages/OficinaPanel";
import AreaPanel from "./pages/AreaPanel";
import TrabajadorPanel from "./pages/TrabajadorPanel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/oficina" element={<OficinaPanel />} />
        <Route path="/area" element={<AreaPanel />} />
        <Route path="/trabajador" element={<TrabajadorPanel />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;