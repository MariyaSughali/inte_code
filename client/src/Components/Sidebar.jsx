import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Sidebar() {
  const { user, setUser } = useAuth();

  const [option, setOption] = useState("Home");
  const navigate = useNavigate();
  const logout = () => {
    let logout = window.confirm("Do you want to logout?");
    if (logout) {
      setUser(null);
      window.localStorage.removeItem("token");
      navigate("/");
      console.log("logged out");
    } else {
      console.log("logout failed");
    }
  };
  return (
    <>
      {/* <button id="close-btn">
        <span className="material-symbols-sharp">close</span>
      </button> */}

      <div className="sidebar">
        <Link to="">
          <a
            className={`icon ${option === "Home" && "active"}`}
            onClick={() => {
              setOption("Home");
            }}
          >
            <span className="material-symbols-sharp google-icon">home</span>
            <h4 className="text">HOME</h4>
          </a>
        </Link>
        <a className={"icon"}>
          <span class="material-symbols-outlined google-icon">add_task</span>{" "}
          <h4 className="text"> ASSIGN TASKS</h4>
        </a>
        <Link to="group">
          <a
            className={`icon ${option === "Group" && "active "}`}
            onClick={() => setOption("Group")}
          >
            <span class="material-symbols-outlined google-icon">group</span>
            <h4 className="text">GROUPS</h4>
          </a>
        </Link>
        <a href="#" className={"icon"}>
          <span className="material-symbols-sharp google-icon">
            question_mark
          </span>
          <h4 className="text">HELP</h4>
        </a>
        <a onClick={logout}>
          <span className="material-symbols-sharp google-icon">logout</span>
          <h4 className="text">LOGOUT</h4>
        </a>
      </div>
    </>
  );
}

export default Sidebar;
