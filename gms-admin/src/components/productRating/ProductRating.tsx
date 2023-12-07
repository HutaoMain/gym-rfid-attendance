import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useQuery } from "react-query";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Prop {
  rating: number;
  count: number;
}

const ProductRating = () => {
  const { data } = useQuery<Prop[]>({
    queryKey: ["ProductRating"],
    queryFn: () =>
      axios
        .get(
          `${import.meta.env.VITE_APP_API_URL}/api/productRating/count-ratings`
        )
        .then((res) => res.data),
  });

  const counts = data?.map((item) => item.count);

  const pieChartData = {
    labels: ["1 star", "2 star", "3 star", "4 star", "5 star"],
    datasets: [
      {
        data: counts,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "3px solid gray",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        width: "60%",
      }}
    >
      <h1 style={{ margin: "0px", padding: "0px" }}>Rating</h1>
      <Pie data={pieChartData} />
    </div>
  );
};

export default ProductRating;
