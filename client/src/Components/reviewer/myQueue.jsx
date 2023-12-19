import React from "react";
import { useState, useEffect } from "react";
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
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import { useAuth } from "../../AuthContext";

function MyQueue() {
  const [ischanged, setischanged] = useState(true);
  const [myQueueData, setMyQueueData] = useState([]);
  const [draftData, setDraftData] = useState([]);
  const { currentuserId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const user_id = currentuserId;

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
    const extension = file_name.split(".").pop();
    return extension === "docx" ? "Document" : "Audio";
  }
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
  //myqueue pagination
  const [qcurrentPage, setqCurrentPage] = useState(1);

  const qindexOfLastItem = qcurrentPage * 10;
  const qindexOfFirstItem = qindexOfLastItem - 10;
  const qcurrentItems = myQueueData.slice(qindexOfFirstItem, qindexOfLastItem);

  const qnextPage = () => setqCurrentPage(qcurrentPage + 1);
  const qprevPage = () => setqCurrentPage(qcurrentPage - 1);

  //draft pagination
  const [dcurrentPage, setdCurrentPage] = useState(1);

  const dindexOfLastItem = dcurrentPage * 5;
  const dindexOfFirstItem = dindexOfLastItem - 5;
  const dcurrentItems = draftData.slice(dindexOfFirstItem, dindexOfLastItem);

  const dnextPage = () => setdCurrentPage(dcurrentPage + 1);
  const dprevPage = () => setdCurrentPage(dcurrentPage - 1);

  return (
    <div className="q_main">
      <div>MY QUEUE</div>
      <div className="c_content">
        <div className="c_column1">
          <div className="">
            <div className="table1" style={{ height: "435px" }}>
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
                      <strong>TYPE</strong>
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
                      <TableCell>{getType(item.file_name)}</TableCell>

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
        </div>
        <div className="c_column2">
          <div className="c_row1">
            <div className="">
              <div className="rev_heading">
                <div> DRAFT</div>
                <div className="filterbutton">
                  <Link to="/reviewer_dashboard/draft">
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
                        <strong>LAST MODIFIED ON</strong>
                      </TableCell>
                      <TableCell>
                        <strong></strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dcurrentItems.map((item) => (
                      <TableRow key={item.id} hover>
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
    </div>
  );
}

export default MyQueue;
