import "./Register.css";
import { useState } from "react";
import FormInput from "../utils/FormInput/FormInput";
import { FaPaw, FaLock, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import FormUploadImage from "../utils/FormUploadImage/FormUploadImage";

function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");

  const register = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: write register functionality

    navigate("/main");
  };

  return (
    <div className="WelcomePage">
      <div className="welcome-page-main">
        <div className="logo-main-title">PawPals</div>
        <div className="logo-sub-title">Find your perfect fury friend</div>
        <form className="register-form" onSubmit={(e) => register(e)}>
          <FormUploadImage uploadedImageId="profile-img" />
          <FormInput
            name="first-name"
            placeholder="First name"
            icon={<FaUser size={20} />}
            isRequired={true}
            state={firstName}
            setState={setFirstName}
          />
          <FormInput
            name="last-name"
            placeholder="Last name"
            icon={<FaUser size={20} />}
            isRequired={true}
            state={lastName}
            setState={setLastName}
          />
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
          <FormInput
            name="description"
            placeholder="description"
            icon={<FaPaw size={20} />}
            state={description}
            setState={setDescription}
          />
          <button type="submit" className="btn btn-large register-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
