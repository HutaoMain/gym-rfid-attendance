import "./ViewOrder.css";
import axios from "axios";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { OrderInterface, ProductInterface } from "../../../Types";

interface Prop {
  toggleClose: () => void;
  orderId: string;
}

const ViewOrder = ({ toggleClose, orderId }: Prop) => {
  const [orderListJson, setOrderListJson] = useState<ProductInterface[]>();

  const { data } = useQuery<OrderInterface>({
    queryKey: ["getOrderToGetOrderList"],
    queryFn: async () =>
      await axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/order/list/${orderId}`)
        .then((res) => res.data),
  });

  console.log("orderlist by id ", data?.orderList);

  useEffect(() => {
    setOrderListJson(eval(data?.orderList || ""));
  }, [data]);

  return (
    <div className="vieworder">
      <div>
        <div
          style={{
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span></span>
          <button onClick={toggleClose} className="view-order-close-btn">
            Close
          </button>
        </div>

        <section className="ordercard">
          {orderListJson?.map((orderItem) => (
            <div className="ordercard-container" key={orderItem.id}>
              <img
                className="orderlist-image"
                src={orderItem.productImage}
                alt=""
              />
              <div className="ordercard-info-container">
                <span>
                  <b>Product Name: </b>
                  {orderItem.productName}
                </span>
                <span style={{ color: "gray" }}>
                  <b>Product Description: </b>
                  {orderItem.description}
                </span>
                <span>
                  <b>Product Price: </b>₱{orderItem.price}
                </span>
                <span>
                  <b>Product Quantity: </b>
                  {orderItem.quantity}
                </span>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default ViewOrder;
