import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import EditableTable from "@/components/EditableTable";
import { StockType } from "@/enums/enums";
import { medicines } from "../../mocks/medicines";
import { cabinets } from "../../mocks/cabinets";
import { inputs } from "../../mocks/inputs";
import { medicineInventory, inputInventory } from "../../mocks/stock";
import { StockItem } from "@/interfaces/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Stethoscope, Check, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReportModal from "@/components/ReportModal";

export default function Stock() {
  const [openReport, setOpenReport] = useState(false);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [selectedCabinet, setSelectedCabinet] = useState(cabinets[0].id);

  const reportOptions = [
    { value: "insumos", label: "Insumos", icon: Package },
    { value: "medicamentos", label: "Medicamentos", icon: Stethoscope },
    { value: "insumos_medicamentos", label: "Insumos e Medicamentos", icon: Check },
  ];

  const handleSelectReport = (value: string) => {
    setSelectedReports([value]);
  };

  const handleGenerate = () => {
    if (!selectedReports.length) return;
    setStatus("loading");

    setTimeout(() => {
      const isSuccess = Math.random() > 0.2;
      setStatus(isSuccess ? "success" : "error");
    }, 1500);
  };

  const handleClose = () => {
    setStatus("idle");
    setSelectedReports([]);
    setOpenReport(false);
  };

  // ---------------- Estoque ----------------
  const meds: StockItem[] = useMemo(() => {
    return medicineInventory.flatMap((inv) => {
      const med = medicines.find((m) => m.id === inv.medicineId);
      const cabinet = cabinets.find((c) => c.id === inv.cabinetId);
      return {
        type: "Medicamento",
        name: med?.name || "-",
        description: med?.substance || "-",
        expiry: inv.expiry,
        quantity: inv.quantity,
        minimumStock: med?.minimumStock,
        patient: inv.residentId ? `Residente ${inv.residentId}` : "-",
        cabinet: cabinet?.id || "-",
        casela: inv.residentId || "-",
        stockType: inv.stockType === "individual" ? StockType.INDIVIDUAL : StockType.GERAL,
        origin: inv.origin,
      };
    });
  }, []);

  const medsWithoutStock: StockItem[] = useMemo(() => {
    return medicines
      .filter((m) => !medicineInventory.some((inv) => inv.medicineId === m.id))
      .map((med) => ({
        type: "Medicamento",
        name: med.name,
        description: med.substance,
        expiry: "-",
        quantity: 0,
        minimumStock: med.minimumStock,
        patient: "-",
        cabinet: "-",
        casela: "-",
        stockType: StockType.GERAL,
      }));
  }, []);

  const eqs: StockItem[] = useMemo(() => {
    return inputInventory.map((entry) => {
      const eq = inputs.find((e) => e.id === entry.inputId);
      const cabinet = cabinets.find((c) => c.id === entry.cabinetId);
      return {
        type: "Insumo",
        name: eq?.name || "-",
        description: eq?.description || "-",
        expiry: "-",
        quantity: entry.quantity,
        stockType: StockType.GERAL,
        patient: "-",
        cabinet: cabinet?.id || "-",
        casela: "-",
      };
    });
  }, []);

  const items = useMemo(() => [...meds, ...medsWithoutStock, ...eqs], [meds, medsWithoutStock, eqs]);

  const columns = [
    { key: "stockType", label: "Tipo de Estoque", editable: false },
    { key: "type", label: "Tipo", editable: false },
    { key: "name", label: "Nome", editable: true },
    { key: "description", label: "Descrição / Princípio Ativo", editable: true },
    { key: "expiry", label: "Validade", editable: true },
    { key: "quantity", label: "Quantidade", editable: true },
    { key: "patient", label: "Residente", editable: false },
    { key: "cabinet", label: "Armário", editable: false },
    { key: "casela", label: "Casela", editable: false },
    { key: "origin", label: "Origem", editable: false },
  ];

  const cabinetStock = useMemo(() => {
    return [
      ...medicineInventory
        .filter((inv) => inv.cabinetId === selectedCabinet)
        .map((inv) => {
          const med = medicines.find((m) => m.id === inv.medicineId);
          return {
            cabinet: inv.cabinetId,
            type: "Medicamento",
            name: med?.name || "-",
            description: med?.substance || "-",
            quantity: inv.quantity,
            expiry: inv.expiry,
          };
        }),
      ...inputInventory
        .filter((inv) => inv.cabinetId === selectedCabinet)
        .map((inv) => {
          const inp = inputs.find((i) => i.id === inv.inputId);
          return {
            cabinet: inv.cabinetId,
            type: "Insumo",
            name: inp?.name || "-",
            description: inp?.description || "-",
            quantity: inv.quantity,
            expiry: "-",
          };
        }),
    ];
  }, [selectedCabinet]);

  const cabinetColumns = [
    { key: "cabinet", label: "Armário", editable: false },
    { key: "type", label: "Tipo", editable: false },
    { key: "name", label: "Nome", editable: false },
    { key: "description", label: "Descrição", editable: false },
    { key: "quantity", label: "Quantidade", editable: true },
    { key: "expiry", label: "Validade", editable: true },
  ];

  return (
    <Layout title="Estoque de Medicamentos e Insumos">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <Button
            className="px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition"
            onClick={() => setOpenReport(true)}
          >
            Gerar Relatório
          </Button>
        </div>

        <ReportModal open={openReport} onClose={() => setOpenReport(false)} />

        <h2 className="text-lg font-semibold mt-6">Estoque Geral</h2>
        <EditableTable data={items} columns={columns} onEdit={(row, i) => console.log("Editado:", row, "linha", i)} onDelete={(i) => console.log("Excluído linha:", i)} onAdd={(row) => console.log("Nova linha:", row)} />

        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4">Estoque dos Armários</h2>
          <select className="border rounded p-2 mb-4 bg-white" value={selectedCabinet} onChange={(e) => setSelectedCabinet(Number(e.target.value))}>
            {cabinets.map((c) => (
              <option key={c.id} value={c.id}>
                Armário {c.id}
              </option>
            ))}
          </select>

          <EditableTable data={cabinetStock} columns={cabinetColumns} onEdit={(row, i) => console.log("Editado no armário:", row, "linha", i)} />
        </div>
      </div>
    </Layout>
  );
}
