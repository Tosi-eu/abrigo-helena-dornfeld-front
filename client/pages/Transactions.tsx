import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import EditableTable from "@/components/EditableTable";
import { movements } from "../../mocks/movements";
import { inputs } from "../../mocks/inputs";
import { cabinets } from "../../mocks/cabinets";
import { users } from "../../mocks/users";
import { medicineInventory, inputInventory } from "../../mocks/stock";
import { prepareMovements } from "@/utils/utils";
import { medicines } from "../../mocks/medicines";
import { MovementType } from "@/enums/enums";

export default function InputMovements() {
  const navigate = useNavigate();

  const [entryFilter, setEntryFilter] = useState("");
  const [exitFilter, setExitFilter] = useState("");

  const columnsBase = [
    { key: "name", label: "Nome do Produto", editable: false },
    { key: "description", label: "Descrição", editable: false },
    { key: "quantity", label: "Quantidade", editable: false },
    { key: "operator", label: "Operador", editable: false },
    { key: "movementDate", label: "Data da Transação", editable: false },
    { key: "cabinet", label: "Armário", editable: false },
  ];

  const entryColumns = [
    ...columnsBase,
    { key: "originSector", label: "Setor de Origem", editable: false },
  ];
  const exitColumns = [
    ...columnsBase,
    { key: "destinationSector", label: "Setor de Destino", editable: false },
  ];

  const allMovements = prepareMovements({
    movements,
    medicines,
    inputs,
    patients: [],
    cabinets,
    users,
    medicineInventory,
    inputInventory,
  });

  const entries = allMovements
    .filter((m) => m.movementType === MovementType.IN)
    .filter((m) =>
      entryFilter
        ? m.name.toLowerCase().includes(entryFilter.toLowerCase())
        : true,
    );

  const exits = allMovements
    .filter((m) => m.movementType === MovementType.OUT)
    .filter((m) =>
      exitFilter
        ? m.name.toLowerCase().includes(exitFilter.toLowerCase())
        : true,
    );

  const uniqueNames = Array.from(new Set(allMovements.map((m) => m.name)));

  return (
    <Layout title="Movimentações">
      <div className="space-y-10">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-700">Entradas</h2>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <input
              type="text"
              list="entryNames"
              value={entryFilter}
              onChange={(e) => setEntryFilter(e.target.value)}
              placeholder="Filtrar por nome..."
              className="border border-slate-300 rounded-md px-3 py-1 text-sm w-64 focus:ring-2 focus:ring-sky-300 focus:outline-none"
            />
            <datalist id="entryNames">
              {uniqueNames.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
            {entryFilter && (
              <button
                onClick={() => setEntryFilter("")}
                className="text-xs text-sky-600 hover:underline"
              >
                Limpar
              </button>
            )}
          </div>

          <EditableTable
            data={entries}
            columns={entryColumns}
            entityType="entries"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-700">Saídas</h2>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <input
              type="text"
              list="exitNames"
              value={exitFilter}
              onChange={(e) => setExitFilter(e.target.value)}
              placeholder="Filtrar por nome..."
              className="border border-slate-300 rounded-md px-3 py-1 text-sm w-64 focus:ring-2 focus:ring-sky-300 focus:outline-none"
            />
            <datalist id="exitNames">
              {uniqueNames.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
            {exitFilter && (
              <button
                onClick={() => setExitFilter("")}
                className="text-xs text-sky-600 hover:underline"
              >
                Limpar
              </button>
            )}
          </div>

          <EditableTable
            data={exits}
            columns={exitColumns}
            entityType="exits"
          />
        </div>
      </div>
    </Layout>
  );
}
