import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import api from "../utils/AxiosInterceptors";
import { globals } from "../utils/Globals";
import { setTokens } from "../utils/AuthUtils";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const GoogleAuth = () => {
  const navigate = useNavigate();

  return (
    <GoogleOAuthProvider
      clientId={
        "124483780299-asr6rgvjf9jil7dtd2e3uorimbug028c.apps.googleusercontent.com"
      }
    >
      <GoogleLogin
        size="medium"
        shape="pill"
        onSuccess={async (credentialResponse) => {
          await api
            .post(globals.auth.googleLogin, credentialResponse)
            .then((res) => {
              setTokens(res.data.accessToken, res.data.refreshToken);
              navigate("/main");
            })
            .catch((error) => {
              console.log(error);
              toast.error(error.response.data);
            });
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
