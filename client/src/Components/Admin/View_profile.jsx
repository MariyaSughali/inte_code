import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link, Route, Routes } from "react-router-dom";
import Edit_profile from "./Edit_profile";
import Edit_password from "./Edit_password";
import profile from "../../assets/profile.png";
import "../CSS/profile.css";
import { useAuth } from "../../AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const AWS = require("aws-sdk");
// AWS.config.update({
//   accessKeyId: "AKIAWJUYWBOYMET2Y64D",
//   secretAccessKey: "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",
//   region: "Asia Pacific (Mumbai) ap-south-1",
// });
function View_profile() {
  const navigate = useNavigate();
  const [ischanged, setischanged] = useState(false);
  const { currentuserId } = useAuth();
  const [changedData, setChangedData] = useState({
    id: "",
    firstname: "",
    secondname: "",
    email: "",
    phone: "",
    role: "",
    language: "",
    image: "",
  });
  const getuserData = async () => {
    await axios
      .get(`http://localhost:3002/api/user/${currentuserId}`)
      .then((response) => {
        if (response) {
          const userData = response.data;
          setChangedData({
            id: userData.id,
            firstname: userData.first_name,
            secondname: userData.last_name,
            email: userData.email,
            phone: userData.phone_number,
            role: userData.role_name,
            language: userData.language_name,
            image: userData.profile_pic_link,
          });
        }
      })

      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getuserData(currentuserId);
  }, []);

  const handleClickPassword = () => {
    navigate("/password");
  };
  const handleClickAccount = () => {
    navigate("/account");
  };

  // image upload
  const [selectedFile, setSelectedFile] = useState();
  // Function to upload the selected image to AWS S3
  const uploadImage = async () => {
    if (!selectedFile) {
      alert("Please select an image to upload");
      return;
    }
    // Create a FormData object to send the image file
    const formData = new FormData();
    formData.append("photo", selectedFile);

    try {
      await axios.post(
        `http://localhost:3002/api/profilepicture/${currentuserId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "JPG/PNG/JPEG",
          },
        }
      );
      toast.success("Profile picture updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed");
    }
    await axios.get(
      `http://localhost:3002/api/${selectedFile.name}/${currentuserId}`
    );
    setischanged(!ischanged);
    getuserData();
  };

  // Function to handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div>
      <div className="topbar">
        <Link to={"/admin_dashboard"}>
          <h1>
            <span class="material-symbols-outlined">arrow_back</span>Profile
          </h1>
        </Link>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
      <div className="navi">
        <label htmlFor="fileInput" className="label">
          <span>
            <img
              id="profile"
              src={changedData.image || profile}
              alt="profile"
              defaultValue={changedData.image}
            />
          </span>
        </label>
        <input
          className="none"
          type="file"
          id="fileInput"
          accept="image/*"
          onChangeCapture={uploadImage}
          onInputCapture={handleFileChange}
          required
        />
        <br></br>
        <Link to="">
          <button onClick={handleClickAccount}>ACCOUNT</button>
        </Link>
        <br></br>
        <Link to="editpassword">
          <button onClick={handleClickPassword}>PASSWORD</button>
        </Link>
        <br></br>
        <button>SETTINGS</button>
        <br></br>
        <button>LOG OUT</button>
        <br></br>
      </div>
      <Routes>
        <Route path="" element={<Edit_profile />}></Route>
        <Route path="editpassword" element={<Edit_password />}></Route>
      </Routes>
    </div>
  );
}

export default View_profile;
