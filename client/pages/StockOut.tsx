import { useEffect, useState, useMemo } from "react";
import Layout from "@/components/Layout";
import LoadingModal from "@/components/LoadingModal";
import { toast } from "@/hooks/use-toast.hook";
import { useNavigate } from "react-router-dom";
import {
  createMedicineStockOut,
  createStockOutInsumo,
  getStock,
} from "@/api/requests";
import { AnimatePresence, motion } from "framer-motion";
import { OperationType, OriginType, StockWizardSteps } from "@/enums/enums";
import QuantityStep from "@/components/QuantityStep";
import StepItems from "@/components/StepItems";
import Pagination from "./Pagination";
import StepType from "@/components/StepType";
import { StockInput, StockItemRaw, StockMedicine } from "@/interfaces/interfaces";

export default function StockOut() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [allItems, setAllItems] = useState<StockItemRaw[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;

  const [filters, setFilters] = useState({
    nome: "",
    armario: "",
    origem: "",
  });

  const [step, setStep] = useState<StockWizardSteps>(StockWizardSteps.TIPO);
  const [operationType, setOperationType] =
    useState<OperationType | "Selecione">("Selecione");
  const [selected, setSelected] = useState<StockItemRaw | null>(null);
  const [quantity, setQuantity] = useState("");

  async function fetchAllStock() {
    setLoading(true);
    try {
      const [medRes, insRes] = await Promise.all([
        getStock("medicamento"),
        getStock("insumo"),
      ]);

      const meds: StockMedicine[] = (medRes ?? []).map((m: any) => ({
        estoque_id: m.id,
        medicamento_id: m.medicamento_id,
        nome: m.medicamento.nome,
        principio_ativo: m.medicamento.principio_ativo,
        unidade_medida: m.medicamento.unidade_medida,
        validade: m.validade,
        quantidade: m.quantidade,
        origem: m.origem,
        tipo: m.tipo,
        paciente: m.residente?.nome ?? null,
        armario_id: m.armario_id,
        casela_id: m.casela_id,
        tipo_item: "medicamento",
      }));

      const insumos: StockInput[] = (insRes ?? []).map((i: any) => ({
        estoque_id: i.id,
        insumo_id: i.insumo_id,
        nome: i.insumo.nome,
        quantidade: i.quantidade,
        armario_id: i.armario_id,
        tipo_item: "insumo",
      }));

      const combined = [...meds, ...insumos];

      setAllItems(combined);
      setTotalPages(Math.ceil(combined.length / pageSize));
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro ao carregar estoque",
        description: "Não foi possível carregar os dados.",
        variant: "error",
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAllStock();
  }, []);

  const items = useMemo(() => {
    const start = (page - 1) * pageSize;

    let filtered = allItems;

    if (operationType !== "Selecione") {
      filtered = filtered.filter(
        (i) =>
          (operationType === OperationType.MEDICINE && "medicamento_id" in i) ||
          (operationType === OperationType.INPUT && "insumo_id" in i)
      );
    }

    if (filters.nome) {
      filtered = filtered.filter((i) =>
        i.nome.toLowerCase().includes(filters.nome.toLowerCase())
      );
    }

    if (filters.armario) {
      filtered = filtered.filter(
        (i) =>
          i.armario_id !== null &&
          i.armario_id.toString().includes(filters.armario)
      );
    }

    if (filters.origem) {
      filtered = filtered.filter(
        (i: any) =>
          "origem" in i &&
          i.origem?.toLowerCase().includes(filters.origem.toLowerCase())
      );
    }

    setTotalPages(Math.ceil(filtered.length / pageSize));
    return filtered.slice(start, start + pageSize);
  }, [allItems, page, filters, operationType]);

  const handleSelectType = (type: OperationType) => {
    setOperationType(type);
    setSelected(null);
    setPage(1);
    setStep(StockWizardSteps.ITENS);
  };

  const handleSelectItem = (item: StockItemRaw | null) => {
    setSelected(item);
    if (item) setStep(StockWizardSteps.QUANTIDADE);
  };

  const handleConfirm = async () => {
    if (!selected) return;
    const qty = Number(quantity);
    if (!qty || qty <= 0) return;

    try {
      if ("medicamento_id" in selected) {

        await createMedicineStockOut({
          estoque_id: selected.estoque_id,
          armario_id: selected.armario_id,
          quantidade: qty,
        });
      } else {
        await createStockOutInsumo({
          insumo_id: selected.insumo_id,
          quantidade: qty,
          armario_id: selected.armario_id,
        });
      }

      toast({
        title: "Saída registrada!",
        description: "Item removido do estoque.",
        variant: "success",
      });
      navigate("/stock");
    } catch (err: any) {
      toast({
        title: "Erro ao registrar saída",
        description: err.message || "Erro inesperado.",
        variant: "error",
      });
    }
  };

  const handleBack = () => {
    if (step === StockWizardSteps.ITENS) setStep(StockWizardSteps.TIPO);
    else if (step === StockWizardSteps.QUANTIDADE) setStep(StockWizardSteps.ITENS);
  };

  const handleNext = () => {
    if (step === StockWizardSteps.TIPO && operationType !== "Selecione")
      setStep(StockWizardSteps.ITENS);
    else if (step === StockWizardSteps.ITENS && selected)
      setStep(StockWizardSteps.QUANTIDADE);
  };

  return (
    <Layout title="Saída de Estoque">
      <LoadingModal open={loading} title="Aguarde" description="Carregando dados..." />

      <div className="bg-white p-6 rounded-lg border border-gray-300 max-w-7xl mx-auto mt-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-lg"
              value={filters.nome}
              onChange={(e) => setFilters({ ...filters, nome: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-700 mb-1">Armário</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-lg"
              value={filters.armario}
              onChange={(e) => setFilters({ ...filters, armario: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-700 mb-1">Origem</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-lg"
              value={filters.origem}
              onChange={(e) => setFilters({ ...filters, origem: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden max-w-7xl mx-auto bg-white border border-slate-400 rounded-xl p-10 px-16 shadow-sm mt-10">
        {step !== StockWizardSteps.TIPO && (
          <button
            onClick={handleBack}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full border bg-white shadow"
          >
            ←
          </button>
        )}
        {step !== StockWizardSteps.QUANTIDADE && (
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full border bg-white shadow"
          >
            →
          </button>
        )}

        <div className="min-h-[380px] flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {step === StockWizardSteps.TIPO && (
              <motion.div
                key="tipo"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="w-full max-w-md"
              >
                <StepType value={operationType} onSelect={handleSelectType} />
              </motion.div>
            )}

            {step === StockWizardSteps.ITENS && (
              <motion.div
                key="itens"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="w-full"
              >
                <StepItems
                  items={items}
                  allItemsCount={allItems.length}
                  page={page}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  selected={selected}
                  onSelectItem={handleSelectItem}
                  onBack={() => setStep(StockWizardSteps.TIPO)}
                  setPage={setPage}
                />
              </motion.div>
            )}

            {step === StockWizardSteps.QUANTIDADE && (
              <motion.div
                key="quantidade"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="w-full max-w-6xl"
              >
                <QuantityStep
                  item={selected}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  onBack={() => setStep(StockWizardSteps.ITENS)}
                  onConfirm={handleConfirm}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step === StockWizardSteps.ITENS && (
          <div className="mt-8 flex justify-center">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>
    </Layout>
  );
}
