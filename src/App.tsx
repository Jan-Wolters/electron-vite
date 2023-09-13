import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./vieuw/RoutePath/Dashboard.tsx";
import Company from "./vieuw/RoutePath/CompanyADD.tsx";

function App() {
  return (
    <Router>
      <div className="mt-4">
        {" "}
        {/* Apply the 'overflow-hidden' class here */}
        <Routes>
          {/* Wrap your routes in the <Routes> component */}
          <Route path="/" element={<Dashboard />} />
          <Route path="Company" element={<Company />} />

          {/* Use the 'element' prop instead of 'component' */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
