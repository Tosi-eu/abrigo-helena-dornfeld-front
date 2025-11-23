import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { MedicineForm } from "@/components/MedicineForm";
import { InputForm } from "@/components/EquipmentForm";
import { OperationType, StockType } from "@/enums/enums";
import { toast } from "@/hooks/use-toast";
import { Input, Medicine, Patient, Cabinet } from "@/interfaces/interfaces";
import LoadingModal from "@/components/LoadingModal";
import { useAuth } from "@/hooks/use-auth";

export default function StockIn() {
  const [operationType, setOperationType] = useState<
    OperationType | "Selecione"
  >("Selecione");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [inputs, setInputs] = useState<Input[]>([]);
  const [caselas, setCaselas] = useState<Patient[]>([]);
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { user } = useAuth();

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/medicamentos");
        const data: Medicine[] = await res.json();
        if (Array.isArray(data)) setMedicines(data);
      } catch (err) {
        console.error("Erro ao buscar medicines:", err);
      }
    };

    const fetchInputs = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/insumos");
        const data: Input[] = await res.json();
        if (Array.isArray(data)) setInputs(data);
      } catch (err) {
        console.error("Erro ao buscar inputs:", err);
      }
    };

    const fetchCaselas = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/residentes");
        const data: any[] = await res.json();
        if (Array.isArray(data)) {
          setCaselas(
            data.map((p) => ({
              casela: p.casela,
              name: p.name,
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
        const data: any[] = await res.json();
        if (Array.isArray(data)) {
          setCabinets(
            data.map((a) => ({
              id: a.numero,
              category: `Armário ${a.numero}`,
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

  const handleMedicineSubmit = async (data: {
    id: number;
    quantity: number;
    cabinet: number;
    casela?: number;
    expirationDate: Date;
    origin?: string;
    stockType: { geral: boolean };
  }) => {
    try {
      const payload = {
        tipo: "medicamento",
        medicamento_id: data.id,
        quantidade: data.quantity,
        armario_id: data.cabinet,
        casela_id: data.casela ?? null,
        validade: data.expirationDate ?? null,
        origem: data.origin ?? null,
        tipo_medicamento: data.stockType.geral ? "geral" : "individual",
      };

      const res = await fetch("http://localhost:3001/api/estoque/entrada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao registrar entrada");

      await fetch("http://localhost:3001/api/movimentacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "entrada",
          login_id: user?.id,
          medicamento_id: data.id,
          armario_id: data.cabinet,
          casela_id: data.casela ?? null,
          quantidade: data.quantity,
          validade_medicamento: data.expirationDate ?? null,
        }),
      });

      toast({
        title: "Entrada registrada com sucesso!",
        description: `Medicamento adicionado ao estoque.`,
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

  const handleInputSubmit = async (data: {
    inputId: number;
    cabinetId: number;
    caselaId?: number;
    quantity: number;
  }) => {
    try {
      const payload = {
        insumo_id: data.inputId,
        quantidade: data.quantity,
        armario_id: data.cabinetId,
        tipo: "insumo",
      };

      console.log(JSON.stringify(payload));

      const res = await fetch("http://localhost:3001/api/estoque/entrada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Erro ao registrar entrada ${res.status}`);

      await fetch("http://localhost:3001/api/movimentacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "entrada",
          login_id: user?.id,
          insumo_id: data.inputId,
          armario_id: data.cabinetId,
          quantidade: data.quantity,
        }),
      });

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

  const canonicalMedicines: Medicine[] = medicines.map((m: any) => ({
    id: m.id,
    name: m.nome,
    dosage: m.dosagem,
    measurementUnit: m.unidade_medida,
    substance: m.principio_ativo,
    minimumStock: m.estoque_minimo,
  }));

  const canonicalInputs: Input[] = inputs.map((i: any) => ({
    id: i.id,
    name: i.nome,
    description: i.descricao,
  }));

  return (
    <Layout title="Entrada de Estoque">
      <LoadingModal
        open={loading}
        title="Aguarde"
        description="Carregando dados..."
      />

      {!loading && (
        <div className="max-w-lg mx-auto mt-10 bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Registrar Entrada
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tipo de entrada
            </label>
            <select
              value={operationType === "Selecione" ? "" : operationType}
              onChange={(e) =>
                setOperationType(e.target.value as OperationType)
              }
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 hover:border-slate-400"
            >
              <option value="" disabled hidden>
                Selecione
              </option>

              <option value={OperationType.MEDICINE}>
                {OperationType.MEDICINE}
              </option>
              <option value={OperationType.INPUT}>{OperationType.INPUT}</option>
            </select>
          </div>

          {operationType === OperationType.MEDICINE && (
            <MedicineForm
              medicines={canonicalMedicines}
              caselas={caselas}
              cabinets={cabinets}
              onSubmit={handleMedicineSubmit}
            />
          )}

          {operationType === OperationType.INPUT && (
            <InputForm
              inputs={canonicalInputs}
              cabinets={cabinets}
              onSubmit={handleInputSubmit}
            />
          )}
        </div>
      )}
    </Layout>
  );
}
