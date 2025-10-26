import Layout from "@/components/Layout";
import EditableTable from "@/components/EditableTable";
import { inputs } from "../../mocks/inputs";

export default function Equipments() {
  const columns = [
    { key: "name", label: "Nome", editable: true },
    { key: "description", label: "Descrição", editable: true },
  ];

  return (
    <Layout title="Insumos">
      <div className="space-y-6">
        <EditableTable
          data={inputs}
          columns={columns}
          entityType="equipments"
        />
      </div>
    </Layout>
  );
}
