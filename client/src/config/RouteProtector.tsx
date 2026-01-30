import { Navigate, Outlet } from "react-router-dom";
import CryptoJS from "crypto-js";
import Helpers from "./Helpers";

interface RouteProtectorProps {
    children?: React.ReactNode;
    isAuthenticate: boolean;
    allowedRole?: "ADMIN" | "USER";
}

const RouteProtector = ({ children, isAuthenticate, allowedRole }: RouteProtectorProps) => {
    const token = localStorage.getItem("token");
    const encryptedType = localStorage.getItem("userType");
    let userType: "ADMIN" | "USER" | null = null;
    if (encryptedType) {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedType, Helpers.secretKey);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            if (decrypted === "ADMIN" || decrypted === "USER") {
                userType = decrypted;
            }
        } catch (error) {
            console.error("Error decrypting userType:", error);
            localStorage.removeItem("userType");
            return <Navigate to="/login" replace />;
        }
    }
    if (isAuthenticate) {
        if (!token || !userType) {
            return <Navigate to="/" replace />;
        }
        if (allowedRole && userType !== allowedRole) {
            return <Navigate to={userType === "ADMIN" ? "/admin" : "/user"} replace />;
        }
        return children || <Outlet />;
    }
    if (token && userType) {
        return <Navigate to={userType === "ADMIN" ? "/admin" : "/user"} replace />;
    }
    return children || <Outlet />;
};

export default RouteProtector;