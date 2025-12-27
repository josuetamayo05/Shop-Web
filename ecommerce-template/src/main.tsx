import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { ConfigProvider } from "./app/providers/ConfigProvider";
import { CatalogProvider } from "./app/providers/CatalogProvider";
import "./index.css"; 

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider>
      <CatalogProvider>
        <App />
      </CatalogProvider>
    </ConfigProvider>
  </React.StrictMode>
);