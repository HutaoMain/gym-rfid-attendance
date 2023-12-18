import { Routes, Route } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/navbar/Navbar";
import Shop from "./pages/shop/Shop";
import ScreenSaver from "./pages/screenSaver/ScreenSaver";
import { useState, useEffect } from "react";
import { useIdleTimer } from "react-idle-timer";

function App() {
  const [state, setState] = useState<string>("Active");

  const onIdle = () => {
    setState("Idle");
  };

  const onActive = () => {
    setState("Active");
  };

  const { getRemainingTime } = useIdleTimer({
    onIdle,
    onActive,
    timeout: 30_000, // 30 seconds
    throttle: 500,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Remaining time: ", Math.ceil(getRemainingTime() / 1000));
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [getRemainingTime]);

  return (
    <div className="app">
      {state === "Idle" ? (
        <ScreenSaver />
      ) : (
        <>
          <Navbar />
          <div className="app-body">
            <Routes>
              <Route path="/" element={<Shop />} />
            </Routes>
          </div>
          <ToastContainer />
        </>
      )}
    </div>
  );
}

export default App;
