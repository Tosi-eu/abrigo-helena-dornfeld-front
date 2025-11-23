import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useState, useEffect } from "react";

interface Props {
  open: boolean;
  origin?: number;
  onCancel: () => void;
  onConfirm: (destinos: {
    destinoMedicamentos?: number;
    destinoInsumos?: number;
  }) => void;
  stockInfo?: { hasMedicineStock: boolean; hasInputStock: boolean };
  armarios?: number[];
}

export default function CabinetRelocationModal({
  open,
  origin,
  onCancel,
  onConfirm,
  stockInfo = { hasMedicineStock: false, hasInputStock: false },
  armarios = [],
}: Props) {
  const [destinos, setDestinos] = useState<{
    destinoMedicamentos?: number;
    destinoInsumos?: number;
  }>({});

  useEffect(() => {
    if (!open) return;
    setDestinos({});
  }, [open]);

  if (!origin) return null;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          padding: 5,
          borderRadius: 2,
          fontFamily: "'Inter', sans-serif",
        },
      }}
    >
      <DialogTitle sx={{ fontSize: 22, fontWeight: 600, mb: 1 }}>
        Remanejamento de Estoque
      </DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}
      >
        <p style={{ fontSize: 14, color: "#555" }}>
          O armário {origin} contém itens em estoque. É necessário remanejá-los
          antes de continuar.
        </p>

        <FormControl fullWidth>
          <InputLabel
            sx={{
              fontSize: 14,
              "&.MuiInputLabel-shrink": {
                transform: "translate(2px, -20px)",
              },
            }}
          >
            Armário Origem
          </InputLabel>
          <Select value={origin} disabled>
            <MenuItem value={origin}>{origin}</MenuItem>
          </Select>
        </FormControl>

        {stockInfo.hasMedicineStock && (
          <FormControl fullWidth>
            <InputLabel
              sx={{
                fontSize: 14,
                "&.MuiInputLabel-shrink": {
                  transform: "translate(2px, -20px)",
                },
              }}
            >
              Armário Destino - Medicamentos
            </InputLabel>
            <Select
              value={destinos.destinoMedicamentos ?? ""}
              onChange={(e) =>
                setDestinos({
                  ...destinos,
                  destinoMedicamentos: Number(e.target.value),
                })
              }
            >
              {armarios.length === 0 && (
                <MenuItem disabled>Nenhum armário disponível</MenuItem>
              )}
              {armarios.map((num) => (
                <MenuItem key={`med-${num}`} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {stockInfo.hasInputStock && (
          <FormControl fullWidth>
            <InputLabel
              sx={{
                fontSize: 14,
                "&.MuiInputLabel-shrink": {
                  transform: "translate(2px, -20px)",
                },
              }}
            >
              Armário Destino - Insumos
            </InputLabel>
            <Select
              value={destinos.destinoInsumos ?? ""}
              onChange={(e) =>
                setDestinos({
                  ...destinos,
                  destinoInsumos: Number(e.target.value),
                })
              }
            >
              {armarios.length === 0 && (
                <MenuItem disabled>Nenhum armário disponível</MenuItem>
              )}
              {armarios.map((num) => (
                <MenuItem key={`ins-${num}`} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", gap: 2, mt: 4 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{ minWidth: 110, minHeight: 45, fontWeight: 500 }}
        >
          Cancelar
        </Button>
        <Button
          onClick={() => onConfirm(destinos)}
          color="error"
          variant="contained"
          sx={{ minWidth: 110, minHeight: 45, fontWeight: 500 }}
          disabled={
            stockInfo.hasMedicineStock &&
            !destinos.destinoMedicamentos &&
            stockInfo.hasInputStock &&
            !destinos.destinoInsumos
          }
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
