import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { OperationType } from "@/enums/enums";
import { StockOutForm } from "@/components/StockOutForm";

export default function StockOut() {
  const [operationType, setOperationType] = useState<
    OperationType | "Selecione"
  >("Selecione");

  const [medicamentos, setMedicines] = useState([]);
  const [insumos, setInputs] = useState([]);
  const [armarios, setArmarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/medicamentos");
        const data = await res.json();
        if (Array.isArray(data)) setMedicines(data);
      } catch (err) {
        console.error("Erro ao buscar medicamentos:", err);
      }
    };

    const fetchInputs = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/insumos");
        const data = await res.json();
        if (Array.isArray(data)) setInputs(data);
      } catch (err) {
        console.error("Erro ao buscar insumos:", err);
      }
    };

    const fetchCabinets = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/armarios");
        const data = await res.json();
        if (Array.isArray(data))
          setArmarios(
            data.map((a: any) => ({
              value: String(a.num_armario),
              label: `Armário ${a.num_armario}`,
            })),
          );
      } catch (err) {
        console.error("Erro ao buscar armários:", err);
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchMedicines(), fetchInputs(), fetchCabinets()]);
      setLoading(false);
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <Layout title="Saída de Estoque">
        <div className="max-w-lg mx-auto mt-10 text-center text-slate-600">
          Carregando dados...
        </div>
      </Layout>
    );
  }

  const handleStockOut = async (payload: any, type: OperationType) => {
    try {
      const body = {
        tipo: type === OperationType.MEDICINE ? "medicamento" : "insumo",
        itemId: Number(payload.itemId),
        armarioId: Number(payload.armarioId),
        quantidade: Number(payload.quantity),
      };

      const res = await fetch("http://localhost:3001/api/estoque/saida", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Erro ao registrar saída");

      console.log(payload);

      await fetch("http://localhost:3001/api/movimentacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "saida",
          login_id: 1,
          armario_id: Number(payload.armarioId),
          quantidade: Number(payload.quantity),
          casela_id: Number(payload.caselaId),
          ...(type === OperationType.MEDICINE
            ? {
                medicamento_id: Number(payload.itemId),
                validade_medicamento: payload.expirationDate
                  ? new Date(payload.expirationDate).toISOString()
                  : null,
              }
            : { insumo_id: Number(payload.itemId) }),
        }),
      });

      toast({
        title: "Saída registrada com sucesso!",
        description: `${
          type === OperationType.MEDICINE ? "Medicamento" : "Insumo"
        } removido do estoque.`,
        variant: "success",
      });
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
      <div className="max-w-lg mx-auto mt-10 bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
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
            <option value="Selecione">Selecione...</option>
            <option value={OperationType.MEDICINE}>
              {OperationType.MEDICINE}
            </option>
            <option value={OperationType.INPUT}>{OperationType.INPUT}</option>
          </select>
        </div>

        {operationType === OperationType.MEDICINE && (
          <StockOutForm
            items={medicamentos.map((m) => ({
              id: m.id,
              nome: m.nome,
              detalhes: `${m.dosagem} ${m.unidade_medida}`,
            }))}
            cabinets={armarios}
            onSubmit={(data) => handleStockOut(data, OperationType.MEDICINE)}
          />
        )}

        {operationType === OperationType.INPUT && (
          <StockOutForm
            items={insumos.map((i) => ({ id: i.id, nome: i.nome }))}
            cabinets={armarios}
            onSubmit={(data) => handleStockOut(data, OperationType.INPUT)}
          />
        )}
      </div>
    </Layout>
  );
}
