import { Slider } from "@mui/material";

function valuetext(value: number) {
  return `${value}`;
}

type FilterSliderProps = {
  priceRange: number[];
  setPriceRange: (newPriceRange: number[]) => void;
};

const FilterSlider = ({ priceRange, setPriceRange }: FilterSliderProps) => {
  const minimumPrice: number = 1;
  // const [priceRange, setPriceRange] = useState<number[]>([20, 37]);

  const handlePriceRange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    console.log(event);
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setPriceRange([
        Math.min(newValue[0], priceRange[1] - minimumPrice),
        priceRange[1],
      ]);
    } else {
      setPriceRange([
        priceRange[0],
        Math.max(newValue[1], priceRange[0] + minimumPrice),
      ]);
    }
  };

  return (
    <div
      style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      <h1>Filter By Price</h1>
      <hr />
      <Slider
        getAriaLabel={() => "Price Range"}
        max={10000}
        min={0}
        value={priceRange}
        onChange={handlePriceRange}
        valueLabelDisplay="on"
        getAriaValueText={valuetext}
        disableSwap
        sx={{ color: "red" }}
      />
      <span style={{ fontSize: "20px" }}>
        ₱{priceRange[0]} - ₱{priceRange[1]}
      </span>
    </div>
  );
};

export default FilterSlider;
