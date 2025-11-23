import Layout from "@/components/Layout";
import EditableTable from "@/components/EditableTable";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { StockItem } from "@/interfaces/interfaces";
import ReportModal from "@/components/ReportModal";
import LoadingModal from "@/components/LoadingModal";

export default function Stock() {
  const navigate = useNavigate();
  const location = useLocation();
  const { filter, data } = location.state || {};

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    expiry: "",
    quantity: "",
  });

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  const formatStockItems = (raw: any[]): StockItem[] => {
    return raw.map((item) => ({
      name: item.nome || "-",
      description: item.principio_ativo || item.descricao || "-",
      expiry: item.validade || "-",
      quantity: Number(item.quantidade) || 0,
      cabinet: item.armario_id ?? "-",
      casela: item.casela_id ?? "-",
      stockType: item.tipo || "-",
      patient: item.paciente || "-",
      origin: item.origem || "-",
      minimumStock: item.minimo || 0,
    }));
  };

  useEffect(() => {
    async function loadStock() {
      try {
        setLoading(true);

        let stockData: any[] = [];

        if (data && Array.isArray(data)) {
          stockData = data;
        } else {
          stockData = await fetch("http://localhost:3001/api/estoque").then(
            (res) => res.json(),
          );
        }

        setItems(formatStockItems(stockData));
      } catch (err) {
        console.error("Erro ao buscar estoque:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStock();
  }, [data]);

  useEffect(() => {
    if (!filter) return;

    switch (filter) {
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
  }, [filter]);

  const filteredStock = useMemo(() => {
    let filtered = [...items];
    const term = search.toLowerCase();

    if (search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(term),
      );
    }

    if (filters.expiry) {
      const today = new Date();
      if (filters.expiry === "expired") {
        filtered = filtered.filter(
          (item) => item.expiry && new Date(item.expiry) < today,
        );
      } else if (filters.expiry === "expiringSoon") {
        filtered = filtered.filter((item) => {
          if (!item.expiry) return false;
          const diff = new Date(item.expiry).getTime() - today.getTime();
          return diff > 0 && diff <= 60 * 24 * 3600 * 1000;
        });
      } else if (filters.expiry === "belowMin") {
        filtered = filtered.filter(
          (item) => item.quantity <= item.minimumStock,
        );
      }
    }

    if (filters.quantity === "0") {
      filtered = filtered.filter((item) => item.quantity === 0);
    }

    return filtered;
  }, [items, search, filters]);

  const columns = [
    { key: "stockType", label: "Tipo de Estoque", editable: false },
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
      <LoadingModal
        open={loading}
        title="Aguarde"
        description="Carregando estoque..."
      />

      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/stock/in")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            disabled={loading}
          >
            Entrada de Estoque
          </button>

          <button
            onClick={() => navigate("/stock/out")}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            disabled={loading}
          >
            Saída de Estoque
          </button>

          <button
            onClick={() => setReportModalOpen(true)}
            className="px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition"
            disabled={loading}
          >
            Gerar Relatório
          </button>
        </div>

        {!loading && (
          <>
            <h2 className="text-lg font-semibold mt-6">Estoque Geral</h2>
            <EditableTable
              data={filteredStock}
              columns={columns}
              showAddons={false}
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
