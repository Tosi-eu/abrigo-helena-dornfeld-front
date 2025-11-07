import Layout from "@/components/Layout";
import EditableTable from "@/components/EditableTable";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function Medicines() {
  const [medicines, setMedicines] = useState([]);

  const fetchMedicines = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/medicamentos");
      const data = await res.json();
      setMedicines(data);
    } catch {
      toast({
        title: "Erro ao carregar medicamentos",
        variant: "error",
      });
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleAdd = async (row: any) => {
    try {
      const body = {
        nome: row.nome,
        dosagem: row.dosagem,
        unidade_medida: row.unidade_medida,
        principio_ativo: row.principio_ativo,
        estoque_minimo: row.estoque_minimo,
      };
      const res = await fetch("http://localhost:3001/api/medicamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Medicamento adicionado", variant: "success" });
      fetchMedicines();
    } catch {
      toast({ title: "Erro ao adicionar medicamento", variant: "error" });
    }
  };

  return (
    <Layout title="Medicamentos">
      <EditableTable
        data={medicines}
        columns={[
          { key: "nome", label: "Nome", editable: true },
          { key: "principio_ativo", label: "Princípio Ativo", editable: true },
          { key: "dosagem", label: "Dosagem", editable: true },
          { key: "unidade_medida", label: "Unidade", editable: true },
          { key: "estoque_minimo", label: "Estoque Mínimo", editable: true },
        ]}
        entityType="medicines"
      />
    </Layout>
  );
}
