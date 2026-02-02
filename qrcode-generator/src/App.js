import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./HomePage";
import QRCodeGenerator from "./QRCodeGenerator";
import ServiceInfoPage from "./ServiceInfoPage";
import UpdateService from "./UpdateService";

const mode = process.env.REACT_APP_MODE || "INTERNAL";
console.log(mode);

function App() {
  return (
    <Router>
      <Routes>
        {mode === "INTERNAL" ? (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/generate" element={<QRCodeGenerator />} />
            <Route path="/update-service" element={<UpdateService />} />
            <Route path="/service-info/:productId" element={<ServiceInfoPage />} />
            <Route path="/service-info" element={<ServiceInfoPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<ServiceInfoPage />} />
            <Route path="/service-info/:productId" element={<ServiceInfoPage />} />
            <Route path="/service-info" element={<ServiceInfoPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;