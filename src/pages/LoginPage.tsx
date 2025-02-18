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
      <div className="flex justify-center items-center bg-[#e0e4ff] w-full h-screen">
        <div className="flex flex-col p-8 box-border w-[400px] h-[450px] rounded-lg bg-white shadow-lg">
          <header>
            <h3 className="flex items-center gap-2 font-bold text-xl font-logo">
              <img
                src="/public/taskflow.svg"
                alt="taskflow-logo"
                width={35}
                height={35}
              />
              TaskFlow
            </h3>
          </header>
          <div className="flex flex-col flex-1">
            <h1 className="py-10 font-semibold text-3xl leading-relaxed">
              {`작업을`}
              <br />
              {`관리하러 가볼까요?`}
            </h1>
            <div className="mt-auto mb-2">
              <GoogleLoginButton onSuccess={handleLoginSuccess} />
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
