import "./Category.css";
import { useQuery } from "react-query";
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
import { useState } from "react";
import axios from "axios";
import moment from "moment";
import { Search } from "@mui/icons-material";
import { CategoryInterface } from "../../Types";
import AddCategory from "../../components/modal/add_category/AddCategory";
import UpdateCategory from "../../components/modal/update_category/UpdateCategory";

const Category = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [productId, setProductId] = useState<string>("");
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);

  const toggleModal = () => {
    setOpen(false);
  };

  const { data } = useQuery<CategoryInterface[]>({
    queryKey: ["Category"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/category/list`)
        .then((res) => res.data),
  });

  const handleDelete = async (productId: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/api/category/delete/${productId}`
      );
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleUpdate = (productId: string) => {
    setProductId(productId);
    setOpenUpdate(true);
  };

  const toggleUpdateClose = () => {
    setOpenUpdate(false);
  };

  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredData = data?.filter((item) =>
    item.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <TableContainer
        style={{
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
            Add Category
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
              placeholder="Search Category Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Table className="product-table">
          <TableHead className="product-tablehead">
            <TableRow>
              <TableCell className="assessment-header" align="center">
                Category Name
              </TableCell>
              <TableCell className="assessment-header" align="center">
                Created Date
              </TableCell>
              <TableCell className="assessment-header" align="center">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="product-tablebody">
            {filteredData?.map((item) => (
              <TableRow key={item.id}>
                <TableCell align="center">{item.categoryName}</TableCell>
                <TableCell align="center">
                  {moment(item.createdDate).format("YYYY-MM-DD")}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <button
                    className="product-btn"
                    onClick={() => toggleUpdate(item.id)}
                  >
                    Update
                  </button>
                  <button
                    className="product-btn"
                    onClick={() => handleDelete(item.id)}
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
          <AddCategory toggleModal={toggleModal} />
        </DialogContent>
      </Dialog>
      <Dialog open={openUpdate} onClose={toggleUpdateClose}>
        <DialogContent>
          <UpdateCategory
            toggleModal={toggleUpdateClose}
            productId={productId}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Category;
