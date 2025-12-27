import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { CatalogPage } from "../pages/CatalogPage";
import { CartPage } from "../pages/CartPage";
import { ProductPage } from "../pages/ProductPage";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/catalog", element: <CatalogPage /> },
  { path: "/cart", element: <CartPage /> },
  { path: "/product/:productId", element: <ProductPage />}
]);