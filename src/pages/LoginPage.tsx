import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton, {
  GoogleLoginResponse,
} from "@/components/login/GoogleLoginButton";
import { setAuthToken } from "@/api/graphqlClient";
import { useAppStore } from "@/store/useAppStore";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const googleOauthClientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;
  const { setLoginMember } = useAppStore();

  const handleLoginSuccess = (data: GoogleLoginResponse) => {
    setAuthToken(data.accessToken);
    setLoginMember(data.member);
    navigate("/");
  };

  return (
    <GoogleOAuthProvider clientId={googleOauthClientId}>
      <GoogleLoginButton onSuccess={handleLoginSuccess} />
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
