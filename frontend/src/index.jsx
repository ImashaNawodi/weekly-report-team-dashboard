import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { MembersProvider } from "./context/MembersContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <MembersProvider>
    <App />
    </MembersProvider>
  </AuthContextProvider>,
);
