import "./WelcomePage.css";
import logo from "../../assets/images/logo_img.png";
import { useNavigate } from "react-router-dom";

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="WelcomePage">
      <div className="welcome-page-main">
        <img className="logo-img" src={logo} alt="logo_image" />
        <div className="logo-main-title">PawPals</div>
        <div className="logo-sub-title">Find your perfect fury friend</div>
        <button
          className="btn btn-large welcome-page-login-btn"
          onClick={() => navigate("/login")}
        >
          Sign In
        </button>
        <button
          className="btn btn-large welcome-page-register-btn"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;
