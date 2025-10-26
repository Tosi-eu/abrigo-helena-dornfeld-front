import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { cabinets } from "../../mocks/cabinets";
import { CabinetCategory } from "@/enums/enums";
import { useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function EditCabinet() {
  const location = useLocation();
  const item = location.state?.item;

  const [selectedCabinet, setSelectedCabinet] = useState<any>(null);
  const [formData, setFormData] = useState({
    id: 0,
    category: "",
    description: "",
  });

  useEffect(() => {
    if (item) {
      setSelectedCabinet(item);
      setFormData({
        id: item.id,
        category: item.category,
        description: item.description || "",
      });
    }
  }, [item]);

  const handleSelectChange = (value: string) => {
    const cabinet = cabinets.find((c) => c.id === parseInt(value));
    if (cabinet) {
      setSelectedCabinet(cabinet);
      setFormData({
        id: cabinet.id,
        category: cabinet.category,
        description: cabinet.description || "",
      });
    } else {
      setSelectedCabinet(null);
      setFormData({ id: 0, category: "", description: "" });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!selectedCabinet) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para cadastrar o Insumo.",
        variant: "warning",
      });
      return;
    }

    toast({
      title: "Campos obrigatórios",
      description: `Armário ${formData.id} atualizado com sucesso!`,
      variant: "success",
    });
    return;
  };

  return (
    <Layout title="Editar Armário">
      <div className="max-w-lg mx-auto mt-10 bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Edição de Armário
        </h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Selecionar Armário
          </label>
          <select
            value={selectedCabinet?.id || ""}
            onChange={(e) => handleSelectChange(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white text-slate-800 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-sky-300 hover:border-slate-400"
          >
            <option value="">Escolha</option>
            {cabinets.map((c) => (
              <option key={c.id} value={c.id}>
                Armário {c.id} ({c.category})
              </option>
            ))}
          </select>
        </div>

        {selectedCabinet && (
          <div className="space-y-5 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Número do Armário
              </label>
              <input
                type="number"
                name="id"
                value={formData.id}
                onChange={handleChange}
                className="w-full border bg-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Categoria
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border bg-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
              >
                {Object.entries(CabinetCategory).map(([key, label]) => (
                  <option key={key} value={label}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Descrição
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setSelectedCabinet(null)}
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
