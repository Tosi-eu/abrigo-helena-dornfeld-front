import { useState } from "react";
import DatePicker from "react-datepicker";
import { ptBR } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

type MedicineFormProps = {
  medicamentos: { id: string; nome: string; dosagem: string; unidade_medida: string }[];
  caselas: { value: string; label: string; nome: string }[];
  cabinets: { value: string; label: string }[];
  onSubmit: (data: any) => void;
};

export function MedicineForm({
  medicamentos,
  caselas,
  cabinets,
  onSubmit,
}: MedicineFormProps) {
  const [formData, setFormData] = useState({
    medication: "",
    quantity: "",
    stockType: { geral: false, individual: false },
    expirationDate: null as Date | null,
    resident: "",
    casela: "",
    cabinet: "",
  });

  const handleCaselaChange = (value: string) => {
    const selected = caselas.find((c) => c.value === value);
    setFormData((prev) => ({
      ...prev,
      casela: value,
      resident: selected ? selected.nome : "",
    }));
  };

  const handleStockTypeChange = (type: "geral" | "individual") => {
    setFormData((prev) => ({
      ...prev,
      stockType: {
        geral: false,
        individual: false,
        [type]: !prev.stockType[type],
      },
    }));
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Medicamento</label>
        <select
          value={formData.medication}
          onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
          className="w-full border bg-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
        >
          {medicamentos.map((med) => (
            <option key={med.id} value={med.id}>
              {med.nome} {med.dosagem} {med.unidade_medida}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Quantidade</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            placeholder="10"
            className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Data de vencimento</label>
          <DatePicker
            selected={formData.expirationDate}
            onChange={(date: Date | null) => setFormData({ ...formData, expirationDate: date })}
            locale={ptBR}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecione a data"
            className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de estoque</label>
        <div className="space-y-2">
          {["geral", "individual"].map((type) => (
            <div key={type} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={type}
                checked={formData.stockType[type as "geral" | "individual"]}
                onChange={() => handleStockTypeChange(type as "geral" | "individual")}
                className="w-5 h-5 border-slate-400 rounded text-sky-600 focus:ring-sky-300"
              />
              <label htmlFor={type} className="text-sm text-slate-700 capitalize">
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Casela</label>
          <select
            value={formData.casela}
            onChange={(e) => handleCaselaChange(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-sky-300 focus:outline-none"
          >
            {caselas.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Residente</label>
          <input
            type="text"
            value={formData.resident}
            readOnly
            placeholder="Nome do residente"
            className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2 text-sm text-slate-600"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Armário</label>
        <select
          value={formData.cabinet}
          onChange={(e) => setFormData({ ...formData, cabinet: e.target.value })}
          className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-sky-300 focus:outline-none"
        >
          {cabinets.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="px-5 py-2 border border-slate-400 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-100 transition mr-2"
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
