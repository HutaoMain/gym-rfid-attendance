import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { useQuery } from "react-query";
import { useState } from "react";
// import moment from "moment";
import { Search } from "@mui/icons-material";
import { IAttendance } from "../../Types";

const Attendance = () => {
  const { data } = useQuery<IAttendance[]>({
    queryKey: ["Attendance"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/attendance/list`)
        .then((res) => res.data),
  });

  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredData = data?.filter(
    (item) =>
      item.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user">
      <TableContainer
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "80%",
            alignItems: "center",
            gap: "20px",
            marginBottom: "20px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              border: "2px solid black",
              width: "100%",
              display: "flex",
              alignItems: "center",
              paddingLeft: "20px",
              borderRadius: "20px",
            }}
          >
            <Search />
            <input
              style={{
                width: "80%",
                border: "none",
                outline: "none",
                padding: "20px",
              }}
              type="text"
              placeholder="Search FirstName or LastName"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Table>
          <TableHead className="bg-[#374151]">
            <TableRow>
              <TableCell align="center">
                <span className="text-white font-bold">RFID</span>
              </TableCell>
              <TableCell align="center">
                <span className="text-white font-bold">Fullname</span>
              </TableCell>
              <TableCell align="center">
                <span className="text-white font-bold">Attendance Date</span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="assessment-tablebody">
            {filteredData?.map((item, key) => (
              <TableRow key={key}>
                <TableCell align="center">{item.rfid}</TableCell>
                <TableCell align="center">
                  {item.lastName}, {item.firstName}
                </TableCell>

                <TableCell align="center">{item.attendanceDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Attendance;
