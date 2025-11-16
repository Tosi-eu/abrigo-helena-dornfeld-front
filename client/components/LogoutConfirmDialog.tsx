import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

export interface LogoutConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmDialog({
  open,
  onCancel,
  onConfirm,
}: LogoutConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      sx={{
        "& .MuiDialog-paper": {
          padding: 2,
          minWidth: 300,
          fontFamily: "'Inter', sans-serif",
        },
      }}
    >
      <DialogTitle sx={{ fontSize: 18, fontWeight: 600 }}>
        Confirmar Logout
      </DialogTitle>
      <DialogContent sx={{ py: 2 }}>
        <DialogContentText sx={{ fontSize: 14, color: "#475569" }}>
          Tem certeza que deseja fazer logout? Você precisará fazer login novamente para acessar o sistema.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 1 }}>
        <Button onClick={onCancel} color="inherit" size="small">
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          color="warning"
          size="small"
          variant="contained"
        >
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
}
