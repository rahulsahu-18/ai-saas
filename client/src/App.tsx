import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import KnowledgeBases from "./pages/knowledge-base/KnowledgeBases";
import MyFiles from "./pages/knowledge-base/Myfiles";
import Chat from "./pages/chat/Chat";

function App() {
  return (
    <>
      <Routes>
        <Route path={"/"} element={<LandingPage />} />
        <Route path={"/login"} element={<Login />} />
        <Route path={"/register"} element={<Register />} />
        <Route path="/knowledge-bases" element={<KnowledgeBases />} />
        <Route path="/files" element={<MyFiles />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:chatId" element={<Chat />} /> 
      </Routes>
    </>
  );
}

export default App;
