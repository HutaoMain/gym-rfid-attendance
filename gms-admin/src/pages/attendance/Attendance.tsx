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
import { useMemo, useState, useEffect } from "react";
// import moment from "moment";
import { Search } from "@mui/icons-material";
import { IAttendance } from "../../Types";
import moment from "moment";
import DatePicker from "react-datepicker";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const Attendance = () => {
  const { data } = useQuery<IAttendance[]>({
    queryKey: ["Attendance"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/attendance/list`)
        .then((res) => res.data),
  });

  if (data && data.length > 0) {
    data.sort(
      (a, b) =>
        new Date(b.attendanceDate).getTime() -
        new Date(a.attendanceDate).getTime()
    );
  }

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [filteredDataCount, setFilteredDataCount] = useState<number>(0);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  const filteredData = useMemo(() => {
    return data?.filter((order) => {
      const orderDate = moment(order.attendanceDate, "YYYY-MM-DD hh:mm A");

      // Check if the orderDate falls within the selected date range
      const isDateInRange =
        startDate &&
        endDate &&
        orderDate.isBetween(
          moment(startDate).startOf("day"),
          moment(endDate).endOf("day"),
          "day",
          "[]"
        );

      // Check if the search term matches the first name or last name
      const isSearchMatch =
        order?.lastName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        order?.firstName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        order?.rfid?.toLowerCase()?.includes(searchTerm.toLowerCase());

      // Return true if either date or search term matches
      return isDateInRange && isSearchMatch;
    });
  }, [data, startDate, endDate, searchTerm]);

  useEffect(() => {
    // Update the filtered data count whenever filteredData changes
    setFilteredDataCount(filteredData?.length || 0);
  }, [startDate, endDate, searchTerm]);

  const exportToExcel = () => {
    const attendanceData =
      filteredData?.map((item) => ({
        RFID: item.rfid,
        Fullname: `${item.lastName}, ${item.firstName}`,
        AttendanceDate: item.attendanceDate,
      })) || [];

    const worksheet = XLSX.utils.json_to_sheet(attendanceData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AttendanceData");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "AttendanceData.xlsx");
  };

  return (
    <div className="user">
      <div style={{ display: "flex", paddingTop: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>Start Date: </span>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            dateFormat="yyyy-MM-dd"
            isClearable
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>End Date: </span>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            dateFormat="yyyy-MM-dd"
            isClearable
          />
        </div>
      </div>
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
              placeholder="Search FirstName, LastName or RFID"
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
      <div
        style={{
          width: "100%",
          display: "flex",
          padding: "20px 500px 20px 0",
          justifyContent: "flex-end",
          fontSize: "25px",
        }}
      >
        {filteredDataCount} {filteredDataCount === 1 ? "result" : "results"}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          fontSize: "20px",
          width: "100%",
          paddingTop: "20px",
          gap: "10px",
        }}
      >
        <button
          style={{
            width: "200px",
            height: "50px",
            border: "none",
            color: "#ffffff",
            backgroundColor: "black",
            borderRadius: "20px",
            cursor: "pointer",
          }}
          onClick={exportToExcel}
        >
          Export to Excel
        </button>
      </div>
    </div>
  );
};

export default Attendance;
