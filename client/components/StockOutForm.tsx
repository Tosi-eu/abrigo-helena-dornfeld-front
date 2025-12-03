import { useState } from "react";

export function StockOutForm({ items, cabinets, residents, onSubmit }) {
  const [formData, setFormData] = useState({
    itemId: "",
    armarioId: "",
    caselaId: "",
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
          <option value="">Selecione</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nome}
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
          <option value="">Selecione</option>
          {cabinets.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Casela
        </label>
        <select
          value={formData.caselaId}
          onChange={(e) =>
            setFormData({ ...formData, caselaId: e.target.value })
          }
          className="w-full border bg-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
        >
          <option value="">Selecione</option>
          {residents.map((r) => (
            <option key={r.casela} value={r.casela}>
              {r.casela}
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
              caselaId: formData.caselaId || undefined,
              quantity: formData.quantity,
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
