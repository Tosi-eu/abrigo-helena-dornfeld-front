import { useState } from "react";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { CabinetCategory } from "@/enums/enums";
import { toast } from "@/hooks/use-toast";

export default function RegisterCabinet() {
  const [id, setId] = useState<number | "">("");
  const [category, setCategory] = useState<CabinetCategory | "">("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (id === "" || id <= 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Informe um número de armário válido.",
        variant: "warning",
      });
      return;
    }

    if (!category) {
      toast({
        title: "Campos obrigatórios",
        description: "Informe uma categoria.",
        variant: "warning",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/armarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numero: id,
          categoria: category,
        }),
      });

      if (!res.ok) throw new Error("Erro ao cadastrar armário");

      toast({
        title: "Armário criado",
        description: `O armário ${id} foi cadastrado com sucesso.`,
        variant: "success",
      });

      navigate("/cabinets");
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro ao cadastrar",
        description: "Não foi possível cadastrar o armário.",
        variant: "error",
      });
    }
  };

  return (
    <Layout title="Cadastrar Armário">
      <div className="max-w-lg mx-auto mt-10 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Cadastro de Armário
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Número do Armário
            </label>
            <input
              type="number"
              value={id}
              onChange={(e) => {
                const v = e.target.value;
                setId(v === "" ? "" : parseInt(v, 10));
              }}
              className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
              placeholder="Ex: 4"
              min={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Categoria
            </label>
            <input
              list="categories"
              value={category}
              onChange={(e) => setCategory(e.target.value as CabinetCategory)}
              className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
              placeholder="Selecione ou digite uma categoria"
            />
            <datalist id="categories">
              {Object.values(CabinetCategory).map((label) => (
                <option key={label} value={label} />
              ))}
            </datalist>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate("/cabinets")}
              className="px-5 py-2 border border-slate-400 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 transition"
            >
              Cadastrar Armário
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}