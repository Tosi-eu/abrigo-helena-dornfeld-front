import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import EditableTable from "@/components/EditableTable";

export default function Resident() {
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const columns = [
    { key: "nome", label: "Nome", editable: true },
    { key: "num_casela", label: "Casela", editable: true },
  ];

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/residentes");
        if (!res.ok) throw new Error("Erro ao buscar residentes");

        const data = await res.json();
        setResidents(data);
      } catch (err: any) {
        console.error("Erro ao buscar residentes:", err);
        setError(err.message ?? "Erro ao buscar residentes");
      } finally {
        setLoading(false);
      }
    };

    fetchResidents();
  }, []);

  if (loading) {
    return (
      <Layout title="Residentes">
        <div className="text-center mt-10 text-slate-500">Carregando...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Residentes">
        <div className="text-center mt-10 text-red-500">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout title="Residentes">
      <div className="max-w-3xl mx-auto mt-10 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <EditableTable
          data={residents}
          columns={columns}
          entityType="residents"
        />
      </div>
    </Layout>
  );
}
