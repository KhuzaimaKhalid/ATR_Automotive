import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useLiveClock from "../../hooks/useLiveClock";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

const AdminHeader = () => {
  const { time, day, date } = useLiveClock();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="w-full h-[90px] bg-white border-b border-black/20 flex items-center justify-between px-8 shrink-0">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="ATR Logo" className="w-12 h-12 object-contain" />
        <div className="flex items-baseline gap-2 leading-none">
          <span className="text-[#CD051F] font-extrabold text-3xl lg:text-4xl tracking-tight">
            ATR
          </span>
          <span className="text-black font-extrabold text-2xl lg:text-3xl tracking-wider">
            AUTOMOTIVE
          </span>
        </div>
      </div>

      {/* Live Clock Widget */}
      <div className="hidden md:flex items-center gap-3 pl-6 border-l border-black/20">
        <Clock size={28} className="text-black/80" strokeWidth={1.8} />
        <div className="leading-tight text-right md:text-left">
          <p className="text-sm font-bold text-black">{time}</p>
          <p className="text-xs font-semibold text-black/70">{day}</p>
          <p className="text-xs text-black/60">{date}</p>
        </div>
      </div>

      {/* Brand Attribution & Logout */}
      <div className="flex items-center gap-6">
        <div className="text-right leading-tight">
          <p className="text-[10px] font-bold text-black/60 tracking-wider">
            POWERED BY
          </p>
          <p className="text-xs font-extrabold text-[#CD051F]">
            TRUST NEXUS
          </p>
          <p className="text-[11px] font-medium text-black/80">
             0303-8184136
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-[#CD051F] hover:bg-red-700 text-white text-xs font-extrabold px-4 py-2 rounded-md transition shadow-sm"
        >
          ADMIN LOGOUT
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;