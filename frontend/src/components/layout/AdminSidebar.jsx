import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutGrid,
  Package,
  ShoppingCart,
  ClipboardList,
  User,
  ArrowLeft,
} from "lucide-react";
import carImg from "../../assets/car.png";

const navItems = [
  { label: "Dashboard", icon: LayoutGrid, path: "/admin/dashboard" },
  {
    label: "Manage Product",
    icon: Package,
    path: "/admin/products",
    children: [
      { label: "Product", path: "/admin/products" },
      { label: "Categories", path: "/admin/products/categories" },
    ],
  },
  {
    label: "Sales",
    icon: ShoppingCart,
    path: "/admin/sales",
    children: [
      { label: "Sales History", path: "/admin/sales/history" },
      { label: "Returns/Refunds", path: "/admin/sales/returns" },
    ],
  },
  {
    label: "Reports",
    icon: ClipboardList,
    path: "/admin/reports",
    children: [
      { label: "Sales Report", path: "/admin/reports/sales" },
      { label: "Product Report", path: "/admin/reports/products" },
      { label: "Profit Report", path: "/admin/reports/profit" },
      { label: "Stock Report", path: "/admin/reports/stock" },
    ],
  },
  // In AdminSidebar.jsx
{ label: "User", icon: User, path: "/admin/user" },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const next = {};
    navItems.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some((c) =>
          location.pathname.startsWith(c.path)
        );
        if (isChildActive) next[item.label] = true;
      }
    });
    setExpanded((prev) => ({ ...prev, ...next }));
  }, [location.pathname]);

  const toggleExpand = (label) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="w-[260px] shrink-0 bg-[#151B26] flex flex-col justify-between py-6 min-h-[calc(100vh-90px)]">
      <nav className="px-4 flex flex-col gap-2">
        {navItems.map(({ label, icon: Icon, path, children }) => {
          const isParentActive = location.pathname.startsWith(path);
          const isOpen = !!expanded[label];

          if (!children) {
            return (
              <NavLink
                key={label}
                to={path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold transition ${
                  isParentActive
                    ? "bg-[#CD051F] text-white shadow-md"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={20} strokeWidth={2} />
                <span>{label}</span>
              </NavLink>
            );
          }

          return (
            <div key={label} className="flex flex-col">
              <button
                onClick={() => {
                  toggleExpand(label);
                  navigate(path)
                }}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold transition w-full text-left ${
                  isParentActive
                    ? "bg-[#CD051F] text-white shadow-md"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={20} strokeWidth={2} />
                <span>{label}</span>
              </button>

              {isOpen && (
                <div className="mt-1 ml-5 pl-4 border-l border-white/10 flex flex-col gap-1">
                  {children.map((child) => {
                    const isChildActive = location.pathname === child.path;
                    return (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition ${
                          isChildActive ? "text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 transition ${
                            isChildActive ? "bg-[#CD051F]" : "bg-slate-500"
                          }`}
                        />
                        {child.label}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="px-4 flex flex-col gap-6 items-center">
        <img
          src={carImg}
          alt="ATR Asset"
          className="w-full max-w-[210px] object-contain drop-shadow-xl pointer-events-none select-none"
        />
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-center gap-2 bg-transparent border border-white/20 rounded-lg py-2.5 text-white text-xs font-semibold hover:bg-white/10 transition"
        >
          <ArrowLeft size={16} />
          Back to POS
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;