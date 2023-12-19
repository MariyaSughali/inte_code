import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Edit_profile() {
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
  const [ischanged, setischanged] = useState(false);
  const handleChanges = (e) => {
    const { name, value } = e.target;
    setChangedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
    try {
      const update = () => {
        axios.put("http://localhost:3008/editdata", changedData);
        alert("Profile updated successfully");
      };

      function validateEmail(email) {
        var emailPattern = /^[a-zA-Z0-9.-_]+@[a-zA-Z0-9.-_]+\.com$/;
        return emailPattern.test(email);
      }

      function validatePhone(phone) {
        var phonePattern = /^\d{10}$/;
        return phonePattern.test(phone);
      }

      //validate phone number
      if (!validatePhone(changedData.phone)) {
        alert("invalid Phone number");
      }
      //validate email
      if (!validateEmail(changedData.email)) {
        alert("invalid email");
      }
      if (
        validatePhone(changedData.phone) &&
        validateEmail(changedData.email)
      ) {
        update();
      }
    } catch (error) {
      console.error("Error updating profile data:", error);
    }
    setischanged(!ischanged);
  };
  const handleCancel = () => {
    setischanged(!ischanged);
  };
  return (
    <div className="secondhalf">
      <h2>DETAILS</h2>
      <br></br>
      <div className="divide ">
        <div className="both">
          <div className="form-row">
            <label for="firstname">First Name </label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              value={changedData.firstname}
              onChange={handleChanges}
              required
            />
            <br />
          </div>

          <div className="form-row">
            <label for="email">Email </label>
            <input
              type="email"
              name="email"
              id="email"
              value={changedData.email}
              onChange={handleChanges}
              required
            />
            <br />
          </div>

          <div className="form-row">
            <label for="role">Role </label>
            <input
              type="text"
              className="pointerevent"
              name="role"
              id="role"
              defaultValue={changedData.role}
              readonly
            />
          </div>
        </div>
        <br></br>
        <div className="both">
          <div className="form-row">
            <label>Last Name </label>
            <input
              type="text"
              name="secondname"
              id="secondname"
              value={changedData.secondname}
              onChange={handleChanges}
              required
            />
            <br />
          </div>

          <div className="form-row">
            <label className="">Phone</label>
            <input
              type="text"
              name="phone"
              id="phone"
              value={changedData.phone}
              onChange={handleChanges}
              required
            />
            <br />
          </div>

          <div className="form-row">
            <label>Language </label>
            <input
              type="text"
              className="pointerevent"
              name="language"
              id="language"
              value={changedData.language}
              readOnly
            />
            <br></br>
          </div>
        </div>
      </div>
      <div className="fullbutton">
        <button type="button" className="update_button" onClick={handleSubmit}>
          Update
        </button>
        <Link to={"/admin_dashboard"}>
          {" "}
          <button
            type="button"
            className="cancel_button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Edit_profile;
