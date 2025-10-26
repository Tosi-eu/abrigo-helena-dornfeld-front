import Layout from "@/components/Layout";
import { cabinets } from "../../mocks/cabinets";
import EditableTable from "@/components/EditableTable";

export default function Cabinets() {
  const columns = [
    { key: "id", label: "Número", editable: true },
    { key: "category", label: "Categoria", editable: true },
  ];

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
