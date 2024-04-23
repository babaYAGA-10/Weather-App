import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CitiesTable from "./components/CitiesTable";
import WeatherDetails from "./components/WeatherDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CitiesTable />} />
        <Route path="/weather/:cityId" element={<WeatherDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
