import { useState } from "react";
import DatePicker from "react-datepicker";
import { ptBR } from "date-fns/locale";
import CreatableSelect from "react-select/creatable";
import "react-datepicker/dist/react-datepicker.css";
import { EntryType, OriginType, SectorType } from "@/enums/enums";

export function MedicineForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    medication: "",
    quantity: "",
    stockType: { geral: false, individual: false },
    origin: "",
    entryType: "",
    expirationDate: null as Date | null,
    date: null as Date | null,
    resident: "",
    casela: "",
    cabinet: "",
    sector: "",
  });

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

  const existentCabinets = ["1", "2", "3", "4"].map((num) => ({
    value: num,
    label: num,
  }));

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Medicamento e Dosagem
        </label>
        <input
          type="text"
          value={formData.medication}
          onChange={(e) =>
            setFormData({ ...formData, medication: e.target.value })
          }
          placeholder="Paracetamol - 500mg"
          className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
        />
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
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Data de vencimento
          </label>
          <DatePicker
            selected={formData.expirationDate}
            onChange={(date: Date | null) =>
              setFormData({ ...formData, expirationDate: date })
            }
            locale={ptBR}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecione a data"
            className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Tipo de estoque
        </label>
        <div className="space-y-2">
          {["geral", "individual"].map((type) => (
            <div key={type} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={type}
                checked={formData.stockType[type as "geral" | "individual"]}
                onChange={() =>
                  handleStockTypeChange(type as "geral" | "individual")
                }
                className="w-5 h-5 border-slate-400 rounded text-sky-600 focus:ring-sky-300"
              />
              <label
                htmlFor={type}
                className="text-sm text-slate-700 capitalize"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Residente
          </label>
          <input
            type="text"
            value={formData.resident}
            onChange={(e) =>
              setFormData({ ...formData, resident: e.target.value })
            }
            placeholder="Nome do paciente"
            className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Casela
          </label>
          <input
            type="number"
            value={formData.casela}
            onChange={(e) =>
              setFormData({ ...formData, casela: e.target.value })
            }
            placeholder="5"
            className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Armário
        </label>
        <CreatableSelect
          isClearable
          placeholder="Selecione ou digite um armário"
          options={existentCabinets}
          value={
            formData.cabinet
              ? { value: formData.cabinet, label: formData.cabinet }
              : null
          }
          onChange={(newValue) =>
            setFormData({
              ...formData,
              cabinet: newValue ? newValue.value : "",
            })
          }
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Origem
          </label>
          <select
            value={formData.origin}
            onChange={(e) =>
              setFormData({ ...formData, origin: e.target.value })
            }
            className="w-full border bg-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
          >
            <option value="">Selecione</option>
            {Object.values(OriginType).map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tipo de entrada
          </label>
          <select
            value={formData.entryType}
            onChange={(e) =>
              setFormData({ ...formData, entryType: e.target.value })
            }
            className="w-full border bg-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
          >
            <option value="">Selecione</option>
            {Object.values(EntryType).map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Data
          </label>
          <DatePicker
            selected={formData.date}
            onChange={(date: Date | null) => setFormData({ ...formData, date })}
            locale={ptBR}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecione a data"
            className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Setor
          </label>
          <select
            value={formData.sector}
            onChange={(e) =>
              setFormData({ ...formData, sector: e.target.value })
            }
            className="w-full border bg-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
          >
            <option value="">Selecione</option>
            {Object.values(SectorType).map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
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
