import { Link, useLocation } from "react-router-dom";
import logo from "/logo.png";
import { LayoutProps } from "@/interfaces/interfaces";

export default function Layout({ children, title }: LayoutProps) {
  const location = useLocation();

  const navigation = [
    { name: "Painel", href: "/dashboard" },
    { name: "Movimentações", href: "/transactions" },
    { name: "Medicamentos", href: "/medicines" },
    { name: "Insumos", href: "/inputs" },
    { name: "Estoque", href: "/stock" },
    { name: "Residentes", href: "/residents" },
    { name: "Armários", href: "/cabinets" },
    { name: "Perfil", href: "/user/profile" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <header className="bg-sky-50 border-b border-slate-200 shadow-sm relative z-20">
        <div className="max-w-[1651px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/dashboard">
              <img
                src={logo}
                alt="Logo"
                className="h-20 w-auto drop-shadow-sm"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navigation.map((item) => {
                const isActive =
                  location.pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    location.pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-base px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "text-sky-700 bg-sky-100 font-semibold"
                        : "text-slate-700 hover:text-sky-700 hover:bg-sky-50"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {title && (
        <div className="max-w-[1651px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
        </div>
      )}

      <main className="max-w-[1651px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {children}
      </main>
    </div>
  );
}
