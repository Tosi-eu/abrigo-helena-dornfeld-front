import { useEffect, useState } from "react";
import { OperationType } from "@/enums/enums";

interface Item {
  id: number;
  nome: string;
  detalhes?: string;
  type?: OperationType | string;
}

interface CabinetOption {
  value: string;
  label: string;
}

interface StockOutFormProps {
  items: Item[];
  cabinets: CabinetOption[];
  onSubmit: (data: any) => void;
}

export function StockOutForm({ items, cabinets, onSubmit }: StockOutFormProps) {
  const [formData, setFormData] = useState({
    itemId: null as string | null,
    armarioId: null as string | null,
    caselaId: null as string | null,
    quantity: "",
  });

  const [filteredCabinets, setFilteredCabinets] = useState<CabinetOption[]>([]);
  const [caselas, setCaselas] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const fetchCaselas = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/residentes");
        const data = await res.json();
        if (Array.isArray(data)) {
          setCaselas(
            data.map((r: any) => ({
              value: String(r.num_casela),
              label: `Casela ${r.num_casela} - ${r.nome}`,
            }))
          );
        }
      } catch (err) {
        console.error("Erro ao buscar caselas:", err);
      }
    };
    fetchCaselas();
  }, []);

  useEffect(() => {
    const fetchFilteredCabinets = async () => {
      if (!formData.itemId) {
        setFilteredCabinets([]);
        return;
      }

      const selectedItem = items.find((i) => String(i.id) === String(formData.itemId));
      if (!selectedItem) return;

      const tipo =
        selectedItem.type === "medicine" || selectedItem.type === OperationType.MEDICINE
          ? "medicamento"
          : "insumo";

      try {
        const res = await fetch(
          `http://localhost:3001/api/armarios?itemId=${formData.itemId}&type=${tipo}`
        );
        const data = await res.json();

        setFilteredCabinets(
          data.map((a: any) => ({
            value: String(a.num_armario),
            label: `Armário ${a.num_armario}`,
          }))
        );
        setFormData(prev => ({ ...prev, armarioId: null })); 
      } catch (err) {
        console.error("Erro ao filtrar armários:", err);
      }
    };

    fetchFilteredCabinets();
  }, [formData.itemId, items]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.itemId || !formData.armarioId || !formData.caselaId || !formData.quantity) {
      alert("Preencha todos os campos!");
      return;
    }
    onSubmit({
      itemId: formData.itemId,
      armarioId: formData.armarioId,
      caselaId: formData.caselaId,
      quantity: Number(formData.quantity),
    });
    setFormData({ itemId: null, armarioId: null, caselaId: null, quantity: "" });
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div>
        <label className="block text-sm font-medium text-slate-700">Item</label>
        <select
          value={formData.itemId ?? ""}
          onChange={e => updateField("itemId", e.target.value || null)}
          className="w-full border bg-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
        >
          <option value="" disabled hidden>Selecione</option>
          {items.map(item => (
            <option key={item.id} value={item.id}>
              {item.nome} {item.detalhes || ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Armário</label>
        <select
          value={formData.armarioId ?? ""}
          onChange={e => updateField("armarioId", e.target.value || null)}
          disabled={!formData.itemId}
          className="w-full border bg-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="" disabled hidden>Selecione</option>
          {filteredCabinets.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Casela</label>
        <select
          value={formData.caselaId ?? ""}
          onChange={e => updateField("caselaId", e.target.value || null)}
          className="w-full border bg-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
        >
          <option value="" disabled hidden>Selecione</option>
          {caselas.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Quantidade</label>
        <input
          type="number"
          value={formData.quantity}
          onChange={e => updateField("quantity", e.target.value)}
          placeholder="0"
          className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-5 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 transition"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}
