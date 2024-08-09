import BackgroundVideo from "./components/BackgroundVideo";
import Login from "./pages/Login"
import Panel from "./pages/Panel";
import User from "./pages/User";
import { HashRouter as Router, Route,Routes, Navigate } from "react-router-dom";

const App= () => {
  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated() ? "/user" : "/login"} />} />
        <Route path="/user" element={ <User /> } />
        <Route path="/login" element={<BackgroundVideo content={<Login />} />} />
        <Route path="/panel" element={<Panel />} />
      </Routes>
    </Router>
  )
}

export default App;