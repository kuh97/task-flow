import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

interface GoogleLoginButtonProps {
  onSuccess?: (token: string) => void;
}
const GoogleLoginButton = ({ onSuccess }: GoogleLoginButtonProps) => {
  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    const accessToken = credentialResponse.credential; // ✅ Google에서 발급된 accessToken
    console.log("✅ Google 로그인 성공! ID Token:", accessToken);

    // GraphQL 요청 보내기
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation GoogleLogin($accessToken: String!) {
            googleLogin(accessToken: $accessToken) {
              accessToken
              member {
                id
                email
                nickname
                profileImage
              }
            }
          }
        `,
        variables: { accessToken },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("✅ GraphQL 로그인 성공:", data);
        if (onSuccess) {
          onSuccess(accessToken!);
        }
      })
      .catch((error) => console.error("❌ GraphQL 로그인 실패:", error));
  };

  return (
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={() => console.error("❌ Google 로그인 실패")}
    />
  );
};

export default GoogleLoginButton;
