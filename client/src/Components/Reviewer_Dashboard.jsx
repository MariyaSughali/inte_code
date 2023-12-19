import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./reviewer/topbar";
import ReviewerSidebar from "./reviewer/sidebar";
import Draft from "./reviewer/draft";
import Completed from "./reviewer/completed";
import MainReviewer from "./reviewer/main";
import MyQueue from "./reviewer/myQueue";
import AudioPlayer from "./audio_to_text/audio_to_text";
import { useAuth } from "../AuthContext";

function Reviewer_Dashboard() {
  const location = useLocation();

  // Function to determine whether to show the sidebar based on the current path
  const shouldShowSidebar = () => {
    return !location.pathname.startsWith("/reviewer_dashboard/audio2text");
  };

  return (
    <div>
      <Topbar />
      <div className="revcontent">
        <main>
          {/* Conditionally render the sidebar based on the path */}
          {shouldShowSidebar() && (
            <aside>
              <ReviewerSidebar />
            </aside>
          )}
          <Routes>
            <Route path="" element={<MainReviewer />} />
            <Route path="draft" element={<Draft />} />
            <Route path="completed" element={<Completed />} />
            <Route path="myqueue" element={<MyQueue />} />
            <Route path="audio2text/:fileId" element={<AudioPlayer />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Reviewer_Dashboard;
