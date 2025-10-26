import Layout from "@/components/Layout";
import EditableTable from "@/components/EditableTable";
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { StockType } from "@/enums/enums";
import { medicines } from "../../mocks/medicines";
import { cabinets } from "../../mocks/cabinets";
import { inputs } from "../../mocks/inputs";
import { medicineInventory, inputInventory } from "../../mocks/stock";
import { StockItem } from "@/interfaces/interfaces";

export default function Stock() {
  const navigate = useNavigate();
  const location = useLocation();
  const filterType = (location.state as any)?.filterType;

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    name: "",
    description: "",
    expiry: "",
    quantity: "",
    patient: "",
    cabinet: "",
    casela: "",
    stockType: "",
    origin: ""
  });

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
        stockType:
          inv.stockType === "individual" ? StockType.INDIVIDUAL : StockType.GERAL,
        origin: inv.origin
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

  const items = useMemo(
    () => [...meds, ...medsWithoutStock, ...eqs],
    [meds, medsWithoutStock, eqs],
  );

  useEffect(() => {
    switch (filterType) {
      case "expired":
        setFilters((prev) => ({ ...prev, expiry: "expired" }));
        break;
      case "belowMin":
        setFilters((prev) => ({ ...prev, expiry: "belowMin" }));
        break;
      case "expiringSoon":
        setFilters((prev) => ({ ...prev, expiry: "expiringSoon" }));
        break;
      case "noStock":
        setFilters((prev) => ({ ...prev, quantity: "0" }));
        break;
    }
  }, [filterType]);

  const filteredStock = useMemo(() => {
    let filtered = [...items];
    const today = new Date();

    if (filters.expiry === "expired") {
      filtered = filtered.filter(
        (item) =>
          item.type === "Medicamento" &&
          item.expiry !== "-" &&
          new Date(item.expiry) < today,
      );
    } else if (filters.expiry === "belowMin") {
      filtered = filtered.filter(
        (item) =>
          item.type === "Medicamento" &&
          item.quantity > 0 &&
          item.minimumStock !== undefined &&
          item.quantity <= item.minimumStock,
      );
    } else if (filters.expiry === "expiringSoon") {
      const limitDate = new Date();
      limitDate.setDate(today.getDate() + 60);
      filtered = filtered.filter(
        (item) =>
          item.type === "Medicamento" &&
          item.expiry !== "-" &&
          new Date(item.expiry) >= today &&
          new Date(item.expiry) <= limitDate,
      );
    }

    if (filters.quantity === "0") {
      filtered = filtered.filter(
        (item) => item.type === "Medicamento" && item.quantity === 0,
      );
    }

    const term = search.toLowerCase();
    if (search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(term),
      );
    }

    for (const key in filters) {
      const val = (filters as any)[key];
      if (val && !["expired", "belowMin", "expiringSoon", "0"].includes(val)) {
        filtered = filtered.filter((item) =>
          String(item[key as keyof StockItem] || "")
            .toLowerCase()
            .includes(String(val).toLowerCase()),
        );
      }
    }

    return filtered;
  }, [items, search, filters]);

  const columns = [
    { key: "stockType", label: "Tipo de Estoque", editable: false },
    { key: "type", label: "Tipo", editable: false },
    { key: "name", label: "Nome", editable: true },
    {
      key: "description",
      label: "Descrição / Princípio Ativo",
      editable: true,
    },
    { key: "expiry", label: "Validade", editable: true },
    { key: "quantity", label: "Quantidade", editable: true },
    { key: "patient", label: "Residente", editable: false },
    { key: "cabinet", label: "Armário", editable: false },
    { key: "casela", label: "Casela", editable: false },
    { key: "origin", label: "Origem", editable: false },
  ];
  return (
    <Layout title="Estoque de Medicamentos e Insumos">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <button className="px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition">
            Gerar Relatório
          </button>
        </div>

        <h2 className="text-lg font-semibold mt-6">Estoque Geral</h2>
        <EditableTable
          data={filteredStock}
          columns={columns}
          onEdit={(row, i) => console.log("Editado:", row, "linha", i)}
          onDelete={(i) => console.log("Excluído linha:", i)}
          onAdd={(row) => console.log("Nova linha:", row)}
        />
      </div>
    </Layout>
  );
}
