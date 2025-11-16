import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";

interface RowData {
  nome?: string;
  principio_ativo?: string;
  quantidade?: number;
  validade?: string;
  residente?: string;
  num_casela?: number;
  medicamento?: string;
  armario_id?: number;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    paddingBottom: 4,
    marginBottom: 4,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
  },
  cell: {
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: "right",
    fontSize: 10,
    color: "#555",
  },
  striped: {
    backgroundColor: "#f5f5f5",
  },
});

function formatDate(value?: string | Date) {
  if (!value) return "N/A";
  const d = value instanceof Date ? value : new Date(value);
  return d.toLocaleDateString("pt-BR");
}

export function createStockPDF(tipo: string, data: RowData[]) {
  const headers =
    tipo === "medicamentos"
      ? ["Nome", "Princípio Ativo", "Quantidade", "Validade", "Residente"]
      : ["Nome", "Quantidade", "Armário"];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src="http://localhost:8080/logo.png" style={styles.logo} /> 
          <Text style={styles.title}>Relatório de {tipo}</Text>
        </View> 

        <View style={styles.tableHeader}>
          {headers.map((h, i) => (
            <Text key={i} style={styles.cell}>
              {h}
            </Text>
          ))}
        </View>

        {data.map((row, idx) => (
          <View
            key={idx}
            style={[styles.tableRow, idx % 2 === 0 ? styles.striped : undefined]}
          >
            {tipo === "medicamentos" ? (
              <>
                <Text style={styles.cell}>{row.nome || ""}</Text>
                <Text style={styles.cell}>{row.principio_ativo || ""}</Text>
                <Text style={styles.cell}>{row.quantidade?.toString() || "0"}</Text>
                <Text style={styles.cell}>{formatDate(row.validade)}</Text>
                <Text style={styles.cell}>{row.residente || "Geral"}</Text>
              </>
            ) : (
              <>
                <Text style={styles.cell}>{row.nome || ""}</Text>
                <Text style={styles.cell}>{row.quantidade?.toString() || "0"}</Text>
                <Text style={styles.cell}>{row.armario_id?.toString() || "-"}</Text>
              </>
            )}
          </View>
        ))}

        <Text style={styles.footer}>
          Gerado em: {new Date().toLocaleDateString("pt-BR")} às{" "}
          {new Date().toLocaleTimeString("pt-BR")}
        </Text>
      </Page>
    </Document>
  );
}
