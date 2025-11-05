import { useState } from "react";

type StockOutFormProps = {
  items: { id: string; nome: string; detalhes?: string }[];
  cabinets: { value: string; label: string }[];
  onSubmit: (data: {
    itemId: string;
    armarioId: string;
    quantity: number;
  }) => void;
};

export function StockOutForm({ items, cabinets, onSubmit }: StockOutFormProps) {
  const [formData, setFormData] = useState({
    itemId: "",
    armarioId: "",
    quantity: "",
  });

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Item
        </label>
        <select
          value={formData.itemId}
          onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
          className="w-full border bg-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
        >
          <option value="">Selecione...</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nome} {item.detalhes || ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Armário
        </label>
        <select
          value={formData.armarioId}
          onChange={(e) =>
            setFormData({ ...formData, armarioId: e.target.value })
          }
          className="w-full border bg-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
        >
          <option value="">Selecione...</option>
          {cabinets.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Quantidade
        </label>
        <input
          type="number"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: e.target.value })
          }
          placeholder="0"
          className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() =>
            onSubmit({
              itemId: formData.itemId,
              armarioId: formData.armarioId,
              quantity: Number(formData.quantity),
            })
          }
          className="px-5 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 transition"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}
