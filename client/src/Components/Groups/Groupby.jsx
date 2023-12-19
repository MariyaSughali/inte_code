import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Groups/Groupby.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/js/dist/modal.js";

function Groupby() {
  const [UpdatedRole, setUpdatedRole] = useState("");
  const [IsDeleted, setIsDeleted] = useState(0);
  const [option, setOption] = useState("Both");
  const [data, setData] = useState([]);
  const [transData, setTransData] = useState([]);
  const [revData, setRevData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const titles = ["Name", "Role", "Update"];
  const [searchValueInput, setSearchValueInput] = useState("");
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const getdata = async () => {
      await axios
        .get("http://localhost:3002/api/userlist")
        .then((response) => {
          setData(response.data);
          setTransData(
            response.data.filter((user) => user.role_name.includes("translator"))
          );
  
          setRevData(
            response.data.filter((user) => user.role_name.includes("reviewer"))
          );
          if (option === "Both") {
            setFilterData(response.data);
          } else {
            setFilterData(
              response.data.filter((user) => user.role_name.includes(option))    
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
      const roles = await axios.get("http://localhost:3002/api/roles");
      setRoles(roles.data);
    };
    getdata();
  }, [IsDeleted]);

  console.log(transData);
  console.log(revData);

  const handleRole = async (event) => {
    try {
      let id = event.target.value;
      setUpdatedRole(id);
    } catch (error) {
      console.error(error);
    }
  };
  const handleSearchChange = (e) => {
    if (e.target.value === "") {
      setSearchValueInput("");

      if (option === "Both") {
        setFilterData(data);
      } else if (option === "translator") {
        setFilterData(transData);
      } else {
        setFilterData(revData);
      }
    } else {
      setSearchValueInput(e.target.value);
    }
  };
  const handleSearchSubmit = () => {
    if (option === "Both") {
      setFilterData(
        data.filter((user) =>
          user.username.toLowerCase().includes(searchValueInput.toLowerCase())
        )
      );
    } else if (option === "translator") {
      setFilterData(
        transData.filter((user) =>
          user.username.toLowerCase().includes(searchValueInput.toLowerCase())
        )
      );
    } else {
      setFilterData(
        revData.filter((user) =>
          user.username.toLowerCase().includes(searchValueInput.toLowerCase())
        )
      );
    }
  };
  const handleChange = async (res) => {
    try {
      const response = await axios.put(`http://localhost:3002/api/updaterole`, {
        role_id: UpdatedRole,
        id: res,
      });
      // if (response) {
      //   alert("Role changed successfully");
      // }
      setIsDeleted(!IsDeleted);
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = async (res) => {
    const data = { id: res };
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`http://localhost:3002/api/deleteuser`, { data });
        console.log("Data deleted");
      } catch (error) {
        console.log(error);
      }
      setIsDeleted(!IsDeleted);
    } else {
      console.log("Don't want to  delete it");
    }
  };
  const filterByBoth = () => {
    setOption("Both");
    setFilterData(data);
  };

  const filterByTra = () => {
    setOption("translator");
    setFilterData(transData);
  };
  const filterByRev = () => {
    setOption("reviewer");
    setFilterData(revData);
  };

  const handleRadioChange = (event) => {
    setOption(event.target.value);
  };

  return (
    <section className="groups">
      <div className="titlebar">
        <a>
          <span class="material-symbols-outlined backarrow">arrow_back</span>

          <span className="group-title">Groups</span>
        </a>
      </div>
      <div className="searchelement">
        <input
          className="input-textbox"
          type="text"
          placeholder="filter with name"
          value={searchValueInput}
          onChange={handleSearchChange}
        />

        <button
          className="search-button"
          onClick={() => {
            handleSearchSubmit();
          }}
          type="sumbit"
        >
          <span className="material-symbols-outlined search-icon">
            manage_search
          </span>
        </button>
      </div>

      <div className="choose_radio">
        <div className="input_radio">
          <input
            type="radio"
            name="user_type"
            className="both_radio"
            id="both"
            value="Both"
            onClick={() => {
              filterByBoth(data);
            }}
            checked={option === "Both"}
            onChange={handleRadioChange}
          />

          <label for="both" className="both_label">
            Both
          </label>
        </div>
        <div className="input_radio">
          <input
            type="radio"
            name="user_type"
            id="translator"
            value="translator"
            onClick={() => {
              filterByTra();
            }}
            checked={option === "translator"}
            className="translator_radio"
            onChange={handleRadioChange}
          />
          <label for="translator" className="translator_label">
            Translator
          </label>
        </div>
        <div className="input_radio">
          <input
            type="radio"
            name="user_type"
            id="reviewer"
            value="reviewer"
            onClick={() => {
              filterByRev();
            }}
            checked={option === "reviewer"}
            onChange={handleRadioChange}
            className="reviewer_radio"
          />
          <label for="reviewer" className="reviewer_label">
            Reviewer
          </label>
        </div>
      </div>

      <table className="table table-striped table-hover table-responsive totaltable">
        <thead>
          <tr>
            {titles.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filterData.length === 0 ? (
            <tr className="nodata">No Data Found</tr>
          ) : null}
          {filterData
            .sort((a, b) => {
              return a.username.localeCompare(b.username);
            })
            .map((item) => (
              <tr name={item.id} key={item.id}>
                <td name={item.username}>{item.username}</td>
                <td>
                  <select name="role" id="role" onChange={handleRole}>
                    {roles.map((role) => {
                      return (
                        <option
                          selected={role.role_name === item.role_name}
                          key={role.role_id}
                          id={role.role_id}
                          name={role.role_name}
                          value={role.role_id}
                        >
                          {role.role_name.charAt(0).toUpperCase() +
                            role.role_name.slice(1)}
                        </option>
                      );
                    })}
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className="assign"
                    onClick={() => {
                      handleChange(item.id);
                    }}
                  >
                    Assign
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="delete"
                    onClick={() => {
                      handleDelete(item.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );
}

export default Groupby;
