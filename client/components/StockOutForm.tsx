import { getCabinets, getResidents } from "@/api/requests";
import { useEffect, useState } from "react";

interface Item {
  id: number;
  nome: string;
  detalhes?: string;
}

interface CabinetOption {
  value: string;
  label: string;
}

interface Props {
  items: Item[];
  onSubmit: (data: any) => void;
}

export function StockOutForm({ items, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    itemId: "" as string | number,
    armarioId: "" as string | number,
    caselaId: "" as string | number,
    quantity: "",
  });

  const [filteredCabinets, setFilteredCabinets] = useState<CabinetOption[]>([]);
  const [caselas, setCaselas] = useState<CabinetOption[]>([]);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const loadCaselas = async () => {
      if (!formData.itemId) {
        setCaselas([]);
        return;
      }

      const item = items.find((i) => String(i.id) === String(formData.itemId));
      if (!item) return;

      try {
        const response = await getResidents();

        setCaselas(
          response.map((r: any) => ({
            value: String(r.casela),
            label: r.casela,
          }))
        );

        updateField("caselaId", "");
      } catch (err) {
        console.error("Erro ao buscar caselas:", err);
      }
    };

    loadCaselas();
  }, [formData.itemId]);


  useEffect(() => {
    const loadArmarios = async () => {
      if (!formData.itemId) {
        setFilteredCabinets([]);
        return;
      }

      const item = items.find((i) => String(i.id) === String(formData.itemId));
      if (!item) return;

      try {
        const response = await getCabinets();

        setFilteredCabinets(
          response.map((a: any) => ({
            value: String(a.numero),
            label: a.numero,
          }))
        );

        updateField("armarioId", "");
      } catch (err) {
        console.error("Erro ao buscar armários:", err);
      }
    };

    loadArmarios();
  }, [formData.itemId]);

  const handleSubmit = () => {
    onSubmit({
      itemId: formData.itemId,
      armarioId: formData.armarioId,
      caselaId: formData.caselaId,
      quantity: Number(formData.quantity),
    });
  };

  return (
    <div className="space-y-4">
      {/* ITEM */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Item</label>
        <select
          value={formData.itemId}
          onChange={(e) => updateField("itemId", e.target.value)}
          className="w-full border bg-white rounded-lg p-2 text-sm"
        >
          <option value="" disabled hidden>Selecione...</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nome} {item.detalhes || ""}
            </option>
          ))}
        </select>
      </div>

      {/* ARMÁRIO */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Armário</label>
        <select
          value={formData.armarioId}
          onChange={(e) => updateField("armarioId", e.target.value)}
          disabled={!formData.itemId}
          className="w-full border bg-white rounded-lg p-2 text-sm disabled:bg-gray-100"
        >
          <option value="" disabled hidden>Selecione...</option>
          {filteredCabinets.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* CASELA */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Casela</label>
        <select
          value={formData.caselaId}
          onChange={(e) => updateField("caselaId", e.target.value)}
          className="w-full border bg-white rounded-lg p-2 text-sm"
        >
          <option value="" disabled hidden>Selecione...</option>
          {caselas.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* QUANTIDADE */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Quantidade
        </label>
        <input
          type="number"
          value={formData.quantity}
          onChange={(e) => updateField("quantity", e.target.value)}
          placeholder="0"
          className="w-full border rounded-lg p-2 text-sm"
        />
      </div>

      {/* BOTÃO */}
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
