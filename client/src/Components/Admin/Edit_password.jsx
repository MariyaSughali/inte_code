import axios from "axios";
import { useState } from "react";
import { TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../AuthContext";

function EditPassword({ close }) {
  const { currentuserId } = useAuth();
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handlePasswordUpdate = async () => {
    // Check if newPassword and confirmPassword match
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New password and confirmation password don't match");
      return;
    }
    function validatePassword(newPassword) {
      // Password pattern: 8 characters, at least one uppercase letter, one special character, and one digit
      const passwordPattern = /^(?=.*[A-Z])(?=.*[\W_])(?=.*\d).{8,}$/;
      return passwordPattern.test(newPassword);
    }
    if (!validatePassword(passwords.newPassword)) {
      toast.error(
        "Invalid password format:\n password must contain\n 8 characters\n at least one uppercase letter\n at least one special character\n one digit"
      );
      return;
    }

    try {
      // Send a PUT request to update the password
      const data = {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
        id: currentuserId,
      };
      console.log(data);
      await axios.put(`http://localhost:3002/api/changepassword`, data);
      toast.success("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Invalid old password");
    }
  };
  const handleCancel = () => {
    close();
  };

  return (
    <div>
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
      <TextField
        label="Old Password *"
        type="password"
        name="oldpassword"
        id="oldpassword"
        style={{ marginBottom: "10px" }}
        value={passwords.oldPassword}
        onChange={(e) =>
          setPasswords({ ...passwords, oldPassword: e.target.value })
        }
        fullWidth
        InputLabelProps={{ shrink: true }}
        InputProps={{
          style: {
            height: "40px",
            padding: "5px",
          },
        }}
      />
      <TextField
        label="New Password *"
        type="password"
        name="newpassword"
        id="newpassword"
        value={passwords.newPassword}
        style={{ width: "47%", marginRight: "6%" }}
        onChange={(e) =>
          setPasswords({ ...passwords, newPassword: e.target.value })
        }
        InputLabelProps={{ shrink: true }}
        InputProps={{
          style: {
            height: "40px",
            padding: "5px",
          },
        }}
      />
      <TextField
        label="Confirm Password *"
        type="password"
        name="confirmpassword"
        id="confirmpassword"
        style={{ width: "47%" }}
        value={passwords.confirmPassword}
        onChange={(e) =>
          setPasswords({ ...passwords, confirmPassword: e.target.value })
        }
        InputLabelProps={{ shrink: true }}
        InputProps={{
          style: {
            height: "40px",
            padding: "5px",
          },
        }}
      />
      <div style={{ marginTop: "5%" }}>
        <button className="cnfpwd_update_button" onClick={handlePasswordUpdate}>
          Update
        </button>
        <button className="cnfpwd_cancel_button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditPassword;
