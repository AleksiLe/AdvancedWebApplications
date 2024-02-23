import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
  const token: String = localStorage.getItem("token") as string;
  if (token) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoutes;
