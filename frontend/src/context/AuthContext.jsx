import { createContext, useState, useEffect } from "react";
import { ConfigProvider } from "antd";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  return (
    <AuthContext.Provider>
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
