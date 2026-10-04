import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Loans from "./pages/Loans";
import Admin from "./pages/Admin";
import Notifications from "./pages/notification";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/admin-panel" element={<Admin />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </BrowserRouter>
  );
}