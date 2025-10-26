import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EditableTableProps } from "@/interfaces/interfaces";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DeletePopUp from "./DeletePopUp";

const typeMap: Record<string, string> = {
  Medicamento: "medicines",
  Insumo: "inputs",
};

export default function EditableTable({
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
  entityType,
}: EditableTableProps & { entityType?: string }) {
  const [rows, setRows] = useState(data);
  const [filterType, setFilterType] = useState("Todos");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
  if (!data) return;

  const convertToBRT = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; 
    // converte para UTC-3
    const brtDate = new Date(date.getTime() - 3 * 60 * 60 * 1000);
    return brtDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatted = data.map((row) => {
    const updatedRow: Record<string, any> = {};
    for (const key in row) {
      const value = row[key];
      if (
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2}/.test(value)
      ) {
        updatedRow[key] = convertToBRT(value);
      } else {
        updatedRow[key] = value;
      }
    }
    return updatedRow;
  });

  setRows(formatted);
}, [data]);

const handleAddRow = () => {
  if (entityType === "entries") {
    console.log(rows)
    navigate("/stock/in", { state: { previousData: rows } });
  } else if (entityType === "exits") {
    navigate("/stock/out", { state: { previousData: rows } });
  } else if (entityType === "medicines") {
    navigate("/medicines/register");
  } else if (entityType === "residents") {
    navigate("/residents/register");
  } else if (entityType === "equipments") {
    navigate("/inputs/register");
  } else if (entityType === "cabinets") {
    navigate("/cabinets/register");
  } else if (entityType === "transactions") {
    if (filterType === "Medicamento") {
      navigate("/medicines/register");
    } else if (filterType === "Insumo") {
      navigate("/inputs/register");
    } else {
      toast({
        title: "Seleção inválida",
        description:
          'Selecione "Medicamento" ou "Insumo" antes de adicionar.',
        variant: "error",
      });
    }
  }
};


  const handleChange = (rowIndex: number, key: string, value: string) => {
    const updated = [...rows];
    updated[rowIndex][key] = value;
    setRows(updated);
  };

  const confirmDelete = (index: number) => setDeleteIndex(index);

  const handleDeleteConfirmed = () => {
    if (deleteIndex === null) return;
    const updated = rows.filter((_, i) => i !== deleteIndex);
    setRows(updated);
    if (onDelete) onDelete(deleteIndex);

    toast({
      title: "Item removido",
      description: "O item foi excluído com sucesso.",
      variant: "success",
    });

    setDeleteIndex(null);
  };

  const handleDeleteCancel = () => setDeleteIndex(null);

  const handleEditClick = (row: any) => {
    let type = typeMap[row?.type];

    if (
      ["equipments", "medicines", "residents", "cabinets"].includes(entityType)
    ) {
      type = entityType;
    }

    if (!type) {
      toast({
        title: "Tipo indefinido",
        description: "Nenhum tipo foi informado.",
        variant: "error",
      });
      return;
    }

    navigate(`/${type}/edit`, { state: { item: row } });
  };

  const rowsFiltered =
    filterType === "Todos" ? rows : rows.filter((r) => r.type === filterType);

  const renderExpiryTag = (value: string) => {
    if (!value) return "-";

    const [day, month, year] = value.split("/").map(Number);
    const expiryDate = new Date(year, month - 1, day);
    if (isNaN(expiryDate.getTime())) return value;

    const today = new Date();
    const diffDays = Math.ceil(
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    let tooltipText = "";
    let colorClasses = "";

    if (diffDays < 0) {
      tooltipText = `Vencido há ${Math.abs(diffDays)} dias`;
      colorClasses = "bg-red-100 text-red-700 border border-red-300";
    } else if (diffDays <= 30) {
      tooltipText = `Vencerá em ${diffDays} dias`;
      colorClasses = "bg-orange-100 text-orange-700 border border-orange-300";
    } else if (diffDays <= 60) {
      tooltipText = `Vencerá em ${diffDays} dias`;
      colorClasses = "bg-yellow-100 text-yellow-700 border border-yellow-300";
    } else {
      tooltipText = `Vencerá em ${diffDays} dias`;
      colorClasses = "bg-green-100 text-green-700 border border-green-300";
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium cursor-default ${colorClasses}`}
            >
              {value}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            {tooltipText}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const renderQuantityTag = (row: any) => {
    let colorClasses = "";
    let tooltipText = "";

    if (row.minimumStock != null) {
      const margin = row.minimumStock * 0.2;

      if (row.quantity > row.minimumStock * 2) {
        colorClasses = "bg-green-100 text-green-700 border border-green-300";
        tooltipText = `Estoque saudável: ${row.quantity} unidades, mínimo ${row.minimumStock}`;
      } else if (row.quantity > row.minimumStock + margin) {
        colorClasses = "bg-yellow-100 text-yellow-700 border border-yellow-300";
        tooltipText = `Estoque médio: ${row.quantity} unidades, mínimo ${row.minimumStock}`;
      } else {
        colorClasses = "bg-red-100 text-red-700 border border-red-300";
        tooltipText = `Estoque baixo: ${row.quantity} unidades, mínimo ${row.minimumStock}`;
      }
    } else {
      colorClasses = "bg-green-100 text-green-700 border border-green-300";
      tooltipText = `Quantidade: ${row.quantity}`;
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium cursor-default ${colorClasses}`}
            >
              {row.quantity}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            {tooltipText}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const hasType = rows.some((r) => r.type);

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden font-[Inter]">
        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200 bg-sky-50 text-sm">
          <div className="flex items-center gap-4">
            {hasType && entityType !== "equipments" && (
              <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                <span className="text-slate-700">Tipo:</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-slate-300 rounded-md px-2 py-1 text-sm bg-white focus:ring-2 focus:ring-sky-300 focus:outline-none"
                >
                  {["Todos", "Medicamento", "Insumo"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            onClick={handleAddRow}
            className="flex items-center gap-1 text-sky-700 text-sm font-medium hover:text-sky-800 transition"
          >
            <Plus size={16} /> Adicionar linha
          </button>
        </div>

        <div className="overflow-x-auto relative">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-300 bg-sky-100">
                {columns.map((col, index) => {
                  let label = col.label;

                  if (
                    col.key === "description" &&
                    entityType !== "equipments"
                  ) {
                    if (filterType === "Todos") {
                      label = "Princípio Ativo / Descrição";
                    } else {
                      label =
                        filterType === "Medicamento"
                          ? "Princípio Ativo"
                          : "Descrição";
                    }
                  }

                  if (col.key === "itemName") label = "Nome do Produto";

                  return (
                    <th
                      key={col.key}
                      className={`px-4 py-3 text-sm font-semibold text-slate-800 ${
                        index !== columns.length - 1
                          ? "border-r border-slate-200"
                          : ""
                      }`}
                    >
                      {label}
                    </th>
                  );
                })}
                <th className="px-4 py-3 text-sm font-semibold text-slate-800 border-l border-slate-200">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {rowsFiltered.slice(0, recordsPerPage).map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-200 hover:bg-sky-50 transition-colors"
                >
                  {columns.map((col, index) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-xs text-slate-800 ${
                        index !== columns.length - 1
                          ? "border-r border-slate-100"
                          : ""
                      }`}
                    >
                      {editingIndex === i && col.editable ? (
                        <input
                          type="text"
                          value={row[col.key]}
                          onChange={(e) =>
                            handleChange(i, col.key, e.target.value)
                          }
                          placeholder={
                            col.key === "description" &&
                            entityType !== "equipments"
                              ? row.type === "Medicamento"
                                ? "Princípio Ativo"
                                : "Descrição"
                              : col.label
                          }
                          className="border border-slate-300 rounded-md px-2 py-1 text-xs focus:ring-2 focus:ring-sky-300 focus:outline-none bg-white text-center"
                        />
                      ) : col.key === "expiry" ? (
                        renderExpiryTag(row[col.key])
                      ) : col.key === "quantity" ? (
                        renderQuantityTag(row)
                      ) : (
                        row[col.key]
                      )}
                    </td>
                  ))}

                  <td className="px-3 py-2 flex justify-center gap-3 border-l border-slate-200">
                    <button
                      onClick={() => handleEditClick(row)}
                      className="text-sky-700 hover:text-sky-900 transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => confirmDelete(i)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {rowsFiltered.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="text-center py-4 text-sm text-slate-600"
                  >
                    Nenhum item encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeletePopUp
        open={deleteIndex !== null}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirmed}
      />
    </>
  );
}
