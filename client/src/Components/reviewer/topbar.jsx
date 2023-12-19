// import "../CSS/reviewer_dashboard.css";
import logo from "../../assets/applogo.png";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

function Topbar() {
  return (
    <div>
      <div className="r_topbar">
        <div className="r_logo">
          <img className="r_logophoto" src={logo} alt="img"></img>
        </div>
        <div className="r_search">
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "left",
              width: "45%",
              height: "45px",
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search"
              inputProps={{ "aria-label": "search" }}
            />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </div>
        <div className="r_notification">
          <span className="material-symbols-outlined r_icon1">
            notifications
          </span>
        </div>
        <div className="r_gap"></div>
        <div className="r_profile">
          <img
            className="r_img_profile"
            src="https://tranxify.s3.ap-south-1.amazonaws.com/profile.png"
            alt="img"
          ></img>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
