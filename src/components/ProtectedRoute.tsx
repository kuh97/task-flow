import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = () => {
  const { isAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate("/login", {
        state: {
          from: location.pathname,
          message: "세션이 만료되었습니다",
        },
        replace: true,
      });
    }
  }, [isAuth]);

  return isAuth ? <Outlet /> : null;
};

export default ProtectedRoute;
