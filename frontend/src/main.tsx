import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App";
import { MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';

const container = document.getElementById("root");

const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <MantineProvider>
      <App />
    </MantineProvider>
  </React.StrictMode>,
);
