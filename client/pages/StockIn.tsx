import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { MedicineForm } from "@/components/MedicineForm";
import { InputForm } from "@/components/EquipmentForm";
import { OperationType, StockType } from "@/enums/enums";
import { toast } from "@/hooks/use-toast.hook";
import { Input, Medicine, Patient, Cabinet } from "@/interfaces/interfaces";
import LoadingModal from "@/components/LoadingModal";

import {
  createStockInInput,
  createStockInMedicine,
  getCabinets,
  getInputs,
  getMedicines,
  getResidents,
} from "@/api/requests";
import { useNavigate } from "react-router-dom";

export default function StockIn() {
  const [operationType, setOperationType] = useState<OperationType | "Selecione">("Selecione");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [inputs, setInputs] = useState<Input[]>([]);
  const [caselas, setCaselas] = useState<Patient[]>([]);
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [medData, inputData, caselaData, cabinetData] = await Promise.all([
          getMedicines(),
          getInputs(),
          getResidents(),
          getCabinets(),
        ]);

        setMedicines(medData);
        setInputs(inputData);
        setCaselas(caselaData);
        setCabinets(cabinetData);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleMedicineSubmit = async (data) => {
    try {
      const type = data.stockType === StockType.INDIVIDUAL ? StockType.INDIVIDUAL : StockType.GERAL;
      const validity = data.expirationDate

      const payload = {
        medicamento_id: data.id,
        armario_id: data.cabinet,
        quantidade: data.quantity,
        validade: validity,
        origem: data.origin,
        paciente_casela: data.casela,
        tipo: type,
      };

      await createStockInMedicine(payload);

      toast({
        title: "Entrada registrada com sucesso!",
        description: "Medicamento adicionado ao estoque.",
        variant: "success",
      });

      navigate("/stock");
    } catch (err: any) {
      toast({ title: "Erro ao registrar", description: err.message, variant: "error" });
    }
  };

  const handleInputSubmit = async (data) => {
    try {
      const payload = {
        insumo_id: data.inputId,
        quantidade: data.quantity,
        armario_id: data.cabinetId,
        validade: data.validity ?? null,
      };

      await createStockInInput(payload);

      toast({
        title: "Entrada registrada!",
        description: "Insumo adicionado ao estoque.",
        variant: "success",
      });

      navigate("/stock");
    } catch (err: any) {
      toast({
        title: "Erro ao registrar entrada",
        description: err.message,
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
          <h2 className="text-lg font-semibold text-slate-800">Registrar Entrada</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de entrada</label>
            <select
              value={operationType === "Selecione" ? "" : operationType}
              onChange={(e) => setOperationType(e.target.value as OperationType)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 hover:border-slate-400"
            >
              <option value="" disabled hidden>Selecione</option>
              <option value={OperationType.MEDICINE}>{OperationType.MEDICINE}</option>
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
