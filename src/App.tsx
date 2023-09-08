import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./vieuw/Dashboard.tsx";
import Comapny from "./vieuw/Company.tsx";

function App() {
  return (
    <Router>
      <div className="overflow-hidden">
        {" "}
        {/* Apply the 'overflow-hidden' class here */}
        <Routes>
          {/* Wrap your routes in the <Routes> component */}
          <Route path="/" element={<Dashboard />} />
          <Route path="Company" element={<Comapny />} />
          {/* Use the 'element' prop instead of 'component' */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
