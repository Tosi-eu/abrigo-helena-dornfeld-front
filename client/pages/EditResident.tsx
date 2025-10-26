import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { patients } from "../../mocks/patients";
import { toast } from "@/hooks/use-toast";

export default function EditResident() {
  const location = useLocation();
  const item = location.state?.item;

  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", casela: "" });

  useEffect(() => {
    if (item) {
      setSelectedResident(item);
      setFormData({
        name: item.name || "",
        casela: item.casela?.toString() || "",
      });
    }
  }, [item]);

  const handleSelectChange = (value: string) => {
    const resident = patients.find(
      (r) => r.name === value || r.casela.toString() === value,
    );
    if (resident) {
      setSelectedResident(resident);
      setFormData({
        name: resident.name,
        casela: resident.casela.toString(),
      });
    } else {
      setSelectedResident(null);
      setFormData({ name: value, casela: "" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.casela) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos antes de salvar.",
        variant: "warning",
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: `Residente ${formData.name} atualizado com sucesso!`,
      variant: "success",
    });
  };

  return (
    <Layout title="Editar Residente">
      <div className="max-w-lg mx-auto mt-10 bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Edição de Residente
        </h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Selecionar Residente
          </label>
          <select
            value={selectedResident?.casela || ""}
            onChange={(e) => handleSelectChange(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white text-slate-800 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-sky-300 hover:border-slate-400"
          >
            <option value="">Escolha</option>
            {patients.map((c) => (
              <option key={c.casela} value={c.casela}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {formData.name && (
          <div className="space-y-5 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Casela
              </label>
              <input
                type="text"
                name="casela"
                value={formData.casela}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedResident(null);
                  setFormData({ name: "", casela: "" });
                }}
                className="px-5 py-2 border border-slate-400 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 transition"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
