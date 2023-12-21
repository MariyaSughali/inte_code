import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Popup from "reactjs-popup";
import EditPassword from "./Edit_password";

function Edit_profile() {
  const { currentuserId } = useAuth();

  const [changedData, setChangedData] = useState([]);
  const [ischanged, setIsChanged] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [ischanged]);

  const fetchUserProfile = async () => {
    try {
      const user_id = currentuserId;
      await axios
        .get(`http://localhost:3002/api/getuserprofile/${user_id}`)
        .then((res) => {
          setChangedData(res.data[0]);
          console.log(res.data[0]);
        });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  const handleChanges = (e) => {
    const { name, value } = e.target;
    setChangedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const updateProfile = async () => {
        await axios.put("http://localhost:3002/api/editprofile", changedData);
        toast.success("Profile updated successfully");
        setIsChanged(!ischanged);
      };

      const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9.-_]+@[a-zA-Z0-9.-_]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
      };

      const validatePhone = (phone) => {
        const phonePattern = /^\d{10}$/;
        return phonePattern.test(phone);
      };

      if (!validatePhone(changedData.phone_number)) {
        toast.error("Invalid Phone number");
      } else if (!validateEmail(changedData.email)) {
        toast.error("Invalid email");
      } else {
        await updateProfile();
      }
    } catch (error) {
      console.error("Error updating profile data:", error);
    }
  };

  // image upload
  const [selectedFile, setSelectedFile] = useState();
  // Function to handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  // Function to upload the selected image to AWS S3
  const uploadImage = async () => {
    if (!selectedFile) {
      toast.error("Please select an image to upload");
      return;
    }

    // Validate if the selected file is an image
    if (!selectedFile.type.startsWith("image")) {
      toast.error("Please select an image file");
      return;
    }

    // Create a FormData object to send the image file
    const formData = new FormData();
    formData.append("photos", selectedFile);

    try {
      await axios.post(
        `http://localhost:3002/api/profilepicture/${changedData.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await axios.get(
        `http://localhost:3002/api/profile/${selectedFile.name}/${changedData.id}`
      );
      setIsChanged(!ischanged);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Image upload failed");
    }
  };

  return (
    <div className="profile">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="colored"
      />
      <div style={{ display: "flex" }}>
        <img
          className="profile_page_pic"
          id="profile"
          src={changedData.profile_pic_link}
          alt="profile"
        />
        <div className="upload_new_image_label">
          <input
            className="profile_pic_input"
            type="file"
            id="fileInput"
            accept="image/*"
            onChangeCapture={uploadImage}
            onInputCapture={handleFileChange}
            required
            style={{ display: "none" }}
          />
          <label htmlFor="fileInput">
            <TextField
              helperText="JPG or PNG is allowed *"
              id="demo-helper-text-misaligned"
              label="Upload new image"
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: false,
              }}
              InputProps={{
                readOnly: true,
                onClick: () => document.getElementById("fileInput").click(),
              }}
            />
          </label>
        </div>
      </div>
      <br />
      <div className="profile_box">
        <div className="prfile1box">
          <TextField
            label="First Name"
            name="first_name"
            value={changedData.first_name || ""}
            onChange={handleChanges}
            variant="outlined"
            disabled
            fullWidth
            InputProps={{
              style: {
                height: "40px",
                padding: "5px",
                readOnly: true,
              },
            }}
          />
          <br />
          <br></br>
          <TextField
            label="Email"
            name="email"
            value={changedData.email || ""}
            onChange={handleChanges}
            required
            variant="outlined"
            fullWidth
            InputProps={{
              style: {
                height: "40px",
                padding: "5px",
              },
            }}
          />
          <br /> <br></br>
          <TextField
            label="Language"
            name="language_name"
            value={changedData.language_name || ""}
            variant="outlined"
            fullWidth
            disabled
            InputProps={{
              style: {
                height: "40px",
                padding: "5px",
                readOnly: true,
              },
            }}
          />
          <br /> <br></br>
        </div>
        <div className="profile2box">
          <TextField
            label="Last Name"
            name="last_name"
            value={changedData.last_name || ""}
            onChange={handleChanges}
            variant="outlined"
            fullWidth
            disabled
            InputProps={{
              style: {
                height: "40px",
                padding: "5px",
                readOnly: true,
              },
            }}
          />
          <br />
          <TextField
            label="Phone"
            name="phone_number"
            value={changedData.phone_number || ""}
            onChange={handleChanges}
            required
            variant="outlined"
            fullWidth
            InputProps={{
              style: {
                height: "40px",
                padding: "5px",
              },
            }}
          />
          <br></br>
          <TextField
            label="Role"
            name="role"
            value={changedData.role_name || ""}
            variant="outlined"
            disabled
            fullWidth
            InputProps={{
              style: {
                height: "40px",
                padding: "5px",
                readOnly: true,
              },
            }}
          />
        </div>
      </div>
      <div>
        <textarea className="profile_textarea" />
        <button className="cnfpwd_update_button" onClick={handleSubmit}>
          Update
        </button>
        <Popup
          trigger={
            <button className="cnfpwd_cancel_button" style={{ width: "135px" }}>
              Change Password
            </button>
          }
          modal
        >
          {(close) => (
            <div
              style={{ height: "210px", padding: "10px", borderRadius: "5px" }}
            >
              <div className="change_password_heading">
                <p>CHANGE PASSWORD</p>
              </div>
              <div>
                <EditPassword close={close} />
              </div>
            </div>
          )}
        </Popup>
      </div>
    </div>
  );
}

export default Edit_profile;
