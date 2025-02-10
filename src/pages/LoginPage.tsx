import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "@/components/login/GoogleLoginButton";
import { setAuthToken } from "@/api/graphqlClient";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const googleOauthClientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;

  const handleLoginSuccess = (token: string) => {
    setAuthToken(token);
    navigate("/");
  };

  return (
    <GoogleOAuthProvider clientId={googleOauthClientId}>
      <GoogleLoginButton onSuccess={handleLoginSuccess} />
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
