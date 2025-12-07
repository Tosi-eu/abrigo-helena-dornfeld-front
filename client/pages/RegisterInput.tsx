import { useState } from "react";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast.hook";
import LoadingModal from "@/components/LoadingModal";
import { createInput } from "@/api/requests";

export default function RegisterInput() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    min_stock: 0,
    category: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para cadastrar o Insumo.",
        variant: "warning",
      });
      return;
    }

    setSaving(true);

    try {
      await createInput(formData.name, formData.min_stock, formData.category);
      toast({
        title: "Insumo cadastrado",
        description: `${formData.name} foi adicionado ao sistema.`,
        variant: "success",
      });

      setFormData({ name: "", min_stock: 0, category: "" });
      navigate("/inputs");
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro ao cadastrar insumo",
        description: "Não foi possível salvar o insumo no banco.",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title="Cadastro de Insumo">
      <LoadingModal
        open={saving}
        title="Aguarde"
        description="Cadastrando insumo..."
      />

      <div className="max-w-lg mx-auto mt-10 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Cadastrar Insumo
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nome do Insumo
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Seringa 5ml"
              className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
              disabled={saving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Categoria
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              placeholder="Material de Injeção"
              className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
              disabled={saving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Estoque Mínimo
            </label>
            <input
              type="number"
              min={0}
              value={formData.min_stock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  min_stock: Number(e.target.value),
                })
              }
              placeholder="0"
              className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
              disabled={saving}
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate("/inputs")}
              className="px-5 py-2 border border-slate-400 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-100 transition"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 transition disabled:opacity-50"
              disabled={saving}
            >
              {saving ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}