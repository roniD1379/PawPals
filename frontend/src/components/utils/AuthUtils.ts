import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import globalRouter from "./GlobalRouter";

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const isValidToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return false;

  try {
    const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
    const isTokenValid = decodedToken.exp * 1000 > Date.now();
    return isTokenValid;
  } catch (error) {
    console.error("Error decoding or validating token:", error);
    return false;
  }
};

export const setTokens = (
  accessToken: string | undefined,
  refreshToken: string | undefined
) => {
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
};

export const useCustomNavigate = () => {
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate("/login");
  };

  return { redirectToLogin };
};

export const navigateToLogin = () => {
  toast.error("Session expired, please login again");
  if (globalRouter.navigate) globalRouter.navigate("/login");
};
