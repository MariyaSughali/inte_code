import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import logo from "../assets/weblogo.svg";
import login from "../assets/login.png";
import { useFormik } from "formik";
import axios from "axios";
import { useAuth } from "../AuthContext";

function Login() {
  const [loginError, setLoginError] = useState(false);
  const { user, setUser, currentuserId, setCurrentuserId } = useAuth();
  const [jwt, setJwt] = useState("");

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.username) {
        errors.username = "Please Enter valid UserName";
      }
      if (!values.password) {
        errors.password = "Please Enter passsword";
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        let loginToken = await axios.post(
          "http://localhost:3002/api/login/",
          values
        );
        setUser({
          username: loginToken.data.username,
          role: loginToken.data.role,
        });

        setJwt(loginToken.data.token);
        setCurrentuserId(loginToken.data.id);
        window.localStorage.setItem("token", loginToken.data.token);
        // Redirect to the appropriate dashboard based on the user's role
        switch (loginToken.data.role) {
          case "admin":
            navigate("/admin_dashboard");
            break;
          case "translator":
            navigate("/translator_dashboard");
            break;
          case "reviewer":
            navigate("/reviewer_dashboard");
            break;

          default:
            break;
        }
      } catch (error) {
        console.error(error);
        setLoginError(true);
        setTimeout(() => {
          setLoginError(false);
        }, 6000);
      }
    },
  });

  return (
    <div className="loginPage">
      <div className="container_box">
        <div className="image">
          <img className="logo" src={logo} alt="logo" />
          <img className="img" src={login} alt="login" />
        </div>
        <div className="login-content">
          <div className="wrapper">
            <div className="title">
              <span>WELCOME BACK</span>
            </div>
            <form action="#" onSubmit={formik.handleSubmit}>
              <div className="row">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="USERNAME"
                  id="username"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.errors.username ? "Input_Error" : null}
                />

                <br />
              </div>
              <div className="row">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="PASSWORD"
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.errors.password ? "Input_Error" : null}
                />
                <br />
              </div>
              <div className="pass">
                <a href="#">Forgot password?</a>
              </div>
              {formik.errors.password || formik.errors.username ? (
                <span className="Error_msg">
                  ** Please Enter all the required fields
                </span>
              ) : null}

              {loginError ? (
                <span className="Error_msg">** Invalid Credentials!!</span>
              ) : null}
              <div>
                <button className="button" type="submit">
                  <span>LOGIN</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
