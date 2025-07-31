import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Store from "./Store/Store.js";
import { Provider } from "react-redux";

// Lazy loaded components
const Signin = lazy(() => import("./Pages/Signin.jsx"));
const Signup = lazy(() => import("./Pages/Signup.jsx"));
const Dashboard = lazy(() => import("./Pages/Dashboard.jsx"));
const AssignToken = lazy(() => import("./Pages/AssignToken.jsx"));
const CreateBill = lazy(() => import("./Pages/CreateBill.jsx"));
const PatientRecords = lazy(() => import("./Pages/PatientRecords.jsx"));

// Routing configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Signup />,
  },
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/Clinic-Management",
    element: <App />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "assign-token",
        element: <AssignToken />,
      },
      {
        path: "create-bill",
        element: <CreateBill />,
      },
      {
        path: "patient-records",
        element: <PatientRecords />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={Store}>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  </StrictMode>
);
