import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import SignUpMedicine from "./pages/RegisterMedicine";
import Transactions from "./pages/Movements";
import Stock from "./pages/Stock";
import StockEntry from "./pages/StockIn";
import Resident from "./pages/Residents";
import RegisterResident from "./pages/RegisterResident";
import EditResident from "./pages/EditResident";
import StockOut from "./pages/StockOut";
import EditMedicine from "./pages/EditMedicine";
import EditInput from "./pages/EditInput";
import Medicines from "./pages/Medicines";
import Cabinets from "./pages/Cabinets";
import RegisterCabinet from "./pages/RegisterCabinet";
import EditCabinet from "./pages/EditCabinet";  
import RegisterInput from "./pages/RegisterInput";
import Inputs from "./pages/Inputs";

import { AuthProvider } from "./context/auth-context";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/user/login" replace />} />
            <Route path="/user/login" element={<Auth />} />

            <Route
              path="/dashboard"
              element={
                  <Dashboard />
              }
            />
            <Route
              path="/transactions"
              element={
                  <Transactions />
              }
            />
            <Route
              path="/medicines"
              element={
                  <Medicines />
              }
            />
            <Route
              path="/medicines/register"
              element={
                  <SignUpMedicine />
              }
            />
            <Route
              path="/medicines/edit"
              element={
                  <EditMedicine />
              }
            />
            <Route
              path="/stock"
              element={
                  <Stock />
              }
            />
            <Route
              path="/stock/in"
              element={
                  <StockEntry />
              }
            />
            <Route
              path="/stock/out"
              element={
                  <StockOut />
              }
            />
            <Route
              path="/residents"
              element={
                  <Resident />
              }
            />
            <Route
              path="/residents/register"
              element={
                  <RegisterResident />
              }
            />
            <Route
              path="/residents/edit"
              element={
                  <EditResident />
              }
            />
            <Route
              path="/inputs"
              element={
                  <Inputs />
              }
            />
            <Route
              path="/inputs/register"
              element={
                  <RegisterInput />
              }
            />
            <Route
              path="/inputs/edit"
              element={
                  <EditInput />
              }
            />
            <Route
              path="/cabinets"
              element={
                  <Cabinets />
              }
            />
            <Route
              path="/cabinets/register"
              element={
                  <RegisterCabinet />
              }
            />
            <Route
              path="/cabinets/edit"
              element={
                  <EditCabinet />
              }
            />
            <Route
              path="/user/profile"
              element={
                  <Profile />
              }
            />
            <Route path="/user/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
