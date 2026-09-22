import { Link } from "react-router-dom";
import { useState } from "react";
import { ShoppingBag, Users, ArrowRight } from "lucide-react";
import { Rol } from "../interfaces/generales/interfaces-generales";
import { getRoles } from "../utils/auth";

const userRoles: number[] = getRoles();

const accesos = [
  {
    label: "Productos",
    icon: ShoppingBag,
    path: "/admin/producto",
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
    shadowColor: "hover:shadow-blue-500/50",
    roles: [Rol.ADMINISTRADOR, Rol.VENDEDOR, Rol.REPOSITOR, Rol.REPARTIDOR, Rol.ROOT],
  },
  {
    label: "Clientes",
    icon: Users,
    path: "/admin/cliente",
    color: "bg-purple-500",
    hoverColor: "hover:bg-purple-600",
    shadowColor: "hover:shadow-purple-500/50",
    roles: [Rol.ADMINISTRADOR, Rol.VENDEDOR, Rol.COBRADOR, Rol.REPARTIDOR, Rol.ROOT],
  },
  {
    label: "Proveedores",
    icon: Users,
    path: "/admin/proveedor",
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
    shadowColor: "hover:shadow-blue-500/50",
    roles: [Rol.ADMINISTRADOR, Rol.ROOT],
  },
];

const DashboardHome = () => {
  const [certVisible] = useState<boolean>(() => localStorage.getItem("afip-cert-visible") !== "false");

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {accesos
            .filter((item) => item.roles.some((role) => userRoles.includes(role)))
            .map(({ label, icon: Icon, path, color, hoverColor, shadowColor }, index) => (
              <Link
                key={label}
                to={path}
                className="group relative min-h-[220px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ animationDelay: `${index * 100}ms`, animation: "slideUp 0.5s ease-out forwards", opacity: 0 }}
              >
                <div className={`absolute inset-0 ${color} opacity-0 transition-opacity duration-300 group-hover:opacity-[0.04]`} />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <div className={`rounded-xl p-4 text-white shadow-lg transition-all duration-300 group-hover:scale-105 ${color} ${hoverColor} ${shadowColor}`}>
                      <Icon size={28} strokeWidth={2.5} />
                    </div>
                    <ArrowRight size={22} className="text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-slate-600" />
                  </div>
                  <h3 className="mt-auto pt-8 text-2xl font-bold text-slate-800 transition-colors group-hover:text-slate-950">{label}</h3>
                  <div className="mt-4 h-1 w-10 rounded-full bg-slate-200 transition-all duration-500 group-hover:w-full" />
                </div>
              </Link>
            ))}
        </div>
      </div>
      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

export default DashboardHome;
