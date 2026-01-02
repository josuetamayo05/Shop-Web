import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { ConfigProvider } from "./app/providers/ConfigProvider";
import { CatalogProvider } from "./app/providers/CatalogProvider";
import "./index.css"; 
import { CheckoutProvider } from "./app/providers/CheckoutProvider";
import { ToastProvider } from "./core/toast/ToastProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider>
      <CatalogProvider>
        <CheckoutProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </CheckoutProvider>
      </CatalogProvider>
    </ConfigProvider>
  </React.StrictMode>
);