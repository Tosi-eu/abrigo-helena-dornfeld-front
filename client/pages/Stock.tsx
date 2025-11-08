import Layout from "@/components/Layout";
import EditableTable from "@/components/EditableTable";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { StockType } from "@/enums/enums";
import { StockItem } from "@/interfaces/interfaces";
import ReportModal from "@/components/ReportModal";

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
    origin: "",
  });

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStock() {
      try {
        const res = await fetch("http://localhost:3001/api/estoque");
        const data = await res.json();

        console.log(data)

        const medicamentos: StockItem[] = data.medicamentos.map((m: any) => ({
          type: "Medicamento",
          name: m.nome_medicamento,
          description: m.principio_ativo,
          expiry: m.validade,
          quantity: m.quantidade,
          cabinet: m.armario_id,
          casela: m.casela_id,
          stockType: StockType.GERAL,
          patient: m.paciente,
          origin: m.origem,
        }));

        const insumos: StockItem[] = data.insumos.map((i: any) => ({
          type: "Insumo",
          name: i.nome_insumo,
          description: i.descricao,
          expiry: "-",
          quantity: i.quantidade,
          cabinet: i.armario_id,
          casela: "-",
          stockType: StockType.GERAL,
          patient: "-",
          origin: "-",
        }));

        setItems([...medicamentos, ...insumos]);
      } catch (err) {
        console.error("Erro ao buscar estoque:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStock();
  }, []);

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
          <button
            onClick={() => navigate("/stock/in")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Entrada de Estoque
          </button>

          <button
            onClick={() => navigate("/stock/out")}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Saída de Estoque
          </button>

          <button
            onClick={() => setReportModalOpen(true)}
            className="px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition"
          >
            Gerar Relatório
          </button>
        </div>

        {loading ? (
          <p className="text-center text-slate-500 mt-6">Carregando...</p>
        ) : (
          <>
            <h2 className="text-lg font-semibold mt-6">Estoque Geral</h2>
            <EditableTable
              data={filteredStock}
              columns={columns}
              onEdit={(row, i) => console.log("Editado:", row, "linha", i)}
              onDelete={(i) => console.log("Excluído linha:", i)}
              onAdd={(row) => console.log("Nova linha:", row)}
            />
          </>
        )}
      </div>

      <ReportModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </Layout>
  );
}
