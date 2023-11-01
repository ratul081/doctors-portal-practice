import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";
import Loading from "../Components/Loading/Loading";

const AdminRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  // console.log("🚀 ~ file: AdminRoutes.jsx:8 ~ AdminRoutes ~ user:", user)
  const [isAdmin, isAdminLoading] = useAdmin();
  // console.log("🚀 ~ file: AdminRoutes.jsx:9 ~ AdminRoutes ~ isAdmin:", isAdmin)
  const location = useLocation();

  if (loading || isAdminLoading) {
    return <Loading></Loading>;
  }

  if (user && isAdmin) {
    return children;
  }
  return <Navigate to="/" state={{ from: location }} replace></Navigate>;
};

export default AdminRoutes;
