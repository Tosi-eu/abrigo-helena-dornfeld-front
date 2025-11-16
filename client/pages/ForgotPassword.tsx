import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import logo from "/logo.png";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [users, setUsers] = useState<Array<{ id: number; login: string }>>([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/login/emails/all");
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      toast({ title: "Erro", description: "Erro ao buscar lista de usuários", variant: "error" });
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmail || !newPassword) {
      return toast({ title: "Erro", description: "Selecione um e-mail e defina uma nova senha", variant: "error" });
    }

    setLoading(true);
    try {
      const res = await fetch("/api/login/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: selectedEmail, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erro ao resetar senha");

      toast({ title: "Sucesso!", description: "Senha redefinida. Faça login com a nova senha", variant: "success" });
      setSelectedEmail("");
      setNewPassword("");
      setTimeout(() => navigate("/user/login"), 2000);
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <img src={logo} alt="Logo" className="h-20 w-auto" />
              <h1 className="text-lg md:text-xl font-semibold text-slate-900 hidden md:block">
                Abrigo Helena Dornfeld
              </h1>
            </div>
            <div />
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-800 text-center mb-2">Redefinir Senha</h2>
            <p className="text-sm text-slate-600 text-center mb-6">
              Selecione seu e-mail e defina uma nova senha
            </p>

            {loadingUsers ? (
              <div className="text-center py-8 text-slate-500">Carregando usuários...</div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Selecione seu e-mail
                  </label>
                  <select
                    id="email"
                    value={selectedEmail}
                    onChange={(e) => setSelectedEmail(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white"
                    required
                  >
                    <option value="">-- Escolha um e-mail --</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.login}>
                        {user.login}
                      </option>
                    ))}
                  </select>
                  {users.length === 0 && !loadingUsers && (
                    <p className="text-xs text-slate-500 mt-1">Nenhum usuário encontrado</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Nova Senha
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white"
                    placeholder="••••••••••••"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-semibold transition-shadow shadow-sm disabled:opacity-50"
                  >
                    {loading ? "Processando..." : "Redefinir Senha"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/user/login")}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium"
                  >
                    Voltar
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Abrigo Helena Dornfeld
          </div>
        </div>
      </main>
    </div>
  );
}
