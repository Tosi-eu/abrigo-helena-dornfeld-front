import Layout from "@/components/Layout";
import { patients } from "../../mocks/patients";
import EditableTable from "@/components/EditableTable";

export default function Resident() {
  const columns = [
    { key: "name", label: "Nome", editable: true },
    { key: "casela", label: "Casela", editable: true },
  ];

  return (
    <Layout title="Residentes">
      <div className="max-w-3xl mx-auto mt-10 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <EditableTable
          data={patients}
          columns={columns}
          entityType="residents"
        />
      </div>
    </Layout>
  );
}
