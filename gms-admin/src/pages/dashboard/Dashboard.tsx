import "./Dashboard.css";
import { ArrowDropUp } from "@mui/icons-material";
import { useQuery } from "react-query";
import axios from "axios";
import BarChart from "../../components/barChart/BarChart";
import ProductRating from "../../components/productRating/ProductRating";

const Dashboard = () => {
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/order/total-price`)
        .then((res) => res.data),
  });

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <BarChart />
      </div>

      <div className="dashboard-container">
        <ProductRating />
        <div className="total-sales-container">
          <h1>TOTAL SALES</h1>
          <div className="total-sales">
            <ArrowDropUp sx={{ fontSize: "80px" }} />
            <b style={{ fontSize: "80px" }}>{data}</b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
