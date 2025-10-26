import { useState } from "react";
import Layout from "@/components/Layout";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { medicines } from "../../mocks/medicines";

export default function DeleteMedicine() {
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const navigate = useNavigate();

  const handleDelete = () => {
    if (!selectedMedicine) {
      toast({
        title: "Seleção obrigatória",
        description: "Escolha um medicamento para deletar.",
        variant: "warning",
      });
      return;
    }

    toast({
      title: "Medicamento deletado",
      description: `${selectedMedicine} foi removido do estoque.`,
      variant: "success",
    });

    setSelectedMedicine("");
    navigate("/transactions");
  };

  return (
    <Layout title="Deleção de Medicamento">
      <div className="max-w-lg mx-auto mt-10 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Deletar Medicamento
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Selecione o medicamento
            </label>
            <select
              value={selectedMedicine}
              onChange={(e) => setSelectedMedicine(e.target.value)}
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
              {medicines.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
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
