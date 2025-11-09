import { AuthContextType, LoggedUser } from "@/interfaces/interfaces";
import { createContext, useState, ReactNode, useEffect } from "react";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LoggedUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (login: string, password: string) => {
    const res = await fetch(
      `http://localhost:3001/api/login?login=${login}&password=${password}`,
    );
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Erro ao fazer login");

    const loggedUser = { id: data.id, login: data.login };
    setUser(loggedUser);
    localStorage.setItem("user", JSON.stringify(loggedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
