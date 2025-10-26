import Layout from "@/components/Layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { medicines } from "../../mocks/medicines";

export default function SignUpMedicine() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    substance: "",
    dosageValue: "",
    measuremeUnit: "",
    minimumStock: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { name, substance, dosageValue, measuremeUnit, minimumStock } =
      formData;

    if (
      !name ||
      !substance ||
      !dosageValue ||
      !measuremeUnit ||
      !minimumStock
    ) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos antes de continuar.",
        variant: "warning",
      });
      return;
    }

    toast({
      title: "Medicamento cadastrado!",
      description: `${name} (${dosageValue}${measuremeUnit}) foi registrado com sucesso.`,
      variant: "success",
    });

    navigate("/transactions");
  };

  const clearForm = () => {
    setFormData({
      name: "",
      substance: "",
      dosageValue: "",
      measuremeUnit: "",
      minimumStock: "",
    });
  };

  const handleMedicineSelect = (value: string) => {
    if (value.trim() === "") {
      clearForm();
      return;
    }

    const selected = medicines.find((m) => m.name === value);
    if (selected) {
      const match = selected.dosage.match(/^(\d+(?:,\d+)?)([a-zA-Z]+)$/);
      const dosageValue = match ? match[1] : "";
      const measuremeUnit = match ? match[2] : "";

      setFormData({
        name: selected.name,
        substance: selected.substance,
        dosageValue,
        measuremeUnit,
        minimumStock: selected.minimumStock.toString(),
      });
    } else {
      setFormData({ ...formData, name: value });
    }
  };

  return (
    <Layout title="Cadastro de Medicamento">
      <div className="max-w-lg mx-auto mt-10 bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-semibold text-slate-800">
          Cadastro de Medicamento
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nome do medicamento
            </label>
            <input
              list="lista-medicamentos"
              value={formData.name}
              onChange={(e) => handleMedicineSelect(e.target.value)}
              placeholder="Selecione ou digite um medicamento"
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 hover:border-slate-400"
            />
            <datalist id="lista-medicamentos">
              {medicines.map((m) => (
                <option key={m.id} value={m.name} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Princípio Ativo
            </label>
            <input
              type="text"
              value={formData.substance}
              onChange={(e) =>
                setFormData({ ...formData, substance: e.target.value })
              }
              placeholder="Paracetamol"
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 hover:border-slate-400"
            />
          </div>

          {/* Dosagem e unidade */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Dosagem
              </label>
              <input
                type="text"
                value={formData.dosageValue}
                onChange={(e) =>
                  setFormData({ ...formData, dosageValue: e.target.value })
                }
                placeholder="500"
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 hover:border-slate-400"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Unidade
              </label>
              <select
                value={formData.measuremeUnit}
                onChange={(e) =>
                  setFormData({ ...formData, measuremeUnit: e.target.value })
                }
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 hover:border-slate-400"
              >
                <option value="">Selecione</option>
                <option value="mg">mg</option>
                <option value="ml">ml</option>
                <option value="g">g</option>
                <option value="mcg">mcg</option>
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
                setFormData({ ...formData, minimumStock: e.target.value })
              }
              placeholder="10"
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 hover:border-slate-400"
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
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
