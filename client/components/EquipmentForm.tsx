import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type InputFormProps = {
  inputs: { id: string; nome: string; categoria: string; unidade: string }[];
  cabinets: { value: string; label: string }[];
  onSubmit: (data: any) => void;
};

export function InputForm({ inputs, cabinets, onSubmit }: InputFormProps) {
  const [formData, setFormData] = useState({
    insumoId: "",
    category: "",
    quantity: "",
    cabinet: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (id: string) => {
    const selected = inputs.find((i) => i.id === id);
    setFormData({
      ...formData,
      insumoId: id,
      category: selected ? selected.categoria : "",
    });
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Nome do Insumo
        </label>
        <select
          value={formData.insumoId}
          onChange={(e) => handleInputChange(e.target.value)}
          className="w-full border bg-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
        >
          <option value="">Selecione</option>
          {inputs.map((insumo) => (
            <option key={insumo.id} value={insumo.id}>
              {insumo.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Quantidade
          </label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
            placeholder="10"
            className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Armário
        </label>
        <select
          value={formData.cabinet}
          onChange={(e) =>
            setFormData({ ...formData, cabinet: e.target.value })
          }
          className="w-full border bg-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
        >
          {cabinets.map((cab) => (
            <option key={cab.value} value={cab.value}>
              {cab.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="px-5 py-2 border border-slate-400 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-100 transition mr-2"
          onClick={() => navigate("/stock")}
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => onSubmit(formData)}
          className="px-5 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 transition"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}
