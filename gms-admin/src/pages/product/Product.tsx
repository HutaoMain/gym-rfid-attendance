import "./Product.css";
import {
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useQuery } from "react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Search } from "@mui/icons-material";
import { CategoryInterface, ProductInterface } from "../../Types";
import AddProduct from "../../components/modal/add_product/AddProduct";
import UpdateProduct from "../../components/modal/update_product/UpdateProduct";

const Product = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [productId, setProductId] = useState<string>("");
  const [categoryData, setCategoryData] = useState<CategoryInterface[]>();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const toggleModal = () => {
    setOpen(false);
  };

  const toggleUpdateModal = (id: string) => {
    setProductId(id);
    setOpenUpdate(true);
  };

  const toggleCloseUpdateModal = () => {
    setOpenUpdate(false);
  };

  const { data } = useQuery<ProductInterface[]>({
    queryKey: ["Product"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/product/list`)
        .then((res) => res.data),
  });

  const handleDelete = async (productId: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/api/product/delete/${productId}`
      );
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/category/list`
      );
      setCategoryData(res.data);
    };
    fetch();
  }, []);

  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredData = data?.filter(
    (item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      item.category.toLowerCase().includes(selectedCategory)
  );

  return (
    <>
      <TableContainer
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "80%",
            alignItems: "center",
            gap: "20px",
            marginBottom: "20px",
            marginTop: "20px",
          }}
        >
          <button
            style={{
              border: "none",
              padding: "20px",
              borderRadius: "20px",
              width: "100%",
              cursor: "pointer",
            }}
            onClick={() => setOpen(true)}
          >
            Add Product
          </button>
          <div
            style={{
              border: "2px solid black",
              width: "100%",
              display: "flex",
              alignItems: "center",
              paddingLeft: "20px",
              borderRadius: "20px",
            }}
          >
            <Search />
            <input
              style={{
                width: "80%",
                border: "none",
                outline: "none",
                padding: "20px",
              }}
              type="text"
              placeholder="Search Product Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            style={{
              height: "75px",
              width: "100%",
              borderRadius: "10px",
              fontSize: "18px",
            }}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categoryData?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.categoryName}
              </option>
            ))}
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
                Quantity
              </TableCell>
              <TableCell className="assessment-header" align="center">
                Action Button
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="product-tablebody">
            {filteredData?.map((item) => (
              <TableRow key={item.id}>
                <TableCell align="center">{item.productName}</TableCell>
                <TableCell align="center">
                  <img
                    src={item.productImage}
                    alt=""
                    className="product-image"
                  />
                </TableCell>
                <TableCell align="center">{item.description}</TableCell>
                <TableCell align="center">{item.price}</TableCell>
                <TableCell align="center">{item.quantity}</TableCell>

                <TableCell align="center">
                  <button
                    className="product-btn"
                    onClick={() => toggleUpdateModal(item.id)}
                    style={{ backgroundColor: "blue", marginRight: "10px" }}
                  >
                    Update
                  </button>
                  <button
                    className="product-btn"
                    onClick={() => handleDelete(item.id)}
                    style={{ backgroundColor: "red" }}
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={toggleModal}>
        <DialogContent>
          <AddProduct toggleProductModal={toggleModal} />
        </DialogContent>
      </Dialog>
      <Dialog open={openUpdate} onClose={toggleCloseUpdateModal}>
        <DialogContent>
          <UpdateProduct
            toggleCloseUpdateModal={toggleCloseUpdateModal}
            productId={productId}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Product;
