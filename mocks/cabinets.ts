import { CabinetCategory } from "@/enums/enums";
import { Cabinet } from "@/interfaces/interfaces";

export const cabinets: Cabinet[] = [
  {
    id: 1,
    category: CabinetCategory.PSICOTROPICOS_E_INJECOES,
    description: "Armário de medicamentos controlados",
  },
  {
    id: 2,
    category: CabinetCategory.MEDICAMENTOS_DOADOS,
    description: "Medicamentos doados mês passado",
  },
  {
    id: 3,
    category: CabinetCategory.DIVERSOS,
    description: "Documentos administrativos",
  },
  {
    id: 4,
    category: CabinetCategory.MEDICACAO_GERAL,
    description: "Medicamentos de uso geral",
  },
  {
    id: 5,
    category: CabinetCategory.DIVERSOS,
    description: "Outros materiais e suprimentos diversos",
  },
];
