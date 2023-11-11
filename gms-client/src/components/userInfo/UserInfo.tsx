import { useState, useRef, useEffect } from "react";
import { UserInterface } from "../../Types";
import axios from "axios";
import "./UserInfo.css";
import moment from "moment";
import { toast } from "react-toastify";

interface Prop {
  openAttendance: boolean;
  toggleCloseAttendance: () => void;
}

const UserInfo = ({ openAttendance, toggleCloseAttendance }: Prop) => {
  const [rfidNumber, setRfidNumber] = useState<string>();
  const [userData, setUserData] = useState<UserInterface>();

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (openAttendance && inputRef.current) {
        inputRef.current.focus();
      }
    }, 1);
  }, [openAttendance]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/user/rfid/${rfidNumber}`
      );
      setUserData(res.data);
    };
    fetchData();
  }, [rfidNumber]);

  const handleRetry = () => {
    setRfidNumber("");
    setTimeout(() => {
      if (openAttendance && inputRef.current) {
        inputRef.current.focus();
      }
    }, 1);
  };

  const handleTimeIn = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/attendance/create`,
        {
          rfid: rfidNumber,
          lastName: userData?.lastName,
          firstName: userData?.firstName,
          attendanceDate: moment().format("YYYY-MM-DD hh:mm A"),
        }
      );
      toggleCloseAttendance();
      toast("Successfully Time-in!", {
        type: "success",
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="userinfo-box">
      <input
        type="text"
        ref={inputRef}
        autoFocus={openAttendance}
        value={rfidNumber}
        className="userinfo-input"
        onChange={(e) => setRfidNumber(e.target.value)}
      />
      {userData && (
        <>
          <img src={userData?.imageUrl} alt="" className="userinfo-image" />
          <div className="userinfo-info-container">
            <span>
              FullName: {userData?.lastName}, {userData?.firstName}
            </span>
            <span>Gender: {userData?.gender}</span>
            <span>Address: {userData?.address}</span>
            <span>Contact Number: {userData?.contactNumber}</span>
          </div>
          <button className="userinfo-timein-button" onClick={handleTimeIn}>
            Time in
          </button>
        </>
      )}

      <button className="userinfo-cancel-button" onClick={handleRetry}>
        Retry
      </button>

      <button
        className="userinfo-cancel-button"
        onClick={toggleCloseAttendance}
      >
        Cancel Attendance
      </button>
    </div>
  );
};

export default UserInfo;
