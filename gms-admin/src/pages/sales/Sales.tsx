import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ISales } from "../../Types";
import { useQuery } from "react-query";
import axios from "axios";
import moment from "moment";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { useEffect, useState } from "react";

interface salesSummary {
  dailySales: number;
  weeklySales: number;
  monthlySales: number;
}

const Sales = () => {
  const [filter, setFilter] = useState("weekly");
  const [weeklyTableSales, setWeekTableSales] = useState<ISales[]>();

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/order/sales/${filter}`
      );
      setWeekTableSales(res.data);
    };
    fetch();
  }, [filter]);

  const { data: salesSummary } = useQuery<salesSummary>({
    queryKey: ["SalesSummary"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/order/salesSummary`)
        .then((res) => res.data),
  });

  const exportToExcel = () => {
    const salesData =
      weeklyTableSales?.map((item) => ({
        productName: item.product.productName,
        description: item.product.description,
        price: item.product.price,
        quantity: item.product.quantity,
        category: item.product.category,
        sold: item.sold,
        totalPriceSolds: item.totalPriceSolds,
        orderDate: moment(item.orderDate).format("dddd YYYY-MM-DD"),
      })) || [];

    const worksheet = XLSX.utils.json_to_sheet(salesData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SalesData");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "SalesData.xlsx");
  };

  const handleChangeFilter = (newFilter: string) => {
    setFilter(newFilter);
  };

  return (
    <>
      <TableContainer
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <div style={{ marginBottom: "20px", width: "500px" }}>
          <label>Select Sales Filter:</label>
          <select
            value={filter}
            onChange={(e) => handleChangeFilter(e.target.value)}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <Table className="product-table">
          <TableHead className="product-tablehead">
            <TableRow>
              <TableCell className="assessment-header" align="center">
                Name
              </TableCell>
              <TableCell className="assessment-header" align="center">
                Image
              </TableCell>
              <TableCell className="assessment-header" align="center">
                Description
              </TableCell>
              <TableCell className="assessment-header" align="center">
                Price
              </TableCell>
              <TableCell className="assessment-header" align="center">
                Total Sold
              </TableCell>
              <TableCell className="assessment-header" align="center">
                Total Sold Price
              </TableCell>
              <TableCell className="assessment-header" align="center">
                Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="product-tablebody">
            {weeklyTableSales?.map((item, key) => (
              <TableRow key={key}>
                <TableCell align="center">{item.product.productName}</TableCell>
                <TableCell align="center">
                  <img
                    src={item.product.productImage}
                    alt=""
                    className="product-image"
                  />
                </TableCell>
                <TableCell align="center">{item.product.description}</TableCell>
                <TableCell align="center">{item.product.price}</TableCell>
                <TableCell align="center">{item.sold}</TableCell>
                <TableCell align="center">{item.totalPriceSolds}</TableCell>
                <TableCell align="center">
                  {filter === "weekly"
                    ? moment(item.orderDate).format("dddd YYYY-MM-DD")
                    : moment(item.orderDate).format("YYYY-MMMM")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
          <span>
            Total Sales for today:{" "}
            <span style={{ fontWeight: "bold" }}>
              {" "}
              ₱{salesSummary?.dailySales}
            </span>
          </span>
          <span>
            Total Sales for this week:{" "}
            <span style={{ fontWeight: "bold" }}>
              {" "}
              ₱{salesSummary?.weeklySales}
            </span>
          </span>
          <span>
            Total Sales for this month:{" "}
            <span style={{ fontWeight: "bold" }}>
              {" "}
              ₱{salesSummary?.monthlySales}
            </span>
          </span>
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
              backgroundColor: "#04AA6D",
              borderRadius: "20px",
              cursor: "pointer",
            }}
            onClick={exportToExcel}
          >
            Export to Excel
          </button>
        </div>
      </TableContainer>
    </>
  );
};

export default Sales;
