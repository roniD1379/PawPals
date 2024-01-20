import "./Register.css";
import { useState } from "react";
import FormInput from "../utils/FormInput/FormInput";
import { FaPaw, FaLock, FaUser, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import FormUploadImage from "../utils/FormUploadImage/FormUploadImage";
import { globals } from "../utils/Globals";
import toast from "react-hot-toast";
import api from "../utils/AxiosInterceptors";

interface RegistrationData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  description: string;
  phoneNumber: string;
  userImage: string;
}

interface RegisterApiResponse {
  message: string;
}

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegistrationData>({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    description: "",
    phoneNumber: "",
    userImage: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const register = async (e: React.FormEvent) => {
    e.preventDefault();

    await api
      .post<RegisterApiResponse>(globals.auth.register, formData)
      .then((res) => {
        console.log(res.data);
        toast.success("Registered successfully!");
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data);
      });
  };

  return (
    <div className="WelcomePage">
      <div className="welcome-page-main">
        <div className="logo-main-title">PawPals</div>
        <div className="logo-sub-title">Find your perfect fury friend</div>
        <form className="register-form" onSubmit={(e) => register(e)}>
          <FormUploadImage uploadedImageId="profile-img" />
          <FormInput
            name="firstName"
            placeholder="First name"
            icon={<FaUser size={20} />}
            isRequired={true}
            state={formData.firstName}
            setState={handleInputChange}
          />
          <FormInput
            name="lastName"
            placeholder="Last name"
            icon={<FaUser size={20} />}
            isRequired={true}
            state={formData.lastName}
            setState={handleInputChange}
          />
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
          <FormInput
            name="description"
            placeholder="description"
            icon={<FaPaw size={20} />}
            state={formData.description}
            setState={handleInputChange}
          />
          <FormInput
            name="phoneNumber"
            type="tel"
            placeholder="Phone number"
            icon={<FaPhone size={20} />}
            isRequired={true}
            state={formData.phoneNumber}
            setState={handleInputChange}
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
