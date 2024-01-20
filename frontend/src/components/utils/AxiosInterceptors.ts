import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { globals } from "./Globals";
import { navigateToLogin, setTokens } from "./AuthUtils";

const api = axios.create({
  baseURL: globals.auth.auth,
});

interface RetirableAxiosRequestConfig extends AxiosRequestConfig {
  _retry: boolean;
}

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as RetirableAxiosRequestConfig;

    // If the request fails due to an expired access token and a refresh token is available
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await axios.post(globals.auth.refreshToken, {
            refreshToken,
          });
          const newAccessToken = response.data.accessToken;
          const newRefreshToken = response.data.refreshToken;
          setTokens(newAccessToken, newRefreshToken);

          // Retry the original request with the new access token
          if (originalRequest?.headers)
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          navigateToLogin();
          return Promise.reject(refreshError);
        }
      } else {
        navigateToLogin();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
