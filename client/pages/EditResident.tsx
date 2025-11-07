import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { toast } from "@/hooks/use-toast";

export default function EditResident() {
  const location = useLocation();
  const item = location.state?.item; // vem como { num_casela, nome }
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    num_casela: "",
    nome: "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        num_casela: item.num_casela?.toString() || "",
        nome: item.nome || "",
      });
    } else {
      toast({
        title: "Nenhum residente selecionado",
        description: "Volte à lista e escolha um residente para editar.",
        variant: "warning",
      });
      navigate("/residents");
    }
  }, [item, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.num_casela) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos antes de salvar.",
        variant: "warning",
      });
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3001/api/residentes/${formData.num_casela}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: formData.nome,
          }),
        },
      );

      if (!res.ok) throw new Error("Erro ao editar residente");
      const updated = await res.json();

      toast({
        title: "Residente atualizado",
        description: `O residente ${updated.nome} foi atualizado com sucesso!`,
        variant: "success",
      });

      navigate("/residents");
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro ao editar residente",
        description: "Não foi possível atualizar o residente.",
        variant: "error",
      });
    }
  };

  return (
    <Layout title="Editar Residente">
      <div className="max-w-lg mx-auto mt-10 bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Edição de Residente
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
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
              name="num_casela"
              value={formData.num_casela}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
              disabled
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate("/residents")}
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
      </div>
    </Layout>
  );
}
