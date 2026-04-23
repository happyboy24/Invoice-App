import "@fontsource/league-spartan/400.css";
import "@fontsource/league-spartan/500.css";
import "@fontsource/league-spartan/700.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import { router } from "./routes/router";
import { InvoiceProvider } from "./context/InvoiceContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <InvoiceProvider>
        <RouterProvider router={router} />
      </InvoiceProvider>
    </ThemeProvider>
  </StrictMode>,
);
