import "./App.css";
import MainPage from "./components/MainPage/MainPage";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import { Route, Routes, useNavigate } from "react-router-dom";
import DismissibleToast from "./components/utils/DismissibleToast/DismissibleToast";
import globalRouter from "./components/utils/GlobalRouter";

function App() {
  const navigate = useNavigate();
  globalRouter.navigate = navigate;

  return (
    <>
      <DismissibleToast />
      <Routes>
        <Route path="/" Component={WelcomePage} />
        <Route path="/login" Component={Login} />
        <Route path="/register" Component={Register} />
        <Route path="/main" Component={MainPage} />
      </Routes>
    </>
  );
}

export default App;
