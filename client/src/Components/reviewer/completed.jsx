import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";
import { useAuth } from "../../AuthContext";

function Completed() {
  const [completedData, setCompletedData] = useState([]);
  const { currentuserId } = useAuth();

  useEffect(() => {
    const user_id = currentuserId;
    axios
      .get(`http://localhost:3002/api/getreviewer/${user_id}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setCompletedData(
            response.data.filter((user) => user.iscompleted === true)
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()} - ${
      date.getMonth() + 1
    } - ${date.getFullYear()}`;
    return formattedDate;
  }

  //completed task pagination
  const [qcurrentPage, setqCurrentPage] = useState(1);

  const qindexOfLastItem = qcurrentPage * 10;
  const qindexOfFirstItem = qindexOfLastItem - 10;
  const qcurrentItems = completedData.slice(
    qindexOfFirstItem,
    qindexOfLastItem
  );

  const qnextPage = () => setqCurrentPage(qcurrentPage + 1);
  const qprevPage = () => setqCurrentPage(qcurrentPage - 1);

  return (
    <div className="c_main">
      <div>COMPLETED TASKS</div>
      <div className="c_content">
        <div className="c_column1" style={{ width: "780px" }}>
          <div className="">
            <div className="table1" style={{ height: "420px" }}>
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
                      <strong>SUBMITTED ON</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {qcurrentItems.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>{item.file_name}</TableCell>
                      <TableCell>{formatDate(item.assigned_dt)}</TableCell>
                      <TableCell>{formatDate(item.submitted_dt)}</TableCell>
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
                disabled={qindexOfLastItem >= completedData.length}
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

export default Completed;
