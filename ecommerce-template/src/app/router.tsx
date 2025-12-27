import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { CatalogPage } from "../pages/CatalogPage";
import { CartPage } from "../pages/CartPage";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/catalog", element: <CatalogPage /> },
  { path: "/cart", element: <CartPage /> }
]);