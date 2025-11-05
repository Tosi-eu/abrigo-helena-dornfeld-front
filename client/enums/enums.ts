export enum OperationType {
  MEDICINE = "Medicamento",
  INPUT = "Insumo",
}

export enum OriginType {
  FAMILIA = "Família",
  AUTOCUSTO = "Autocusto",
  UBS = "UBS",
  FARMACIA_POPULAR = "Farmácia Popular",
}

export enum EntryType {
  COMPRA = "Compra",
  DOACAO = "Doação",
  REPOSICAO = "Reposição",
}

export enum CabinetCategory {
  MEDICACAO_GERAL = "Medicação geral",
  PSICOTROPICOS_E_INJECOES = "Psicotrópicos e injeções",
  MEDICAMENTOS_DOADOS = "Medicamentos doados / Fitas / Dersane / Clorexidina",
  DIVERSOS = "Lactulose / Hipratrópio / Pomadas / Domperidona / Materiais de glicemia",
}

export enum StockCategory {
  MEDICINE = "Medicamento",
  INPUT = "Insumo",
}

export enum StockType {
  GERAL = "geral",
  INDIVIDUAL = "individual",
}

export enum TransactionType {
  COMPRA = "Compra",
  DOACAO = "Doação",
  REPOSICAO = "Reposição",
}

export enum MovementType {
  IN = "entrada",
  OUT = "saida",
}