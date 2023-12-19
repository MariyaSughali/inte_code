import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Edit_password() {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handlePasswordUpdate = async () => {
    // Check if newPassword and confirmPassword match
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New password and confirmation password don't match");
      return;
    }
    function validatePassword(newPassword) {
      // Password pattern: 8 characters, at least one uppercase letter, one special character, and one digit
      var passwordPattern = /^(?=.*[A-Z])(?=.*[\W_])(?=.*\d).{8,}$/;
      return passwordPattern.test(newPassword);
    }
    if (!validatePassword(passwords.newPassword)) {
      alert(
        "Invalid password format:\n password must contain\n 8 characters\n at least one uppercase letter\n at least one special character\n one digit"
      );
      return;
    }

    try {
      // Send a PUT request to update the password
      await axios.put("http://localhost:3008/changepassword", {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
        id: changedData.id,
      });
      alert("Password updated successfully");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Invalid old password");
    }
  };

  const handlecancel = async () => {
    try {
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      console.log("not cancelled");
    }
  };
  // image upload
  const [ischanged, setischanged] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [changedData, setChangedData] = useState({
    id: "",
    image: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3008/account")
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const userData = response.data[0];
          setChangedData({
            id: userData.id,
            image: userData.image,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [ischanged]);
  const uploadImage = async () => {
    if (!selectedFile) {
      alert("Please select an image to upload");
      return;
    }
    // Create a FormData object to send the image file
    const formData = new FormData();
    formData.append("photos", selectedFile);
    //upload image to aws bucket
    try {
      await axios.post("http://localhost:3008/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Image uploaded to successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed");
    }
    //to get the url from bucket and store in database
    await axios.get(
      `http://localhost:3008/url/${selectedFile.name}/${changedData.id}`
    );
    setischanged(!ischanged);
  };

  // Function to handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="secondhalf">
      <h2 className="movedown">PASSWORD</h2>
      <br></br>
      <div className="divide ">
        <div className="both">
          <div className="form-row">
            <label htmlfor="oldpassword">Old Password </label>
            <input
              type="text"
              name="oldpassword"
              id="oldpassword"
              value={passwords.oldPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, oldPassword: e.target.value })
              }
            />
            <br />
          </div>

          <div className="form-row">
            <label htmlfor="newpassword">New Password</label>
            <input
              type="password"
              name="newpassword"
              id="newpassword"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
            />
            <br />
          </div>
        </div>
        <br></br>
        <div className="both">
          <div className="margin">
            <div className="form-row">
              <label htmlfor="confirmpassword">Confirm Password </label>
              <input
                type="password"
                name="confirmpassword"
                id="confirmpassword"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <br></br>
            </div>
          </div>
        </div>
      </div>
      <div className="fullbutton">
        <button
          type="button"
          className="update_button"
          onClick={handlePasswordUpdate}
        >
          Update
        </button>
        <button type="button" className="cancel_button" onClick={handlecancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Edit_password;
