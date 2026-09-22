import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import "./App.css";

import { AuthContextProvider } from "./context/AuthContext.jsx";
import { MembersProvider } from "./context/MembersContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthContextProvider>
      <MembersProvider>
        <App />
      </MembersProvider>
    </AuthContextProvider>
  </BrowserRouter>,
);
