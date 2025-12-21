# abrigo-helena-dornfeld-front

## Como utilizar

1. **Instale as dependências**

   ```bash
   pnpm install
   ```
   Isso instalará todas as dependências necessárias do projeto.

2. **Configure as credenciais do banco**

> Configure as credenciais de acesso do postgres no .env
   ```bash
   NODE_ENV="production ou development"
   DB_USER='<SEU_USER>'
   DB_PASSWORD='<SUA_SENHA>'
   DB_HOST='<HOST>' --locahost ou outro domínio
   DB_NAME='<NOME_DATABASE>'
   ```
 É possível também acessar o banco passando a url completa no .env, em vez de fornecer os dados seperadamente
   ```bash
      HML_DATABASE_URL=postgresql://usuario:senha@dominio:porta/nome_db
      PROD_DATABASE_URL=postgresql://usuario:senha@dominio:porta/nome_db
   ```
> Detalhe: o banco de dados pode ser acessado por container docker também. Executando **docker compose up** já sobe o container com o banco, podendo acessar pelas configurações passadas no .env

3. **Execute o projeto**

   Após a configuração do banco, use os scripts disponíveis (por exemplo):

   ```bash
   npm run dev
   npm run dev:server
   ```

   > Consulte o `package.json` para ver todos os scripts disponíveis.
---

## Estrutura de Branches

O repositório segue uma estrutura simples e padronizada de branches:

| Branch     | Função                                | Permissão de Push           |
| ---------- | ------------------------------------- | --------------------------- |
| **main**   | Versão estável do código em produção  | Protegida (sem push direto) |
| **dev**    | Ambiente principal de desenvolvimento | Via Pull Request            |
| **hotfix** | Correções urgentes e pontuais         | Via Pull Request            |

---

## Regras de Push e Pull Requests

- Nenhum push direto é permitido na branch **main**.
- Todo código deve ser enviado via **Pull Request (PR)**.
- As PRs podem ter origem:
  - da branch **dev**, para desenvolvimento normal;
  - ou da branch **hotfix**, para correções urgentes.

> ⚠️ Somente PRs aprovadas e revisadas podem ser mescladas na `main`.

---

## Fluxo de Desenvolvimento

```mermaid
gitGraph
   commit id: "main"
   branch dev
   commit id: "dev"
   branch hotfix
   commit id: "hotfix"
   checkout dev
   merge hotfix id: "merge hotfix → dev"
   checkout main
   merge dev id: "merge dev → main"
```

---

## Observações

- sempre dê pull na branch **main**
- Sempre crie uma nova branch local a partir de **dev** antes de iniciar uma feature.
- Commits devem ser descritivos e seguir boas práticas de versionamento.

---

## Requisitos

- Node.js (versão compatível com o projeto)
- pnpm (para gerenciamento de dependências)
- Docker (para usar o banco de homolog)
- PostgreSQL (para rodar o banco local)

---
