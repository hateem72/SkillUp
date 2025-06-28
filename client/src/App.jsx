import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Debate from "./pages/Debate";
import Interview from "./pages/Interview";
import Speech from "./pages/Speech";
import AuthPage from "./pages/AuthPage";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/debate"
              element={
                <ProtectedRoute>
                  <Debate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview"
              element={
                <ProtectedRoute>
                  <Interview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/speech"
              element={
                <ProtectedRoute>
                  <Speech />
                </ProtectedRoute>
              }
            />
            
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;