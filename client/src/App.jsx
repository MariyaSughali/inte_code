import { useState } from "react";

// import "bootstrap/dist/css/bootstrap.css";

import "./App.css";
import Login from "./Components/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Admin_Dashboard from "./Components/Admin_Dashboard";
import { useAuth } from "./AuthContext";
import Reviewer_Dashboard from "./Components/Reviewer_Dashboard";
import Translator_Dashboard from "./Components/Translator_Dashboard";
import View_users from "./Components/Admin/View_users";
import Add_users from "./Components/Admin/Add_users";
import Main from "./Components/Groups/Main";
import Groupby from "./Components/Groups/Groupby";
import View_profile from "./Components/Admin/View_profile";

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* <Route path="/admin_dashboard" element={<Admin_Dashboard />} /> */}
        {/* Protected Routes   */}
        {user == null && <Route path="/" element={<Login />} />}

        {user?.role == "admin" && (
          <Route
            path="/admin_dashboard/*"
            element={<Admin_Dashboard />}
          ></Route>
        )}
        {user?.role == "admin" && (
          <Route path="/view_users" element={<View_users />}></Route>
        )}
        {user?.role == "admin" && (
          <Route path="/add_user" element={<Add_users />}></Route>
        )}
        {user?.role == "admin" && (
          <Route path="/profile/*" element={<View_profile />}></Route>
        )}

        {user?.role == "translator" && (
          <Route
            path="/translator_dashboard"
            element={<Translator_Dashboard />}
          />
        )}
        {user?.role == "reviewer" && (
          <Route
            path="/reviewer_dashboard/*"
            element={<Reviewer_Dashboard />}
          />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
