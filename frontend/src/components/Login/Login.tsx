import "./Login.css";
import logo from "../../assets/images/logo_img.png";
import FormInput from "../utils/FormInput/FormInput";
import { FaPaw, FaLock } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { globals } from "../utils/Globals";
import { clearTokens, setTokens } from "../utils/AuthUtils";
import api from "../utils/AxiosInterceptors";
import GoogleAuth from "./GoogleAuth";

interface LoginData {
  username: string;
  password: string;
}

interface LoginApiResponse {
  accessToken: string;
  refreshToken: string;
}

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginData>({
    username: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();

    await api
      .post<LoginApiResponse>(globals.auth.login, formData)
      .then((res) => {
        setTokens(res.data.accessToken, res.data.refreshToken);
        navigate("/main");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data);
      });
  };

  useEffect(() => {
    clearTokens();
  }, []);

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
            state={formData.username}
            setState={handleInputChange}
            minLength={6}
          />
          <FormInput
            name="password"
            type="password"
            placeholder="password"
            icon={<FaLock size={20} />}
            isRequired={true}
            state={formData.password}
            setState={handleInputChange}
            minLength={6}
          />
          <button type="submit" className="btn btn-large login-btn">
            Sign In
          </button>
        </form>
        <GoogleAuth />
      </div>
    </div>
  );
}

export default Login;
