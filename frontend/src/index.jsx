import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import { AuthContextProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>,
);
