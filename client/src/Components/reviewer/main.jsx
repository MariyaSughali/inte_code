import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Button,
} from "@mui/material";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import { useAuth } from "../../AuthContext";

function Main_reviewer() {
  const [draftData, setDraftData] = useState([]);
  const [todotask, setTodoData] = useState([]);
  const [myQueueData, setMyQueueData] = useState([]);
  const [ischanged, setischanged] = useState(true);

  const [pickPopupOpen, setPickPopupOpen] = useState({});

  const navigate = useNavigate();

  const [filterOptions, setFilterOptions] = useState({
    audio: false,
    word: false,
    picked: false,
    unpicked: false,
  });

  const [filteredData, setFilteredData] = useState([]);

  const { currentuserId } = useAuth();

  useEffect(() => {
    const user_id = currentuserId;

    // change to user_logged in details
    const user_language_id = 1;

    axios.get("http://localhost:3002/api/getTodoList").then((response) => {
      if (response.data && response.data.length > 0) {
        const data = response.data.filter((item) => {
          return (
            item.reviewer_id !== user_id &&
            item.language_id === user_language_id
          );
        });
        setTodoData(data);
        setFilteredData(data);
      }
    });

    axios
      .get(`http://localhost:3002/api/getreviewer/${user_id}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setMyQueueData(
            response.data.filter(
              (user) => user.isdraft === null && user.iscompleted === null
            )
          );
          setDraftData(response.data.filter((user) => user.isdraft === true));
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [ischanged]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()} - ${
      date.getMonth() + 1
    } - ${date.getFullYear()}`;
    return formattedDate;
  }

  function getType(file_name) {
    if (file_name) {
      const extension = file_name.split(".").pop();
      return extension === "docx" ? "Document" : "Audio";
    }
  }

  function isPicked(name, item) {
    return name != null ? "Picked" : "Unpicked";
  }

  const applyFilters = () => {
    let filtered = todotask.filter((item) => {
      const fileType = getType(item.file_name);
      const userPicked = isPicked(item.username);
      return (
        (!filterOptions.picked || userPicked === "Picked") &&
        (!filterOptions.unpicked || userPicked === "Unpicked") &&
        (!filterOptions.audio || fileType === "Audio") &&
        (!filterOptions.word || fileType === "Document")
      );
    });
    setFilteredData(filtered);
  };

  console.log(filteredData);

  console.log(filterOptions);

  // queue
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * 5;
  const indexOfFirstItem = indexOfLastItem - 5;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  //myqueue
  const [qcurrentPage, setqCurrentPage] = useState(1);

  const qindexOfLastItem = qcurrentPage * 5;
  const qindexOfFirstItem = qindexOfLastItem - 5;
  const qcurrentItems = myQueueData.slice(qindexOfFirstItem, qindexOfLastItem);

  const qnextPage = () => setqCurrentPage(qcurrentPage + 1);
  const qprevPage = () => setqCurrentPage(qcurrentPage - 1);

  //draft
  const [dcurrentPage, setdCurrentPage] = useState(1);

  const dindexOfLastItem = dcurrentPage * 5;
  const dindexOfFirstItem = dindexOfLastItem - 5;
  const dcurrentItems = draftData.slice(dindexOfFirstItem, dindexOfLastItem);

  const dnextPage = () => setdCurrentPage(dcurrentPage + 1);
  const dprevPage = () => setdCurrentPage(dcurrentPage - 1);

  const handlePick = (item) => {
    const data = {
      file_id: item.file_id,
      id: currentuserId,
      file_name: item.file_name,
      language_id: item.language_id,
    };
    axios.post("http://localhost:3002/api/assignFile", data);
    setischanged(!ischanged);
  };

  const handleStart = (file_id, file_name) => {
    const fileType = getType(file_name);
    if (fileType === "Audio") {
      navigate(`/reviewer_dashboard/audio2text/${file_id}`);
    }
    const data = {
      file_id: file_id,
    };
    axios.put("http://localhost:3002/api/setToDraft", data);
    setischanged(!ischanged);
  };

  return (
    <div>
      <div className="revcontainer">
        <div className="rev_dash_heading">OVERVIEW</div>
        <div className="rev_queue">
          <div className="rev_heading">
            <div>QUEUE</div>

            <div className="filterbutton">
              <Popup
                trigger={
                  <button className="filter_list">
                    <span class="material-symbols-outlined filter_list">
                      filter_list
                    </span>
                  </button>
                }
                position="bottom right"
              >
                {(close) => (
                  <div className="modal">
                    <div className="content">
                      <Checkbox
                        id="audio"
                        name="audio"
                        value="audio"
                        checked={filterOptions.audio}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterOptions({
                              audio: true,
                              word: false,
                              picked: filterOptions.picked,
                              unpicked: filterOptions.unpicked,
                            });
                          } else {
                            setFilterOptions({
                              audio: false,
                              word: filterOptions.word,
                              picked: filterOptions.picked,
                              unpicked: filterOptions.unpicked,
                            });
                          }
                        }}
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: 24,
                          },
                        }}
                      />
                      <label htmlFor="audio">AUDIO FILES</label>
                      <br />
                      <Checkbox
                        id="word"
                        name="word"
                        value="word"
                        checked={filterOptions.word}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterOptions({
                              audio: false,
                              word: true,
                              picked: filterOptions.picked,
                              unpicked: filterOptions.unpicked,
                            });
                          } else {
                            setFilterOptions({
                              audio: filterOptions.audio,
                              word: false,
                              picked: filterOptions.picked,
                              unpicked: filterOptions.unpicked,
                            });
                          }
                        }}
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: 24,
                          },
                        }}
                      />
                      <label htmlFor="word">WORD FILES</label>
                      <br />
                      <Checkbox
                        id="picked"
                        name="picked"
                        value="picked"
                        checked={filterOptions.picked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterOptions({
                              audio: filterOptions.audio,
                              word: filterOptions.word,
                              picked: true,
                              unpicked: false,
                            });
                          } else {
                            setFilterOptions({
                              audio: filterOptions.audio,
                              word: filterOptions.word,
                              picked: false,
                              unpicked: filterOptions.unpicked,
                            });
                          }
                        }}
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: 24,
                          },
                        }}
                      />
                      <label htmlFor="picked">PICKED FILES</label>
                      <br />
                      <Checkbox
                        id="unpicked"
                        name="unpicked"
                        value="unpicked"
                        checked={filterOptions.unpicked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterOptions({
                              audio: filterOptions.audio,
                              word: filterOptions.word,
                              picked: false,
                              unpicked: true,
                            });
                          } else {
                            setFilterOptions({
                              audio: filterOptions.audio,
                              word: filterOptions.word,
                              picked: filterOptions.picked,
                              unpicked: false,
                            });
                          }
                        }}
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: 24,
                          },
                        }}
                      />
                      <label htmlFor="unpicked">UNPICKED FILES</label>
                      <br />
                    </div>
                    <div>
                      <button
                        className="FilterApplyButton"
                        onClick={() => {
                          applyFilters();
                          close();
                        }}
                        style={{ marginRight: "40px" }}
                      >
                        APPLY
                      </button>
                      <button
                        className="FilterApplyButton"
                        onClick={() => {
                          setFilteredData(todotask);
                          setFilterOptions([]);
                          close();
                        }}
                      >
                        CLEAR FILTER
                      </button>
                    </div>
                  </div>
                )}
              </Popup>
            </div>
          </div>
          <div className="table1">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>DOCUMENT</strong>
                  </TableCell>
                  <TableCell>
                    <strong>DATE</strong>
                  </TableCell>
                  <TableCell>
                    <strong>TYPE</strong>
                  </TableCell>
                  <TableCell>
                    <strong>PICKED BY</strong>
                  </TableCell>
                  <TableCell>
                    <strong></strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((item) => (
                  <TableRow style={{ height: "10px" }} key={item.id} hover>
                    <TableCell>{item.file_name}</TableCell>
                    <TableCell>{formatDate(item.assigned_dt)}</TableCell>
                    <TableCell>{getType(item.file_name)}</TableCell>
                    <TableCell>{item.username}</TableCell>
                    <TableCell>
                      <Popup
                        trigger={
                          <button
                            className="button_pick"
                            disabled={!!item.username}
                          >
                            {item.username ? "PICKED" : "PICK"}
                          </button>
                        }
                        open={pickPopupOpen[item.file_id]}
                        onClose={() =>
                          setPickPopupOpen({
                            ...pickPopupOpen,
                            [item.file_id]: false,
                          })
                        }
                        modal
                      >
                        {(close) => (
                          <div style={{ height: "100px", padding: "10px" }}>
                            <div>
                              <h4>
                                Are you sure you want to pick {item.file_name}?
                              </h4>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "right",
                                marginTop: "5%",
                              }}
                            >
                              <button
                                style={{ marginRight: "10px" }}
                                className="button_pick"
                                onClick={() => {
                                  handlePick(item);
                                  setPickPopupOpen({
                                    ...pickPopupOpen,
                                    [item.file_id]: false,
                                  });
                                }}
                              >
                                Yes
                              </button>
                              <button
                                className="button_pick"
                                onClick={() => {
                                  setPickPopupOpen({
                                    ...pickPopupOpen,
                                    [item.file_id]: false,
                                  }); // Close Popup on "No" button click
                                  close();
                                }}
                              >
                                No
                              </button>
                            </div>
                          </div>
                        )}
                      </Popup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="next_back">
            <Button
              className="back_button"
              sx={{ marginRight: 1, marginTop: 5.5 }}
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              back
            </Button>
            <Button
              className="next_button"
              sx={{ marginRight: 1, marginTop: 5.5 }}
              onClick={nextPage}
              disabled={indexOfLastItem >= filteredData.length}
            >
              next
            </Button>
          </div>
        </div>
        <div className="rev_rows">
          <div className="rev_myqueue">
            <div className="rev_heading">
              <div> MY QUEUE</div>
              <div className="filterbutton">
                <Link to="myqueue">
                  <LaunchOutlinedIcon
                    fontSize="large"
                    style={{ color: "black" }}
                  />
                </Link>
              </div>
            </div>
            <div className="table1">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>DOCUMENT</strong>
                    </TableCell>
                    <TableCell>
                      <strong>PICKED ON</strong>
                    </TableCell>
                    <TableCell>
                      <strong></strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {qcurrentItems.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>{item.file_name}</TableCell>
                      <TableCell>{formatDate(item.assigned_dt)}</TableCell>
                      <TableCell>
                        <button
                          className="button_pick"
                          onClick={() => {
                            handleStart(item.file_id, item.file_name);
                          }}
                        >
                          START
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="next_back">
              <Button
                className="back_button"
                sx={{ marginRight: 1, marginTop: 5.5 }}
                onClick={qprevPage}
                disabled={qcurrentPage === 1}
              >
                back
              </Button>
              <Button
                className="next_button"
                sx={{ marginRight: 1, marginTop: 5.5 }}
                onClick={qnextPage}
                disabled={qindexOfLastItem >= myQueueData.length}
              >
                next
              </Button>
            </div>
          </div>
          <div className="rev_draft">
            <div className="rev_heading">
              <div>DRAFT</div>
              <div className="filterbutton">
                <Link to="draft">
                  <LaunchOutlinedIcon
                    fontSize="large"
                    style={{ color: "black" }}
                  />
                </Link>
              </div>
            </div>
            <div className="table1">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>DOCUMENT</strong>
                    </TableCell>
                    <TableCell>
                      <strong>LAST MODIFIED </strong>
                    </TableCell>
                    <TableCell>
                      <strong></strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dcurrentItems.map((item) => (
                    <TableRow style={{ height: "60px" }} key={item.id} hover>
                      <TableCell>{item.file_name}</TableCell>
                      <TableCell>{formatDate(item.updated_dt)}</TableCell>
                      <TableCell>
                        <button className="button_pick">RESUME</button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="next_back">
              <Button
                className="back_button"
                sx={{ marginRight: 1, marginTop: 5.5 }}
                onClick={dprevPage}
                disabled={dcurrentPage === 1}
              >
                back
              </Button>
              <Button
                className="next_button"
                sx={{ marginRight: 1, marginTop: 5.5 }}
                onClick={dnextPage}
                disabled={dindexOfLastItem >= draftData.length}
              >
                next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main_reviewer;
