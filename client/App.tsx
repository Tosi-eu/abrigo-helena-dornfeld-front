import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SignUpMedicine from "./pages/RegisterMedicine";
import Transactions from "./pages/Transactions";
import Stock from "./pages/Stock";
import StockEntry from "./pages/StockIn";
import Resident from "./pages/Residents";
import NotFound from "./pages/NotFound";
import RegisterResident from "./pages/RegisterResident";
import DeleteResident from "./pages/DeleteResident";
import EditResident from "./pages/EditResident";
import StockOut from "./pages/StockOut";
import EditMedicine from "./pages/EditMedicine";
import DeleteMedicine from "./pages/DeleteMedicine";
import Equipments from "./pages/Inputs";
import EditEquipment from "./pages/EditEquipment";
import DeleteEquipment from "./pages/DeleteEquipment";
import Medicines from "./pages/Medicines";
import Cabinets from "./pages/Cabinets";
import RegisterCabinet from "./pages/RegisterCabinet";
import EditCabinet from "./pages/EditCabinet";
import DeleteCabinet from "./pages/DeleteCabinet";
import RegisterEquipment from "./pages/RegisterEquipment";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/medicines/register" element={<SignUpMedicine />} />
          <Route path="/medicines/edit" element={<EditMedicine />} />
          <Route path="/medicines/delete" element={<DeleteMedicine />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/stock/in" element={<StockEntry />} />
          <Route path="/stock/out" element={<StockOut />} />
          <Route path="/residents" element={<Resident />} />
          <Route path="/residents/register" element={<RegisterResident />} />
          <Route path="/residents/edit" element={<EditResident />} />
          <Route path="/residents/delete" element={<DeleteResident />} />
          <Route path="/inputs" element={<Equipments />} />
          <Route path="/inputs/register" element={<RegisterEquipment />} />
          <Route path="/inputs/edit" element={<EditEquipment />} />
          <Route path="/inputs/delete" element={<DeleteEquipment />} />
          <Route path="/cabinets" element={<Cabinets />} />
          <Route path="/cabinets/register" element={<RegisterCabinet />} />
          <Route path="/cabinets/edit" element={<EditCabinet />} />
          <Route path="/cabinets/delete" element={<DeleteCabinet />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
