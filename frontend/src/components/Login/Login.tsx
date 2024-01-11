import "./Login.css";
import logo from "../../assets/images/logo_img.png";
import FormInput from "../utils/FormInput/FormInput";
import { FaPaw, FaLock } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: write login functionality

    navigate("/main");
  };

  return (
    <div className="WelcomePage">
      <div className="welcome-page-main">
        <img className="logo-img" src={logo} alt="logo_image" />
        <div className="logo-main-title">PawPals</div>
        <div className="logo-sub-title">Find your perfect fury friend</div>
        <form className="login-form" onSubmit={(e) => login(e)}>
          <FormInput
            name="username"
            placeholder="username"
            icon={<FaPaw size={20} />}
            isRequired={true}
            state={username}
            setState={setUsername}
          />
          <FormInput
            name="password"
            type="password"
            placeholder="password"
            icon={<FaLock size={20} />}
            isRequired={true}
            state={password}
            setState={setPassword}
          />
          <button type="submit" className="btn btn-large login-btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
