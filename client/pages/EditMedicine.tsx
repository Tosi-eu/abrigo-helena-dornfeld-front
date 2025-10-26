import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { medicines } from "../../mocks/medicines";

export default function EditMedicine() {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedMedicine, setSelectedMedicine] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    substance: "",
    dosage: "",
    measuremeUnit: "",
    minimumStock: 0,
  });

  useEffect(() => {
    if (location.state?.item) {
      const item = location.state.item;
      const { dosageNumber, dosageUnit } = parseDosage(
        item.dosage || item.dose || "",
      );

      const normalized = {
        name: item.name || item.itemName || "",
        substance: item.substance || item.active || "",
        dosage: dosageNumber,
        measuremeUnit: dosageUnit || item.measurementUnit || item.unit || "",
        minimumStock: item.minimumStock || 0,
      };

      setSelectedMedicine(normalized.name);
      setFormData(normalized);
    }
  }, [location.state]);

  useEffect(() => {
    if (selectedMedicine) {
      const med = medicines.find((m) => m.name === selectedMedicine);
      if (med) {
        const { dosageNumber, dosageUnit } = parseDosage(med.dosage || "");
        setFormData({
          name: med.name,
          substance: med.substance,
          dosage: dosageNumber,
          measuremeUnit: dosageUnit || med.measuremeUnit,
          minimumStock: med.minimumStock,
        });
      }
    } else {
      setFormData({
        name: "",
        substance: "",
        dosage: "",
        measuremeUnit: "",
        minimumStock: 0,
      });
    }
  }, [selectedMedicine]);

  const parseDosage = (value: string) => {
    const match = value.trim().match(/^(\d+(?:[.,]\d+)?)([a-zA-Zμµ]*)$/);
    if (match) {
      return {
        dosageNumber: match[1],
        dosageUnit: match[2] || "",
      };
    }
    return { dosageNumber: value, dosageUnit: "" };
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMedicineSelect = (value: string) => {
    const med = medicines.find((m) => m.name === value);
    if (med) {
      setSelectedMedicine(med.name);
      setFormData(med);
    } else {
      setSelectedMedicine(value);
      setFormData({ ...formData, name: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast({
        title: "Seleção obrigatória",
        description: "Escolha ou digite um medicamento.",
        variant: "warning",
      });
      return;
    }

    toast({
      title: "Medicamento atualizado",
      description: `${formData.name} foi atualizado com sucesso.`,
      variant: "success",
    });

    navigate("/transactions");
  };

  return (
    <Layout title="Edição de Medicamento">
      <div className="max-w-lg mx-auto mt-10 bg-white border border-slate-200 rounded-xl p-8 shadow-sm font-[Inter]">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Editar Medicamento
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nome do medicamento
            </label>
            <select
              value={selectedMedicine}
              onChange={(e) => setSelectedMedicine(e.target.value)}
              className="w-full border bg-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
            >
              <option value="">Escolha</option>
              {medicines.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Princípio Ativo
            </label>
            <input
              type="text"
              value={formData.substance}
              onChange={(e) => handleChange("substance", e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Dosagem
              </label>
              <input
                type="number"
                value={formData.dosage}
                onChange={(e) => handleChange("dosage", e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Unidade de medida
              </label>
              <select
                value={formData.measuremeUnit}
                onChange={(e) =>
                  handleChange("measurementUnit", e.target.value)
                }
                className="w-full border bg-white border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
              >
                <option value="">Selecione</option>
                <option value="mg">mg</option>
                <option value="g">g</option>
                <option value="mcg">mcg</option>
                <option value="ml">ml</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Estoque mínimo
            </label>
            <input
              type="number"
              value={formData.minimumStock}
              onChange={(e) =>
                handleChange("minimumStock", Number(e.target.value))
              }
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate("/transactions")}
              className="px-5 py-2 border border-slate-400 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 transition"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
