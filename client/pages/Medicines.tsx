import Layout from "@/components/Layout";
import EditableTable from "@/components/EditableTable";
import { medicines } from "../../mocks/medicines";

export default function Medicines() {
  return (
    <Layout title="Medicamentos">
      <EditableTable
        data={medicines}
        columns={[
          { key: "name", label: "Nome", editable: true },
          { key: "substance", label: "Princípio Ativo", editable: true },
          { key: "dosage", label: "Dosagem", editable: true },
          { key: "minimumStock", label: "Estoque Mínimo", editable: true },
        ]}
        onAdd={(row) => console.log("Nova linha:", row)}
        onEdit={(row, i) => console.log("Editado:", row, "na linha", i)}
        onDelete={(i) => console.log("Excluído na linha:", i)}
        entityType="medicines"
      />
    </Layout>
  );
}
