import {
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import moment from "moment";
import DatePicker from "react-datepicker";
import ViewOrder from "../../components/modal/view_orders/ViewOrder";
import { OrderInterface } from "../../Types";
import { toast } from "react-toastify";
import { Search } from "@mui/icons-material";

const Order = () => {
  const [orderData, setOrderData] = useState<OrderInterface[]>([]);
  const [orderId, setOrderId] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  const handleStatusChange = async (event: any, id: any) => {
    const newStatus = event.target.value as string;

    try {
      await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/order/updateStatus/${id}`,
        {
          status: newStatus,
        }
      );
      toast.success("Sucessfully updated the status!", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/order/list`
      );
      setOrderData(res.data);
    };
    fetch();
  }, []);

  const filteredData = useMemo(() => {
    return orderData?.filter((order) => {
      const orderDate = moment(order.orderDate, "YYYY-MM-DD");

      const isDateInRange =
        startDate &&
        endDate &&
        orderDate.isBetween(
          moment(startDate).startOf("day"),
          moment(endDate).endOf("day"),
          "day",
          "[]"
        );

      const isSearchMatch = order?.rfid
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase());

      return isDateInRange && isSearchMatch;
    });
  }, [orderData, startDate, endDate, searchTerm]);

  const toggleModal = (id: string) => {
    setOrderId(id);
    setOpen(true);
  };

  const toggleClose = () => {
    setOpen(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        paddingTop: "20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", gap: "20px" }}>
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
        <div>
          <div
            style={{
              border: "2px solid black",
              width: "100%",
              display: "flex",
              alignItems: "center",
              paddingLeft: "20px",
              borderRadius: "20px",
              height: "40px",
            }}
          >
            <Search />
            <input
              style={{
                width: "70%",
                border: "none",
                outline: "none",
                height: "10px",
              }}
              type="text"
              placeholder="Search RFID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <TableContainer className="product">
        <Table className="product-table">
          <TableHead className="product-tablehead">
            <TableRow>
              <TableCell className="assessment-header" align="center">
                Transaction ID
              </TableCell>
              <TableCell className="assessment-header" align="center">
                RFID
              </TableCell>
              <TableCell className="assessment-header" align="center">
                Order Date
              </TableCell>
              <TableCell className="assessment-header" align="center">
                Total Price
              </TableCell>
              <TableCell className="assessment-header" align="center">
                Status
              </TableCell>

              <TableCell className="assessment-header" align="center">
                Action Button
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="product-tablebody">
            {filteredData?.map((item) => (
              <TableRow key={item.id}>
                <TableCell align="center">{item.id}</TableCell>
                <TableCell align="center">{item.rfid}</TableCell>
                <TableCell align="center">
                  {moment(item.orderDate).format("YYYY-MM-DD")}
                </TableCell>
                <TableCell align="center">{item.totalPrice}</TableCell>
                <TableCell align="center">
                  <select
                    defaultValue={item.status}
                    onChange={(e) => handleStatusChange(e, item.id)}
                    disabled={item.status === "Paid"}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Void">Void</option>
                    <option value="Paid">Paid</option>
                  </select>
                </TableCell>

                <TableCell align="center">
                  <button
                    className="product-btn"
                    onClick={() => toggleModal(item.id)}
                  >
                    View Orders
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={toggleClose}>
        <DialogContent>
          <ViewOrder toggleClose={toggleClose} orderId={orderId} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Order;
