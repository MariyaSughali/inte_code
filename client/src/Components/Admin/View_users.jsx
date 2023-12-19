import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import logo from "./../../assets/applogo.png";

function View_users() {
  const dasboardtitle = ["Name", "Role", "", "", ""];
  const [titles, setTitles] = useState([]);
  const [searchterm, setsearchterm] = useState("");
  const [data, setData] = useState([]);
  const [searchinputdata, setsearchinputdata] = useState([]);
  const [isDeleted, setisDeleted] = useState(0);
  const [viewData, setViewData] = useState([]);
  const [changedData, setChangedData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    language: "",
    role: "",
    rolename: "",
  });

  const navigate = useNavigate();
  useEffect(() => {
    const getdata = async () => {
      await axios
        .get("http://localhost:3002/api/userlist")
        .then((response) => {
          setData(response.data);
          setsearchinputdata(response.data);
          setTitles(Object.keys(response.data[0]));
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getdata();
  }, [isDeleted]);
  const handleDelete = async (id) => {
    var result = window.confirm("Are you Sure");
    if (result) {
      const data = { id: id };
      try {
        await axios.delete(`http://localhost:3002/api/deleteuser`, { data });
        console.log("data deleted");
      } catch (error) {
        console.log(error);
      }
      console.log(id);
      setisDeleted(!isDeleted);
    }
  };
  const handleinputchange = (e) => {
    if (e.target.value === "") {
      setsearchterm("");
      setsearchinputdata(data);
    } else {
      setsearchterm(e.target.value);
    }
  };
  const handleFilter = () => {
    const fildata = searchinputdata
      .map((user) => {
        if (user.first_name.includes(searchterm)) {
          return user;
        }
        return null;
      })
      .filter((user) => user !== null);
    setsearchinputdata(fildata);
  };

  const handleEdit = (e) => {
    console.log(e);
    setChangedData({
      id: e.id,
      first_name: e.first_name,
      last_name: e.last_name,
      email: e.email,
      phone_number: e.phone_number,
      language: e.language_id,
      role: e.role_id,
      rolename: e.role_name,
    });
  };

  const handledetails = (indidata) => {
    setViewData(indidata);
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setChangedData((changedData) => ({
      ...changedData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log(changedData);
    //  const changedData= {"id": id}
    try {
      await axios.put(`http://localhost:3002/api/updateuser`, changedData);
      console.log("data edited");
    } catch (error) {
      console.log(error);
    }
    setisDeleted(!isDeleted);
  };

  return (
    <div className="full">
            <nav>
        <div className="containerbox">
          <div className="profile-area">
          <img src={logo} className="logo" />
            <div className="search-bar">
              <span className="material-symbols-sharp">search</span>
              <input type="search" placeholder="search..." />
            </div>
            <Link to={"/profile"}>
              <div className="profile">
                <div className="profile-photo">
                  <img
                    src="https://img.icons8.com/ios/100/user-male-circle--v1.png"
                    alt="user-male-circle--v1"
                  />
                </div>
                <span className="material-symbols-sharp">expand_more</span>
              </div>
            </Link>

            {/* <button id="menu-btn">
              <span className="material-symbols-sharp">menu</span>
            </button> */}
          </div>
        </div>
      </nav>
      <div className="downcontent">
        <button className="userbackbutton">
          <Link to={"/admin_dashboard"}>
            <span class="material-symbols-outlined">
              arrow_back <b>User</b>
            </span>
          </Link>
        </button>
        <div className="searchbutton2">
          <form>
            <input
              type="text"
              placeholder="filter with name"
              value={searchterm}
              onChange={handleinputchange}
            ></input>
          </form>
          <button onClick={handleFilter}>
            <span class="material-symbols-outlined " size={100}>
              manage_search
            </span>
          </button>
        </div>

        <div className="table" id="table">
          <table class="table  table-striped">
            <thead>
              <tr>
                {dasboardtitle.map((key) => (
                  <th>{key}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {searchinputdata.map((indidata) => (
                <tr key={indidata.id}>
                  <td>{indidata.first_name}</td>
                  <td>{indidata.role_name}</td>
                  <td>
                    <button
                      type="submit"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() => {
                        handleEdit(indidata);
                      }}
                      id="editbutton"
                    >
                      Update
                    </button>
                  </td>

                  <td>
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#details_modal"
                      type="submit"
                      onClick={() => {
                        handledetails(indidata);
                      }}
                      id="editbutton"
                    >
                      Details
                    </button>
                  </td>

                  <td>
                    <button
                      type="button"
                      onClick={() => {
                        handleDelete(indidata.id);
                      }}
                      id={"deletebutton"}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* UPDATE USER IN DASHBOARD MODAL BOX */}
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-fullscreen-sm-down modal-dialog modal-xl modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div class="modal-title fs-5" id="exampleModalLabel">
              <div className="closeandheading">
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
                <h3>Update user </h3>
              </div>
              <h3 id="userinformation">USER INFORMATION</h3>
            </div>
            <div class="modal-body ">
              <div className="updateboxbody">
                <div className="updatecolumn1">
                  <div className="Firstname">
                    Firstname:
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      value={changedData.last_name}
                      onChange={handleChanges}
                    />
                  </div>
                  <br></br>
                  <div className="Email">
                    Email:{" "}
                    <input
                      type="email"
                      name="email"
                      id="email"
                      defaultValue={changedData.email}
                      onChange={handleChanges}
                    />
                  </div>
                </div>
                <div className="updatecolumn2">
                  <div className="Lastname">
                    LastName:{" "}
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      value={changedData.last_name}
                      onChange={handleChanges}
                    />
                  </div>
                  <br></br>
                  <div className="Phone">
                    Phone:{" "}
                    <input
                      type="tel"
                      name="phone_number"
                      id="phone_number"
                      defaultValue={changedData.phone_number}
                      onChange={handleChanges}
                    />
                  </div>
                </div>
              </div>
              <div className="footer">
                <button
                  type="button"
                  class="btn btn-primary"
                  onClick={handleSubmit}
                  data-bs-dismiss="modal"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* details modal box */}
      <div
        class="modal fade"
        id="details_modal"
        tabindex="-1"
        aria-labelledby="#details_modal"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-fullscreen-sm-down modal-dialog modal-xl modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div class="modal-title fs-5" id="exampleModalLabel">
              <div className="closeandheading">
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
                <h3>User details </h3>
              </div>
              <h3 id="userinformation">USER INFORMATION</h3>
            </div>
            <div class="modal-body ">
              <div className="updateboxbody">
                <div className="updatecolumn1">
                  <div className="username">
                    User Name:
                    <input
                      type="text"
                      name="User name"
                      id="username"
                      value={viewData.username}
                    />
                  </div>
                  <br></br>
                  <div className="Firstname">
                    Firstname:
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      value={viewData.first_name}
                    />
                  </div>
                  <br></br>
                  <div className="Email">
                    Email:{" "}
                    <input
                      type="email"
                      name="email"
                      id="email"
                      defaultValue={viewData.email}
                    />
                  </div>
                  <br></br>
                  <div className="Role">
                    Role:
                    <input
                      type="text"
                      name="Role"
                      id="Role"
                      value={viewData.role_name}
                    />
                  </div>
                </div>
                <br></br>
                <div className="updatecolumn2">
                  <div className="Lastname">
                    LastName:{" "}
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      value={viewData.last_name}
                    />
                  </div>
                  <br></br>
                  <div className="Phone">
                    Phone:{" "}
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      defaultValue={viewData.phone_number}
                    />
                  </div>
                  <br></br>
                  <div className="language">
                    Language:{" "}
                    <input
                      type="text"
                      name="language"
                      id="language"
                      defaultValue={viewData.language_id}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default View_users;
