import React from "react";
import logo from "../assets/applogo.png";
import "../Components/Admin_Dashboard.css";
import { useAuth } from "../AuthContext";
import {
  BrowserRouter,
  Link,
  Route,
  Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import Sidebar from "./Sidebar";
import Main from "./Groups/Main";
import Groupby from "./Groups/Groupby";
import Add_user from "./Groups/Add_user";

function Admin_Dashboard() {
  // const { logout } = useAuth();
  const navigate = useNavigate();
  const { currentuserId } = useAuth();
  return (
    <>
      <nav>
        <div className="containerbox">
          <div className="profile-area">
            <img src={logo} className="logo" />
            <div className="search-bar">
              <span className="material-symbols-sharp">search</span>
              <input type="search" placeholder="search..." />
            </div>
            <Link to={"/profile"}>
              <div className="profile">
                <div className="profile-photo">
                  <img
                    src="https://img.icons8.com/ios/100/user-male-circle--v1.png"
                    alt="user-male-circle--v1"
                  />
                </div>
                <span className="material-symbols-sharp">expand_more</span>
              </div>
            </Link>

            {/* <button id="menu-btn">
              <span className="material-symbols-sharp">menu</span>
            </button> */}
          </div>
        </div>
      </nav>
      <main>
        <aside>
          <Sidebar />
        </aside>

        <Routes>
          <Route path="" element={<Main />}></Route>
          <Route path="group" element={<Groupby />}></Route>
          <Route path="adduser" element={<Add_user />}></Route>
        </Routes>
      </main>
    </>
  );
}

export default Admin_Dashboard;
