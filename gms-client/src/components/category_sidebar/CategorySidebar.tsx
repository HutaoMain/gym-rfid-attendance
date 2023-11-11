import axios from "axios";
import { CategoryInterface } from "../../Types";
import "./CategorySidebar.css";
import { useQuery } from "react-query";

type Props = {
  setCategory: (category: string) => void;
};
const CategorySidebar = ({ setCategory }: Props) => {
  const { data } = useQuery<CategoryInterface[]>({
    queryKey: ["categorySideBar"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/category/list`)
        .then((res) => res.data),
  });

  const handleCategoryClick = (category: CategoryInterface) => {
    setCategory(category.categoryName);
  };

  return (
    <div className="category-sidebar">
      <div className="category-sidebar-container">
        <h2 className="category-sidebar-title">Categories</h2>
        <div className="category-item-container">
          <span className="category-item" onClick={() => setCategory("")}>
            All
          </span>
          {data?.map((item, key) => (
            <span
              className="category-item"
              key={key}
              onClick={() => handleCategoryClick(item)}
            >
              {item.categoryName}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;
