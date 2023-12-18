// client
export interface ProductInterface {
  id: string;
  productName: string;
  productImage: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
}

export interface CategoryInterface {
  id: string;
  categoryName: string;
  createdDate: Date;
}

export interface LoginInterface {
  email: string;
  password: string;
}

export interface UserInterface {
  id: string;
  rfid: string;
  email: string;
  password: string;
  userRole: string;
  contactNumber: string;
  lastName: string;
  firstName: string;
  gender: string;
  address: string;
  createdAt: string;
  subscription: string;
}

export interface OrderInterface {
  id: string;
  totalPrice: number;
  orderList: string;
  status: string;
  orderDate: string;
  rfid: string;
}

export interface totalPricePerMonthInterface {
  date: number;
  totalSales: string;
}

export interface IAttendance {
  rfid: string;
  lastName: string;
  firstName: string;
  attendanceDate: string;
}

export interface ISales {
  product: {
    id: string;
    productName: string;
    productImage: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
  };
  sold: number;
  totalPriceSolds: number;
  orderDate: string;
}
