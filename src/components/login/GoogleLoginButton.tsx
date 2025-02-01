import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
}

const GoogleLoginButton = ({ onSuccess }: GoogleLoginButtonProps) => {
  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    const accessToken = credentialResponse.credential; // Google ID Token 저장

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation GoogleLogin($accessToken: String!) {
            googleLogin(accessToken: $accessToken) {
              member {
                id
                email
                nickname
                projectId
              }
            }
          }
        `,
        variables: { accessToken },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          console.error("❌ 로그인 실패:", data.errors);
        } else {
          console.log("✅ 로그인 성공:", data);
          const receivedIdToken = data.data.googleLogin.idToken;

          // ✅ 이후 요청을 위해 idToken을 저장 (로컬 스토리지 또는 쿠키)
          // localStorage.setItem("idToken", receivedIdToken);
          if (onSuccess) {
            onSuccess();
          }
        }
      })
      .catch((error) => console.error("❌ 요청 실패:", error));
  };

  return (
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={() => console.error("❌ Google 로그인 실패")}
    />
  );
};

export default GoogleLoginButton;
