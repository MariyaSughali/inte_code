import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../CSS/reviewer_dashboard.css";

function Reviewer_Sidebar() {
  const [option, setoption] = useState("Home");
  return (
    <>
      <div className="r_sidebar">
        <Link
          to=""
          className={`icon ${option === "Home" && "active"}`}
          onClick={() => {
            setoption("Home");
          }}
        >
          <span className="material-symbols-outlined google-icon">home</span>
          <h4 className="text">DASHBOARD</h4>
        </Link>

        <a className={"icon"}>
          <span class="material-symbols-outlined google-icon">
            pending_actions
          </span>
          <h4 className="text">PENDING REPORTS</h4>
        </a>
        <a className={"icon"}>
          <span class="material-symbols-outlined google-icon">
            clock_loader_60
          </span>
          <h4 className="text">TURN AROUND TIME</h4>
        </a>
        <Link
          to="completed"
          className={`icon ${option === "Completed" && "active"}`}
          onClick={() => {
            setoption("Completed");
          }}
        >
          <span className="material-symbols-outlined google-icon">task </span>
          <h4 className="text">COMPLETED TASK</h4>
        </Link>

        <a href="#" className={"icon"}>
          <span className="material-symbols-outlined google-icon">
            help_center
          </span>
          <h4 className="text">HELP</h4>
        </a>
        <a className={"icon"}>
          <span className="material-symbols-outlined google-icon">logout</span>
          <h4 className="text">LOGOUT</h4>
        </a>
      </div>
    </>
  );
}

export default Reviewer_Sidebar;
