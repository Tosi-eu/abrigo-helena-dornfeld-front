import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import EditableTable from "@/components/EditableTable";
import { useToast } from "@/hooks/use-toast";

export default function Inputs() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const columns = [
    { key: "nome", label: "Nome", editable: true },
    { key: "descricao", label: "Descrição", editable: true },
  ];

  useEffect(() => {
    const fetchInputs = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/insumos");
        if (!res.ok) throw new Error("Erro ao buscar insumos");

        const result = await res.json();
        console.log(result);

        setData(result);
      } catch (err) {
        console.error(err);
        toast({
          title: "Erro ao carregar insumos",
          description: "Não foi possível obter os dados do servidor.",
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchInputs();
  }, []);

  if (loading) {
    return (
      <Layout title="Insumos">
        <div className="flex justify-center items-center h-64 text-slate-500">
          Carregando insumos...
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Insumos">
      <div className="space-y-6">
        <EditableTable data={data} columns={columns} entityType="inputs" />
      </div>
    </Layout>
  );
}
