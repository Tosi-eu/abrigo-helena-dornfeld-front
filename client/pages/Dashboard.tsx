import Layout from "@/components/Layout";
import { medicines } from "../../mocks/medicines";
import { movements } from "../../mocks/movements";
import { users } from "../../mocks/users";
import { patients } from "../../mocks/patients";
import { cabinets } from "../../mocks/cabinets";
import { StockType } from "@/enums/enums";
import { useMemo, useState } from "react";
import { inputInventory, medicineInventory } from "../../mocks/stock";
import { prepareMovements } from "@/utils/utils";
import { inputs } from "../../mocks/inputs";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Sector,
  CartesianGrid,
} from "recharts";

const daysBetween = (date1: string, date2: string) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.ceil((d1.getTime() - d2.getTime()) / (1000 * 3600 * 24));
};

export default function Dashboard() {
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const [activePieIndex, setActivePieIndex] = useState<number | null>(null);

  const expiringMedicines = useMemo(() => {
    return medicineInventory
      .filter((m) => {
        const days = daysBetween(m.expiry, today);
        return days >= 0 && days <= 60;
      })
      .map((m) => {
        const med = medicines.find((x) => x.id === m.medicineId);
        return {
          name: med?.name || "-",
          substance: med?.substance || "-",
          quantity: m.quantity,
          expiry: m.expiry,
        };
      });
  }, []);

  const recentMovements = useMemo(() => {
    const allMovements = prepareMovements({
      movements,
      medicines,
      inputs,
      patients,
      cabinets,
      users,
      medicineInventory,
      inputInventory,
    });

    const todayDate = new Date();
    const oneWeekAgo = new Date(todayDate);
    oneWeekAgo.setDate(todayDate.getDate() - 7);

    return allMovements.filter((mov) => {
      const movDate = new Date(mov.movementDate);
      return movDate >= oneWeekAgo && movDate <= todayDate;
    });
  }, []);

  const stats = useMemo(() => {
    const medicinesWithoutStock = medicines.filter((m) => {
      const inv = medicineInventory.find((mi) => mi.medicineId === m.id);
      return !inv || inv.quantity === 0;
    }).length;

    const medicinesLowStock = medicineInventory.filter((m) => {
      const med = medicines.find((x) => x.id === m.medicineId);
      return med?.minimumStock !== undefined && m.quantity <= med.minimumStock;
    }).length;

    const expiredMedicines = medicineInventory.filter(
      (m) => new Date(m.expiry) < new Date(),
    ).length;

    const expiringSoon = expiringMedicines.length;

    return [
      {
        label: "Medicamentos sem estoque",
        value: medicinesWithoutStock.toString(),
        onClick: () => navigate("/stock", { state: { filterType: "noStock" } }),
      },
      {
        label: "Medicamentos com baixo estoque",
        value: medicinesLowStock.toString(),
        onClick: () =>
          navigate("/stock", { state: { filterType: "belowMin" } }),
      },
      {
        label: "Medicamentos vencidos",
        value: expiredMedicines.toString(),
        onClick: () => navigate("/stock", { state: { filterType: "expired" } }),
      },
      {
        label: "Medicamentos próximos do vencimento",
        value: expiringSoon.toString(),
        onClick: () =>
          navigate("/stock", { state: { filterType: "expiringSoon" } }),
      },
    ];
  }, [navigate, expiringMedicines]);

  const stockDistribution = useMemo(() => {
    const generalMedicines = medicineInventory
      .filter((m) => m.stockType === StockType.GERAL)
      .reduce((acc, m) => acc + m.quantity, 0);

    const individualMedicines = medicineInventory
      .filter((m) => m.stockType === StockType.INDIVIDUAL)
      .reduce((acc, m) => acc + m.quantity, 0);

    const equipmentCount = inputInventory.reduce(
      (acc, e) => acc + e.quantity,
      0,
    );

    const total = generalMedicines + individualMedicines + equipmentCount;

    return [
      {
        name: "Estoque Geral (medicamentos)",
        value: Math.round((generalMedicines / total) * 100), 
        rawValue: generalMedicines, 
      },
      {
        name: "Estoque Individual (medicamentos)",
        value: Math.round((individualMedicines / total) * 100),
        rawValue: individualMedicines,
      },
      {
        name: "Insumos",
        value: Math.round((equipmentCount / total) * 100),
        rawValue: equipmentCount,
      },
    ];
  }, []);

  const cabinetStockData = useMemo(() => {
    return cabinets.map((cab) => {
      const total = inputInventory
        .filter((m) => m.cabinetId === cab.id)
        .reduce((acc, m) => acc + m.quantity, 0);
      return { cabinet: cab.id, total };
    });
  }, []);

  const COLORS = ["#0EA5E9", "#FACC15", "#EF4444"];

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
      props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{
            transition: "all 0.3s ease",
            opacity: 1,
          }}
        />
      </g>
    );
  };

  return (
    <Layout>
      <div className="space-y-10 pt-10">
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, index) => (
              <div
                key={index}
                onClick={stat.onClick}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center cursor-pointer hover:shadow-md hover:scale-105 hover:bg-sky-50 transition-all duration-200"
                style={{ minHeight: 150 }}
              >
                <div className="text-sm font-medium text-slate-600 mb-2 text-center">
                  {stat.label}
                </div>
                <div className="text-[60px] font-bold text-sky-700 leading-none text-center">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-sky-50">
              <h3 className="text-base font-semibold text-slate-800 text-center">
                Medicamentos Próximos do Vencimento
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-sky-100">
                    <th className="px-3 py-2 text-center font-semibold text-slate-800">
                      Medicamento
                    </th>
                    <th className="px-3 py-2 text-center font-semibold text-slate-800">
                      Princípio Ativo
                    </th>
                    <th className="px-3 py-2 text-center font-semibold text-slate-800">
                      Quantidade
                    </th>
                    <th className="px-3 py-2 text-center font-semibold text-slate-800">
                      Validade
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {expiringMedicines.map((med, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-100 hover:bg-sky-50 transition-colors"
                    >
                      <td className="px-3 py-2 text-center text-xs text-slate-700">
                        {med.name}
                      </td>
                      <td className="px-3 py-2 text-center text-xs text-slate-700">
                        {med.substance}
                      </td>
                      <td className="px-3 py-2 text-center text-xs text-slate-700">
                        {med.quantity}
                      </td>
                      <td className="px-3 py-2 text-center text-xs text-slate-700">
                        {new Date(med.expiry).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-sky-50">
              <h3 className="text-base font-semibold text-slate-800 text-center">
                Movimentações Recentes
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-sky-100">
                    <th className="px-2 py-2 text-center font-semibold text-slate-800 text-xs">
                      Medicamento
                    </th>
                    <th className="px-2 py-2 text-center font-semibold text-slate-800 text-xs">
                      Tipo
                    </th>
                    <th className="px-2 py-2 text-center font-semibold text-slate-800 text-xs">
                      Operador
                    </th>
                    <th className="px-2 py-2 text-center font-semibold text-slate-800 text-xs">
                      Casela
                    </th>
                    <th className="px-2 py-2 text-center font-semibold text-slate-800 text-xs">
                      Quantidade
                    </th>
                    <th className="px-2 py-2 text-center font-semibold text-slate-800 text-xs">
                      Paciente
                    </th>
                    <th className="px-2 py-2 text-center font-semibold text-slate-800 text-xs">
                      Validade
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentMovements.map((mov, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-100 hover:bg-sky-50 transition-colors"
                    >
                      <td className="px-2 py-2 text-center text-xs text-slate-700">
                        {mov.name}
                      </td>
                      <td className="px-2 py-2 text-center text-xs text-slate-700">
                        {mov.type}
                      </td>
                      <td className="px-2 py-2 text-center text-xs text-slate-700">
                        {mov.operator}
                      </td>
                      <td className="px-2 py-2 text-center text-xs text-slate-700">
                        {mov.casela ?? "-"}
                      </td>
                      <td className="px-2 py-2 text-center text-xs text-slate-700">
                        {mov.quantity}
                      </td>
                      <td className="px-2 py-2 text-center text-xs text-slate-700">
                        {mov.patient ?? "-"}
                      </td>
                      <td className="px-2 py-2 text-center text-xs text-slate-700">
                        {mov.expiry
                          ? new Date(mov.expiry).toLocaleDateString("pt-BR")
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center">
            <h4 className="text-base font-semibold text-slate-800 text-center mb-6">
              Quantidade de Itens por Armário
            </h4>

            <div className="w-full h-72 flex justify-left items-left">
              <ResponsiveContainer width="92%" height="100%">
                <BarChart
                  data={cabinetStockData}
                  layout="vertical"
                  margin={{ top: 20, right: 40, left: 40, bottom: 10 }}
                >
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12, fill: "#1e293b" }}
                    axisLine={{ stroke: "#475569", strokeWidth: 1.2 }}
                    tickLine={{ stroke: "#475569" }}
                  />

                  <YAxis
                    type="category"
                    dataKey="cabinet"
                    tick={{ fontSize: 13, fill: "#1e293b" }}
                    width={90}
                    axisLine={{ stroke: "#475569", strokeWidth: 1.2 }}
                    tickLine={{ stroke: "#475569" }}
                  />

                  <defs>
                    <linearGradient id="barFill" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0284c7" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#0369a1" stopOpacity={1} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke="#cbd5e1"
                  />

                  <Bar
                    dataKey="total"
                    fill="url(#barFill)"
                    barSize={28}
                    radius={[0, 6, 6, 0]}
                    isAnimationActive={true}
                    animationBegin={100}
                    animationDuration={1600}
                    animationEasing="ease-in-out"
                    label={{
                      position: "right",
                      fill: "#334155",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center">
            <h4 className="text-base font-semibold text-slate-800 text-center mb-6">
              Proporção de Estoque
            </h4>
            <div className="flex flex-col lg:flex-row justify-center items-center gap-6 w-full">
              <div className="w-full lg:w-1/2 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stockDistribution}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                      activeIndex={activePieIndex ?? undefined}
                      activeShape={renderActiveShape}
                      onMouseEnter={(_, index) => setActivePieIndex(index)}
                      onMouseLeave={() => setActivePieIndex(null)}
                      isAnimationActive={true}
                      animationDuration={1000}
                      label={false}
                    >
                      {stockDistribution.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any, name: string, props: any) => {
                        const { payload } = props;
                        return [`${payload.rawValue}`, "Quantidade"];
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col text-sm text-slate-700 space-y-2">
                {stockDistribution.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[i] }}
                    ></span>
                    <span>
                      {item.name}: <b>{item.value}%</b>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
