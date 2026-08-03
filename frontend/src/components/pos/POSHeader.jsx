import { Clock, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useLiveClock from "../../hooks/useLiveClock";
import logo from "../../assets/logo.png";

const POSHeader = ({ searchTerm, onSearchChange }) => {
  const { time, day, date } = useLiveClock();
  const navigate = useNavigate();

  return (
    <header className="w-full h-[90px] bg-white border-b border-black/20 flex items-center justify-between px-8 shrink-0 gap-6">
      <div className="flex items-center gap-3 shrink-0">
        <img src={logo} alt="ATR Logo" className="w-12 h-12 object-contain" />
        <div className="flex items-baseline gap-2 leading-none">
          <span className="text-[#CD051F] font-extrabold text-2xl lg:text-3xl tracking-tight">
            ATR
          </span>
          <span className="text-black font-extrabold text-xl lg:text-2xl tracking-wider">
            AUTOMOTIVE
          </span>
        </div>
      </div>

      <div className="relative flex-1 max-w-[500px]">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search parts by name..."
          className="w-full border border-slate-300 rounded-lg pl-4 pr-10 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#CD051F] transition"
        />
        <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>

      <div className="hidden md:flex items-center gap-3 pl-6 border-l border-black/20 shrink-0">
        <Clock size={24} className="text-black/80" strokeWidth={1.8} />
        <div className="leading-tight">
          <p className="text-sm font-bold text-black">{time}</p>
          <p className="text-xs font-semibold text-black/70">{day}</p>
          <p className="text-xs text-black/60">{date}</p>
        </div>
      </div>

      <div className="flex items-center gap-6 shrink-0">
        <div className="text-right leading-tight hidden lg:block">
          <p className="text-[10px] font-bold text-black/60 tracking-wider">POWERED BY</p>
          <p className="text-xs font-extrabold text-[#CD051F]">TRUST NEXUS</p>
          <p className="text-[11px] font-medium text-black/80">0303-8184136</p>
        </div>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="bg-[#CD051F] hover:bg-red-700 text-white text-xs font-extrabold px-4 py-2 rounded-md transition shadow-sm"
        >
          ADMIN LOGIN
        </button>
      </div>
    </header>
  );
};

export default POSHeader;