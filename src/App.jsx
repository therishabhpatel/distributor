import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DistributorHomepage from "./pages/DistributorHomepage";
import Dashboard from "./components/Dashboard";
import Order from "./components/Order";
import InventoryList from "./components/InventoryList";
import TimeLine from "./components/TimeLine";
import RetailersList from "./components/RetailersList";

// ProtectedRoute to check for authenticated user
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Wrap the /home route with ProtectedRoute */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <DistributorHomepage />
          </ProtectedRoute>
        }
      >
        {/* Protected nested routes inside /home */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="order"
          element={
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          }
        />
        <Route
          path="inventoryList"
          element={
            <ProtectedRoute>
              <InventoryList />
            </ProtectedRoute>
          }
        />
        <Route
          path="timeline"
          element={
            <ProtectedRoute>
              <TimeLine />
            </ProtectedRoute>
          }
        />
        <Route
          path="retailersList"
          element={
            <ProtectedRoute>
              <RetailersList />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
