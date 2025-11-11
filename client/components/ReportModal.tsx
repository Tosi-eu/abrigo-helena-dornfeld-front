import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Package, Stethoscope, Check, X, Loader2 } from "lucide-react";

type StatusType = "idle" | "loading" | "success" | "error";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ReportModal({ open, onClose }: ReportModalProps) {
  const [status, setStatus] = useState<StatusType>("idle");
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  const reportOptions = [
    { value: "insumos", label: "Insumos", icon: Package },
    { value: "medicamentos", label: "Medicamentos", icon: Stethoscope },
    {
      value: "insumos_medicamentos",
      label: "Insumos e Medicamentos",
      icon: Check,
    },
  ];

  const handleSelectReport = (value: string) => setSelectedReports([value]);

  const handleGenerate = () => {
    if (!selectedReports.length) return;
    setStatus("loading");

    setTimeout(() => {
      const isSuccess = Math.random() > 0.2;
      setStatus(isSuccess ? "success" : "error");
    }, 1500);
  };

  const handleClose = () => {
    setStatus("idle");
    setSelectedReports([]);
    onClose();
  };

  const iconSize = 100;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="p-0 bg-white rounded-2xl shadow-xl max-w-md w-full flex flex-col items-center">
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="p-6 w-full flex flex-col items-center"
            >
              <DialogHeader className="w-full relative mb-4">
                <DialogTitle className="text-xl font-semibold text-gray-800 text-center">
                  Gerar Relatório
                </DialogTitle>
              </DialogHeader>

              <div className="w-full flex flex-col gap-3">
                {reportOptions.map(({ value, label, icon: Icon }) => (
                  <div
                    key={value}
                    className={`border-2 rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all ${
                      selectedReports.includes(value)
                        ? "border-sky-600 bg-sky-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleSelectReport(value)}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        selectedReports.includes(value)
                          ? "text-sky-600"
                          : "text-gray-500"
                      }`}
                    />
                    <p
                      className={`text-sm font-medium ${
                        selectedReports.includes(value)
                          ? "text-sky-700"
                          : "text-gray-700"
                      }`}
                    >
                      {label}
                    </p>
                  </div>
                ))}

                <div className="mt-6 flex justify-center">
                  <Button
                    className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition disabled:opacity-50"
                    disabled={selectedReports.length === 0}
                    onClick={handleGenerate}
                  >
                    Gerar
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {status === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-10 flex flex-col items-center justify-center gap-3 h-60"
            >
              <Loader2 className="w-12 h-12 animate-spin text-sky-600" />
              <p className="text-gray-600 font-medium text-center">
                Gerando...
              </p>
            </motion.div>
          )}

          {(status === "success" || status === "error") && (
            <motion.div
              key={status}
              className="flex flex-col items-center justify-center h-72 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.1, 1], opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {status === "success" ? (
                  <Check
                    className="text-green-600"
                    style={{ width: iconSize, height: iconSize }}
                  />
                ) : (
                  <X
                    className="text-red-600"
                    style={{ width: iconSize, height: iconSize }}
                  />
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="mt-6 flex flex-col items-center gap-4"
              >
                <p className="font-bold text-xl text-center">
                  {status === "success"
                    ? "Relatório gerado com sucesso!"
                    : "Falha ao gerar relatório!"}
                </p>
                <Button
                  className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white"
                  onClick={handleClose}
                >
                  OK
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
