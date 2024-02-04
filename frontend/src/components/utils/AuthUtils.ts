import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import globalRouter from "./GlobalRouter";
import { globals } from "./Globals";
import axios from "axios";

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
  const message = "Session expired, please login again";
  toast.error(message, {
    id: message, // Th ID field prevents duplicate toast messages
  });
  if (globalRouter.navigate) globalRouter.navigate("/login");
};

export const handleUserAlreadyLoggedIn = async () => {
  if (isValidToken()) {
    navigateToMain();
  } else {
    try {
      // Try to refresh the token
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await axios.post(globals.auth.refreshToken, {
        refreshToken: refreshToken,
      });
      const newAccessToken = response.data.accessToken;
      const newRefreshToken = response.data.refreshToken;
      setTokens(newAccessToken, newRefreshToken);
      navigateToMain();
    } catch (error) {
      console.error("Error refreshing token:", error);
      navigateToLogin();
    }
  }
};

const navigateToMain = () => {
  if (globalRouter.navigate) globalRouter.navigate("/main");
};
