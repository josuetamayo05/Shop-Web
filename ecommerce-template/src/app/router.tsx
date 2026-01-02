import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { CatalogPage } from "../pages/CatalogPage";
import { CartPage } from "../pages/CartPage";
import { ProductPage } from "../pages/ProductPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { OrderPage } from "../pages/OrderPage";
import { AdminPage } from "../pages/AdminPage";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/catalog", element: <CatalogPage /> },
  { path: "/cart", element: <CartPage /> },
  { path: "/checkout", element: <CheckoutPage /> },
  { path: "/order/:orderId", element: <OrderPage /> },
  { path: "/product/:productId", element: <ProductPage />},
  { path: "/admin", element: <AdminPage /> },
  //agrega una ruta placeholder si aún no tienes checkout
  { path: "/checkout",
    element: (
      <div style={{padding: 24}}>
        <h1>Checkout</h1>
        <p>Lo implementamos en el siguiente paso</p>
      </div>
    ),
  }
]);