import {
  Chart as ChartJs,
  BarElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { totalPricePerMonthInterface } from "../../Types";

ChartJs.register(CategoryScale, LinearScale, BarElement, Legend, Tooltip);

const BarChart = () => {
  const [chartData, setChartData] = useState<totalPricePerMonthInterface[]>([]);
  const [filter, setFilter] = useState("monthly");

  const { data } = useQuery<totalPricePerMonthInterface[]>({
    queryKey: ["barChart", filter], // Separate "barChart" and filter as distinct elements
    queryFn: () =>
      axios
        .get(
          `${
            import.meta.env.VITE_APP_API_URL
          }/api/order/total-sales-per-${filter}`
        )
        .then((res) => res.data),
  });

  console.log("here is the data: ", data);

  useEffect(() => {
    setChartData(data || []);
  }, [data, filter]);

  const handleChangeFilter = (newFilter: string) => {
    setFilter(newFilter);
  };

  const graph = {
    labels: chartData?.map((item) => item.date),
    datasets: [
      {
        label: `Sold per ${filter}`,
        data: chartData?.map((item) => item.totalSales),
        backgroundColor: [
          "#bcbcbc",
          "#999999",
          "#5b5b5b",
          "#444444",
          "#242424",
          "#191818",
          "#000000",
        ],
        borderColor: [
          "#bcbcbc",
          "#999999",
          "#5b5b5b",
          "#444444",
          "#242424",
          "#191818",
          "#000000",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
  };

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        marginBottom: "200px",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <label>Select Sales Filter:</label>
        <select
          value={filter}
          onChange={(e) => handleChangeFilter(e.target.value)}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <div style={{ padding: "20px", border: "3px solid gray" }}>
        <Bar data={graph} options={barOptions} />
      </div>
    </div>
  );
};

export default BarChart;
