import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
// import "./index.css";
import { AuthUser } from "./AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthUser>
    <App />
  </AuthUser>
);
