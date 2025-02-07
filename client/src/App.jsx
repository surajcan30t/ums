import "./App.css";
import { Routes, Route } from "react-router-dom";
import AuthenticationForm from "./components/AuthenticationForm";
import Dashboard from "./pages/Dashboard";

function App() {

  return (
    <>
      <div className="h-screen">
        <Routes>
          <Route path="/" element={<AuthenticationForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
