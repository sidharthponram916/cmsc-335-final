import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AddEntry from "./pages/AddEntry";
import CountryLookup from "./pages/CountryLookup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add-entry" element={<AddEntry />} />
      <Route path="/country-lookup/:country" element={<CountryLookup />} />
    </Routes>
  );
}

export default App;
