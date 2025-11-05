import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { MedicineForm } from "@/components/MedicineForm";
import { InputForm } from "@/components/EquipmentForm";
import { OperationType, StockType } from "@/enums/enums";
import { toast } from "@/hooks/use-toast";

export default function StockIn() {
  const [operationType, setOperationType] = useState<
    OperationType | "Selecione"
  >("Selecione");

  const [medicines, setMedicines] = useState<
    { id: string; nome: string; dosagem: string; unidade_medida: string }[]
  >([]);
  const [inputs, setInputs] = useState<
    { id: string; nome: string; categoria: string; unidade: string }[]
  >([]);
  const [caselas, setCaselas] = useState<
    { value: string; label: string; nome: string }[]
  >([]);
  const [cabinets, setCabinets] = useState<{ value: string; label: string }[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/medicines");
        const data = await res.json();
        if (Array.isArray(data)) setMedicines(data);
      } catch (err) {
        console.error("Erro ao buscar medicines:", err);
      }
    };

    const fetchInputs = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/inputs");
        const data = await res.json();
        if (Array.isArray(data)) setInputs(data);
      } catch (err) {
        console.error("Erro ao buscar inputs:", err);
      }
    };

    const fetchCaselas = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/residentes");
        const data = await res.json();
        if (Array.isArray(data)) {
          setCaselas(
            data.map((p: any) => ({
              value: String(p.num_casela),
              label: `Casela ${p.num_casela}`,
              nome: p.nome,
            })),
          );
        }
      } catch (err) {
        console.error("Erro ao buscar caselas:", err);
      }
    };

    const fetchCabinets = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/armarios");
        const data = await res.json();
        if (Array.isArray(data)) {
          setCabinets(
            data.map((a: any) => ({
              value: String(a.num_armario),
              label: `Armário ${a.num_armario}`,
            })),
          );
        }
      } catch (err) {
        console.error("Erro ao buscar armários:", err);
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchMedicines(),
        fetchInputs(),
        fetchCaselas(),
        fetchCabinets(),
      ]);
      setLoading(false);
    };

    fetchAll();
  }, []);

  const handleMedicineSubmit = async (data: any) => {
    try {
      const payload = {
        medicamento_id: Number(data.id),
        quantidade: Number(data.quantity),
        armario_id: Number(data.cabinet),
        casela_id: Number(data.casela),
        validade: data.expirationDate
          ? new Date(data.expirationDate).toISOString()
          : null,
        origem: data.origin,
        tipo: data.stockType.geral ? StockType.GERAL : StockType.INDIVIDUAL,
        tipo_entrada: "medicamento",
      };

      const res = await fetch("http://localhost:3001/api/estoque/entrada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Erro ao registrar entrada");

      toast({
        title: "Entrada registrada com sucesso!",
        description: `Medicamento adicionado ao estoque.`,
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Erro ao registrar entrada",
        description: err.message || "Erro inesperado ao salvar no estoque.",
        variant: "error",
      });
    }
  };

  const handleInputSubmit = async (data: any) => {
    try {
      const payload = {
        insumo_id: Number(data.insumoId),
        quantidade: Number(data.quantity),
        armario_id: Number(data.cabinet),
        tipo_entrada: "insumo",
      };

      const res = await fetch("http://localhost:3001/api/estoque/entrada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Erro ao registrar entrada");

      toast({
        title: "Entrada registrada com sucesso!",
        description: `Insumo adicionado ao estoque.`,
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Erro ao registrar entrada",
        description: err.message || "Erro inesperado ao salvar no estoque.",
        variant: "error",
      });
    }
  };

  if (loading) {
    return (
      <Layout title="Entrada de Estoque">
        <div className="max-w-lg mx-auto mt-10 text-center text-slate-600">
          Carregando dados...
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Entrada de Estoque">
      <div className="max-w-lg mx-auto mt-10 bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-semibold text-slate-800">
          Registrar Entrada
        </h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tipo de entrada
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
          <div>
            <h3 className="text-md font-semibold text-slate-800 mb-3">
              Medicamento
            </h3>
            <MedicineForm
              medicines={medicines}
              caselas={caselas}
              cabinets={cabinets}
              onSubmit={handleMedicineSubmit}
            />
          </div>
        )}

        {operationType === OperationType.INPUT && (
          <div>
            <h3 className="text-md font-semibold text-slate-800 mb-3">
              Insumo
            </h3>
            <InputForm
              inputs={inputs}
              cabinets={cabinets}
              onSubmit={handleInputSubmit}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
