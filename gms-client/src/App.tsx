import { Routes, Route } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/navbar/Navbar";
import Shop from "./pages/shop/Shop";

function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="app-body">
        <Routes>
          <Route path="/" element={<Shop />} />
        </Routes>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
