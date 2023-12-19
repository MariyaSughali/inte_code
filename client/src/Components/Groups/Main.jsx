import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/js/dist/modal.js";
import "../CSS/Adduser.css";

function Main() {
  const [ckpwd, setckpwd] = useState(false);
  const [genUsername, setGenUsername] = useState("");
  const [data, setData] = useState({
    first_name: null,
    last_name: null,
    email: null,
    phone_number: null,
    password: null,
    Reenter: null,
    language_id: null,
    profile_pic_link: "profile_pic_link",
    username: genUsername,
    isactive: true,
    is_first_login: false,
    role_id: 2,
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(data);
    // function validatepassword(password) {
    //   // password pattern: 8 characters, at least one uppercase letter, one special character, and one digit
    //   var passwordPattern = /^(?=.*[A-Z])(?=.*[\W_])(?=.*\d).{8,}$/;
    //   return passwordPattern.test(password);
    // }
    // if (!validatepassword(data.password)) {
    //   alert("Invalid ");
    //   return;
    // }

    try {
      await axios({
        method: "POST",
        url: "http://localhost:3002/api/user",
        data: data,
      });
      alert("User added successfully");
    } catch (error) {
      console.log(error);
      alert("Error occurred");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGenUsername(data.first_name + data.email);
    setData((data) => ({
      ...data,
      [name]: value,
      username: genUsername,
    }));
    if (name === "Reenter") {
      if (value !== data.password) {
        setckpwd(true);
      } else setckpwd(false);
    }
  };

  return (
    <>
      <section className="middle">
        <div className="card">
          <p className="text">USERS</p>
          <Link
            to={"adduser"}
            data-bs-toggle="modal"
            data-bs-target="#addUserModal"
          >
            <span className="material-symbols-sharp">person_add</span>
            <h4 className="text">ADD USERS</h4>
          </Link>
          <Link to={"/view_users"}>
            <span className="material-symbols-sharp">visibility</span>
            <h4 className="text">UPDATE USERS</h4>
          </Link>

          <a href="#">
            <span className="material-symbols-sharp">person_remove</span>
            <h4 className="text">DELETE USER</h4>
          </a>
        </div>

        <div className="card">
          <p className="text">DICTIONARY</p>
          <a href="#">
            <span className="material-symbols-sharp">add</span>
            <h4 className="text">ADD</h4>
          </a>
          <a href="#">
            <span className="material-symbols-sharp">delete</span>
            <h4 className="text">DELETE</h4>
          </a>
          <a href="#">
            <span className="material-symbols-sharp">update</span>
            <h4 className="text">UPDATE</h4>
          </a>
        </div>

        <div className="card">
          <p className="text">REPORTS</p>
          <a href="#">
            <span className="material-symbols-sharp">pending_actions</span>
            <h4 className="text">PENDING REPORTS</h4>
          </a>
          <a href="#">
            <span className="material-symbols-sharp">schedule</span>
            <h4 className="text">TURN AROUND TIME</h4>
          </a>
        </div>
      </section>
      <form>
        <div
          className="modal fade"
          id="addUserModal"
          tabIndex="-1"
          aria-labelledby="addUserModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-fullscreen-sm-down modal-dialog modal-xl modal-dialog modal-dialog-centered ">
            <div className="modal-content">
              <div className="topmodal">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
                <h1 className="modal-title fs-5" id="addUserModalLabel">
                  Add a new user{" "}
                </h1>
              </div>
              <div className="modal-body ">
                <div className="wholecontent">
                  <div className="userinformation">
                    <h5>USER INFORMATION</h5>
                  </div>

                  <div className="thebox">
                    <div className="firstrow">
                      <div className="Firstname">
                        <label htmlFor="first_name">First Name</label>
                        <input
                          type="text"
                          id="first_name"
                          value={data.first_name}
                          name="first_name"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <br />
                      <div className="Email">
                        <label htmlFor="name">Email</label>
                        <input
                          type="email"
                          id="email"
                          value={data.email}
                          name="email"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <br />
                      <div className="Password">
                        <label htmlFor="password">Password</label>
                        <input
                          type="password"
                          value={data.password}
                          name="password"
                          onChange={handleChange}
                        />
                      </div>
                      <br />
                      <div className="Language">
                        <label htmlFor="language_id">Language</label>
                        <input
                          type="text"
                          id="language_id"
                          value={data.language_id}
                          name="language_id"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="secondrow">
                      <div className="Lastname">
                        <label htmlFor="last_name">Last Name</label>
                        <input
                          type="text"
                          id="last_name"
                          value={data.last_name}
                          name="last_name"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <br />
                      <div className="Phone">
                        <label htmlFor="phone_number">Phone &nbsp;</label>
                        <input
                          type="tel"
                          id="phone_number"
                          value={data.phone_number}
                          name="phone_number"
                          onChange={handleChange}
                          pattern="[789][0-9]{9}"
                          required
                        />
                      </div>
                      <br />
                      <div className="Reenterpassword">
                        <label htmlFor="Password">
                          Confirm Password &nbsp;{" "}
                        </label>

                        <input
                          type="password"
                          name="Reenter"
                          value={data.Reenter}
                          onChange={handleChange}
                        />
                        {ckpwd && <p>Password doesn't match</p>}
                      </div>
                    </div>
                  </div>

                  <div className="Submit">
                    <button
                      type="submit"
                      className="btn btn-primary sub-but"
                      onClick={handleSubmit}
                      data-bs-dismiss="modal"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default Main;
