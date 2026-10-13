import { Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import KnowledgeBases from "./pages/knowledge-base/KnowledgeBases";
import MyFiles from "./pages/knowledge-base/Myfiles";
import Chat from "./pages/chat/Chat";
import Pricing from "./pages/Pricing";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — all share AppLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/knowledge-bases" element={<KnowledgeBases />} />
            <Route path="/files" element={<MyFiles />} />
            <Route path="/pricing" element={<Pricing />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
