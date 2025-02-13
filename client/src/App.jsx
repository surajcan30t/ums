import "./App.css";
import { Routes, Route } from "react-router-dom";
import AuthenticationForm from "./components/AuthenticationForm";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";

function App() {

  return (
    <>
      <div className="h-screen">
        <Routes>
          <Route path="/" element={<AuthenticationForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth/forgotpassword" element={<ForgotPassword />} />
          <Route path="/auth/resetpassword/:resetToken" element={<ResetPassword />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
