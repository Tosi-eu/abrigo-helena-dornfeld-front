import { createServer } from "./index";

const app = createServer();
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);
});
