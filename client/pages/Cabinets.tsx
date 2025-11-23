import Layout from "@/components/Layout";
import EditableTable from "@/components/EditableTable";
import { useQuery } from "@tanstack/react-query";

export default function Cabinets() {
  const columns = [
    { key: "numero", label: "Número", editable: false },
    { key: "categoria", label: "Categoria", editable: false },
  ];

  const {
    data: cabinets = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cabinets"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3001/api/armarios");
      if (!res.ok) throw new Error(`Erro ao buscar armários ${res}`);
      return res.json();
    },
  });

  if (isLoading)
    return (
      <Layout title="Armários">
        <p>Carregando armários...</p>
      </Layout>
    );

  if (error)
    return (
      <Layout title="Armários">
        <p className="text-red-600">Erro ao carregar armários.</p>
      </Layout>
    );

  return (
    <Layout title="Armários">
      <div className="max-w-3xl mx-auto mt-10 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <EditableTable
          data={cabinets}
          columns={columns}
          entityType="cabinets"
        />
      </div>
    </Layout>
  );
}
