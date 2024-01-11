import "./App.css";
import MainPage from "./components/MainPage/MainPage";
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
        <Route path="/main" Component={MainPage} />
      </Routes>
    </Router>
  );
}

export default App;
