import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes/PublicRoutes.jsx";
import "react-day-picker/dist/style.css";
import { QueryClient, QueryClientProvider } from "react-query";
import AuthProvider from "./Contexts/AuthProvider";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <div className="max-w-[1440px] mx-auto">
          <RouterProvider router={router}></RouterProvider>
        </div>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
