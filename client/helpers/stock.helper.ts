import { StockItem } from "@/interfaces/interfaces";
import { daysUntil, isExpired } from "./date.helper";

export const isNearMinimum = (
  quantity: number,
  minimum: number,
  marginPercent: number = 50    
) => {
  if (!minimum || quantity <= minimum) return false;

  const margin = Math.ceil(minimum * (marginPercent / 100));
  const maxRange = minimum + margin;

  return quantity > minimum && quantity <= maxRange;
};

const getMinimumStock = (item: StockItem): number => {
  return (
    item.medicamento?.estoque_minimo ??
    item.insumo?.estoque_minimo ??
    0
  );
};

export const filterNoStock = (items: StockItem[]) =>
  items.filter((item) => item.quantidade === 0);

export const filterNearMinimum = (items: StockItem[]) =>
  items.filter((item) => {
    const min = getMinimumStock(item);
    return isNearMinimum(item.quantidade, min);
  });

export const filterExpired = (items: StockItem[]) =>
  items.filter((item) => item.validade && isExpired(item.validade));

export const filterExpiringSoon = (items: StockItem[], days = 45) =>
  items.filter((item) => {
    if (!item.validade) return false;
    const d = daysUntil(item.validade);
    return d >= 0 && d <= days;
  });

export const groupByCabinet = (items: StockItem[]) => {
  const map = items.reduce((acc, item) => {
    const key = item.armario_id ?? 0;
    if (!acc[key]) acc[key] = 0;
    acc[key] += item.quantidade;
    return acc;
  }, {} as Record<number, number>);

  return Object.entries(map).map(([armario_id, total]) => ({
    cabinet: `Armário ${armario_id}`,
    total,
  }));
};

export const getStockDistribution = (meds: StockItem[], insumos: StockItem[]) => {
  const totalMedicamentos = meds.reduce((s, i) => s + i.quantidade, 0);
  const totalGeral = meds.filter((i) => i.tipo === "geral").reduce((s, i) => s + i.quantidade, 0);
  const totalIndividual = meds.filter((i) => i.tipo === "individual").reduce((s, i) => s + i.quantidade, 0);
  const totalInsumos = insumos.reduce((s, i) => s + i.quantidade, 0);
  const totalAll = totalMedicamentos + totalInsumos;

  return [
    { name: "Estoque Geral (medicamentos)", value: totalAll ? (totalGeral / totalAll) * 100 : 0, rawValue: totalGeral },
    { name: "Estoque Individual (medicamentos)", value: totalAll ? (totalIndividual / totalAll) * 100 : 0, rawValue: totalIndividual },
    { name: "Insumos", value: totalAll ? (totalInsumos / totalAll) * 100 : 0, rawValue: totalInsumos },
  ];
};

export const prepareDashboardData = (medicamentos: StockItem[], insumos: StockItem[]) => {
  const all = [...medicamentos, ...insumos];

  return {
    noStockData: filterNoStock(all),
    belowMinData: filterNearMinimum(all),
    expiredData: filterExpired(all),
    expiringSoonData: filterExpiringSoon(all),
    cabinetStockData: groupByCabinet(all),
    stockDistribution: getStockDistribution(medicamentos, insumos)
  };
};

