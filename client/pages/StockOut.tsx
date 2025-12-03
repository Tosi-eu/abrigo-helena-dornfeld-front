import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { OperationType } from "@/enums/enums";
import { StockOutForm } from "@/components/StockOutForm";
import LoadingModal from "@/components/LoadingModal";
import {
  getMedicines,
  getInputs,
  getCabinets,
  getResidents,
  createStockOutInsumo,
} from "@/api/requests";
import { useNavigate } from "react-router-dom";

export default function StockOut() {
  const [operationType, setOperationType] =
    useState<OperationType | "Selecione">("Selecione");

  const [medicines, setMedicines] = useState<any[]>([]);
  const [inputs, setInputs] = useState<any[]>([]);
  const [cabinets, setCabinets] = useState<any[]>([]);
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const [medRes, inpRes, cabRes, resRes] = await Promise.all([
          getMedicines(),
          getInputs(),
          getCabinets(),
          getResidents(),
        ]);

        setMedicines(medRes);
        setInputs(inpRes);
        setResidents(resRes);

        setCabinets(
          cabRes.map((c: any) => ({
            label: c.numero,
            value: c.numero,
          }))
        );
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        toast({
          title: "Erro ao carregar informações",
          description: "Não foi possível carregar medicamentos, insumos ou armários.",
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleStockOut = async (payload: any) => {
    if (!payload) return;

    console.log(payload)
    const tipoItem =
      operationType === OperationType.MEDICINE
        ? "medicamento"
        : "insumo";

    let finalPayload: any;

    if (tipoItem === "insumo") {
      finalPayload = {
        insumo_id: payload.itemId,
        armario_id: payload.armarioId,
        quantidade: payload.quantity,
      };
    } else {
      toast({
        title: "Funcionalidade não disponível",
        description: "Ainda não existe API para saída de medicamentos.",
        variant: "error",
      });
      return;
    }

    try {
      await createStockOutInsumo(finalPayload);

      toast({
        title: "Saída registrada com sucesso!",
        description: `Insumo removido do estoque.`,
        variant: "success",
      });

      navigate("/stock");
    } catch (err: any) {
      toast({
        title: "Erro ao registrar saída",
        description: err.message || "Erro inesperado ao processar a saída.",
        variant: "error",
      });
    }
  };

  return (
    <Layout title="Saída de Estoque">
      <LoadingModal
        open={loading}
        title="Aguarde"
        description="Carregando dados..."
      />

      {!loading && (
        <div className="max-w-5xl mx-auto mt-10 bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Registrar Saída
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tipo de saída
            </label>
            <select
              value={operationType}
              onChange={(e) => setOperationType(e.target.value as OperationType)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 hover:border-slate-400"
            >
              <option value="Selecione">Selecione</option>
              <option value={OperationType.MEDICINE}>{OperationType.MEDICINE}</option>
              <option value={OperationType.INPUT}>{OperationType.INPUT}</option>
            </select>
          </div>

          {operationType === OperationType.MEDICINE && (
            <StockOutForm
              items={medicines}
              cabinets={cabinets}
              residents={residents}
              onSubmit={handleStockOut}
            />
          )}

          {operationType === OperationType.INPUT && (
            <StockOutForm
              items={inputs}
              cabinets={cabinets}
              residents={residents}
              onSubmit={handleStockOut}
            />
          )}
        </div>
      )}
    </Layout>
  );
}