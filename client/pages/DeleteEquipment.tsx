import { useState } from "react";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { inputs } from "../../mocks/inputs";

export default function DeleteEquipment() {
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const navigate = useNavigate();

  const handleDelete = () => {
    if (!selectedEquipment) {
      toast({
        title: "Seleção obrigatória",
        description: "Escolha um equipamento para deletar.",
        variant: "warning",
      });
      return;
    }

    toast({
      title: "Equipamento deletado",
      description: `${selectedEquipment} foi removido do sistema.`,
      variant: "success",
    });

    setSelectedEquipment("");
    navigate("/equipments");
  };

  return (
    <Layout title="Exclusão de Equipamento">
      <div className="max-w-lg mx-auto mt-10 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Deletar Equipamento
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Selecione o equipamento
            </label>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="
                w-full
                border border-slate-300
                rounded-lg
                p-2.5
                text-sm
                bg-white
                text-slate-800
                shadow-sm
                transition
                focus:outline-none
                focus:ring-2
                focus:ring-sky-300
                hover:border-slate-400
              "
            >
              <option value="">Escolha</option>
              {inputs.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate("/equipments")}
              className="px-5 py-2 border border-slate-400 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-100 transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition"
            >
              Deletar
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
