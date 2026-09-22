import { createContext, useEffect, useState } from "react";
import { ConfigProvider } from "antd";
import { authMeService, logoutService } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import {notification} from "antd";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  const getAuthUser = async () => {
    try {
      const response = await authMeService();
console.log("authMeService response:", response);
      if (response.success) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("AUTH ME ERROR:", error);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

 useEffect(() => {
  console.log("AuthContext mounted - calling authMe");
  getAuthUser();
}, []);

   const handleLogout = async () => {
      try {
        const response = await logoutService();
  
        if (response.success) {
          setUser(null);
  
          notification.success({
            message: "Logged out successfully",
            placement: "bottomRight",
          });
  
          navigate("/login", { replace: true });
        } else {
          notification.error({
            message: response.message || "Logout failed",
            placement: "bottomRight",
          });
        }
      } catch (error) {
        console.error("LOGOUT ERROR:", error);
  
        notification.error({
          message: "Unable to logout",
          placement: "bottomRight",
        });
      }
    };
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        authLoading,
        handleLogout,
        getAuthUser,
      }}
    >
      <ConfigProvider
        theme={{
          components: {
            Notification: {
              paddingMD: 15,
              colorIcon: "rgb(255, 255, 255)",
              colorTextHeading: "rgba(254, 254, 254, 0.88)",
              colorIconHover: "rgb(255, 255, 255)",
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </AuthContext.Provider>
  );
}
