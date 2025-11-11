import { useEffect, useState, useMemo } from "react";
import Layout from "@/components/Layout";
import EditableTable from "@/components/EditableTable";
import LoadingModal from "@/components/LoadingModal";

export default function InputMovements() {
  const [entryFilter, setEntryFilter] = useState("");
  const [exitFilter, setExitFilter] = useState("");
  const [medicineMovements, setMedicineMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [entriesRes, exitsRes, inputsRes] = await Promise.all([
          fetch(
            "http://localhost:3001/api/movimentacoes/medicamentos?type=entrada",
          ),
          fetch(
            "http://localhost:3001/api/movimentacoes/medicamentos?type=saida",
          ),
          fetch("http://localhost:3001/api/movimentacoes/insumos"),
        ]);

        const [entriesData, exitsData, inputsData] = await Promise.all([
          entriesRes.json(),
          exitsRes.json(),
          inputsRes.json(),
        ]);

        const normalizedMedicines = [...entriesData, ...exitsData].map(
          (m: any) => ({
            id: m.id,
            name: m.name,
            additionalData: m.additionalData || "",
            quantity: m.quantity ?? "",
            operator: m.operator,
            movementDate: new Date(m.movementDate).toLocaleDateString("pt-BR"),
            cabinet: m.cabinet,
            type: m.type.toUpperCase(),
            resident: m.patient || "",
            validade: m.validade_medicamento
              ? new Date(m.validade_medicamento).toLocaleDateString("pt-BR")
              : "",
          }),
        );

        const normalizedInputs = inputsData.map((i: any) => ({
          id: i.id,
          name: i.name,
          additionalData: i.additionalData || "",
          quantity: i.quantity ?? "",
          operator: i.operator,
          movementDate: new Date(i.movementDate).toLocaleDateString("pt-BR"),
          cabinet: i.cabinet,
          type: i.type.toUpperCase(),
          resident: "",
          validade: "",
        }));

        setMedicineMovements([...normalizedMedicines, ...normalizedInputs]);
      } catch (error) {
        console.error("Erro ao carregar movimentações:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const columnsBase = [
    { key: "name", label: "Produto", editable: false },
    { key: "additionalData", label: "Princípio Ativo", editable: false },
    { key: "quantity", label: "Quantidade", editable: false },
    { key: "operator", label: "Operador", editable: false },
    { key: "movementDate", label: "Data da Transação", editable: false },
    { key: "cabinet", label: "Armário", editable: false },
    { key: "resident", label: "Residente", editable: false },
  ];

  const entries = useMemo(
    () =>
      medicineMovements.filter(
        (m) =>
          m.type === "ENTRADA" &&
          (!entryFilter ||
            m.name.toLowerCase().includes(entryFilter.toLowerCase())),
      ),
    [medicineMovements, entryFilter],
  );

  const exits = useMemo(
    () =>
      medicineMovements.filter(
        (m) =>
          m.type === "SAIDA" &&
          (!exitFilter ||
            m.name.toLowerCase().includes(exitFilter.toLowerCase())),
      ),
    [medicineMovements, exitFilter],
  );

  const uniqueNames = useMemo(
    () => Array.from(new Set(medicineMovements.map((m) => m.name))),
    [medicineMovements],
  );

  return (
    <Layout title="Movimentações">
      <LoadingModal
        open={loading}
        title="Aguarde"
        description="Carregando movimentações..."
      />

      {!loading && (
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
              columns={columnsBase}
              showAddons={false}
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
              columns={columnsBase}
              showAddons={false}
              entityType="exits"
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
