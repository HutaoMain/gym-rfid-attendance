import "./User.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogContent,
} from "@mui/material";
import axios from "axios";
import { useQuery } from "react-query";
import { useState } from "react";
import moment from "moment";
import { Search } from "@mui/icons-material";
import { UserInterface } from "../../Types";
import AddUser from "../../components/modal/add_user/AddUser";
import { toast } from "react-toastify";

const User = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data } = useQuery<UserInterface[]>({
    queryKey: ["Users"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/user/list`)
        .then((res) => res.data),
  });

  const toggleIsOpen = () => {
    setIsOpen(false);
  };

  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredData = data?.filter(
    (item) =>
      item.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onChangeSuscription = async (
    userRfid: string,
    subscription: string
  ) => {
    try {
      await axios.put(
        `${
          import.meta.env.VITE_APP_API_URL
        }/api/user/changeSubscription/${userRfid}`,
        {
          subscription: subscription,
        }
      );
      toast.success("Sucessfully update the subscription!", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log(error);
    }
  };

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
          <button
            style={{
              border: "none",
              padding: "20px",
              borderRadius: "20px",
              width: "100%",
              cursor: "pointer",
            }}
            onClick={() => setIsOpen(true)}
          >
            Add User
          </button>
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
                <span className="text-white font-bold">Contact #</span>
              </TableCell>
              <TableCell align="center">
                <span className="text-white font-bold">Lastname</span>
              </TableCell>
              <TableCell align="center">
                <span className="text-white font-bold">Firstname</span>
              </TableCell>
              <TableCell align="center">
                <span className="text-white font-bold">Gender</span>
              </TableCell>
              <TableCell align="center">
                <span className="text-white font-bold">Address</span>
              </TableCell>
              <TableCell align="center">
                <span className="text-white font-bold">Date Created</span>
              </TableCell>
              <TableCell align="center">
                <span className="text-white font-bold">Subscription</span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="assessment-tablebody">
            {filteredData?.map((item) => (
              <TableRow key={item.id}>
                <TableCell align="center">{item.rfid}</TableCell>
                <TableCell align="center">{item.contactNumber}</TableCell>
                <TableCell align="center">{item.lastName}</TableCell>
                <TableCell align="center">{item.firstName}</TableCell>
                <TableCell align="center">{item.gender}</TableCell>
                <TableCell align="center">{item.address}</TableCell>
                <TableCell align="center">
                  {moment(item.createdAt).format("YYYY-MM-DD")}
                </TableCell>
                <TableCell align="center">
                  <select
                    defaultValue={item.subscription}
                    style={{ width: "200px" }}
                    onChange={(e) =>
                      onChangeSuscription(item.rfid, e.target.value)
                    }
                  >
                    <option value="No subscription">No subscription</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Daily">Daily</option>
                  </select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={isOpen} onClose={toggleIsOpen} maxWidth="sm">
        <DialogContent>
          <AddUser toggleIsOpen={toggleIsOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default User;
