import { useState, useEffect } from "react";
import "./ScreenSaver.css";
import axios from "axios";
import { useQuery } from "react-query";

interface Props {
  id: string;
  imageUrl: string[];
}

const ScreenSaver = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data } = useQuery<Props>({
    queryKey: ["ScreenSaver"],
    queryFn: () =>
      axios
        .get(
          `${import.meta.env.VITE_APP_API_URL}/api/screensaver/getScreenSaver`
        )
        .then((res) => res.data),
  });

  console.log("image screen saver", data);

  useEffect(() => {
    const interval = setInterval(() => {
      // Auto play next image
      if (data) {
        setCurrentIndex((prevIndex) =>
          prevIndex === data?.imageUrl?.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 3000); // Adjust the duration (in milliseconds)

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [data?.imageUrl]);

  const goToPrev = () => {
    if (data) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? data?.imageUrl.length - 1 : prevIndex - 1
      );
    }
  };

  const goToNext = () => {
    if (data) {
      setCurrentIndex((prevIndex) =>
        prevIndex === data?.imageUrl.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  return (
    <div className="image-container">
      <img
        className="screensaver-image"
        src={data?.imageUrl[currentIndex]}
        alt={`Image ${currentIndex}`}
      />
      <div className="carousel-controls">
        <button onClick={goToPrev}>Previous</button>
        <button onClick={goToNext}>Next</button>
      </div>
    </div>
  );
};

export default ScreenSaver;
