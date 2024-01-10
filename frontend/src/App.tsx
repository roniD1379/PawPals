import "./App.css";
import Feed from "./components/Feed/Feed";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={WelcomePage} />
        <Route path="/login" Component={Login} />
        <Route path="/register" Component={Register} />
        <Route path="/feed" Component={Feed} />
      </Routes>
    </Router>
  );
}

export default App;
