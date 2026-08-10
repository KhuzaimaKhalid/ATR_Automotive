import { Search, LogOut, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const POSHeader = ({
  pages = [],
  selectedPageId,
  onSelectPage,
  searchTerm,
  onSearchChange,
}) => {
  const navigate = useNavigate();

  const activePageIndex = pages.findIndex(
    (p) => String(p.id) === String(selectedPageId)
  );
  const activePage = pages[activePageIndex] || pages[0];

  const handlePrevPage = () => {
    if (pages.length === 0) return;
    const prevIdx = (activePageIndex - 1 + pages.length) % pages.length;
    onSelectPage(pages[prevIdx].id);
  };

  const handleNextPage = () => {
    if (pages.length === 0) return;
    const nextIdx = (activePageIndex + 1) % pages.length;
    onSelectPage(pages[nextIdx].id);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <header className="w-full h-[90px] bg-white border-b border-black/20 flex items-center justify-between px-8 shrink-0 gap-6">
      {/* 1. Left: Logo & Powered By Info */}
      <div className="flex items-center gap-4 shrink-0">
        <img src={logo} alt="ATR Logo" className="w-12 h-12 object-contain" />
        <div className="leading-tight hidden sm:block">
          <p className="text-[10px] font-bold text-black/60 tracking-wider">
            POWERED BY
          </p>
          <p className="text-xs font-extrabold text-[#CD051F]">TRUST NEXUS</p>
          <p className="text-[11px] font-medium text-black/80">0303-8184136</p>
        </div>
      </div>

      {/* 2. Page Switcher Menu (Prev / Active Page Name / Next) */}
      <div className="flex items-center gap-2 border-r border-l border-slate-200 px-4">
        <button
          onClick={handlePrevPage}
          disabled={pages.length <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-md bg-[#151B26] text-white hover:bg-[#20293b] disabled:opacity-30 disabled:cursor-not-allowed transition"
          title="Previous Page"
        >
          <ArrowLeft size={16} />
        </button>

        <span className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide min-w-[100px] text-center px-2">
          {activePage ? activePage.name : "PAGE"}
        </span>

        <button
          onClick={handleNextPage}
          disabled={pages.length <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-md bg-[#CD051F] text-white hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
          title="Next Page"
        >
          <ArrowRight size={16} />
        </button>
      </div>

      {/* 3. Center Title */}
      <div className="flex items-center gap-2">
        <span className="text-[#CD051F] font-extrabold text-2xl lg:text-3xl tracking-tight">
          ATR
        </span>
        <span className="text-black font-extrabold text-2xl lg:text-3xl tracking-wider">
          AUTOMOTIVE
        </span>
      </div>

      {/* 4. Right: Search & Logout Button */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="relative w-[200px] sm:w-[260px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search parts by name..."
            className="w-full border border-slate-300 rounded-lg pl-4 pr-10 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#CD051F] transition"
          />
          <Search
            size={18}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>

        <button
          onClick={handleLogout}
          className="bg-[#CD051F] hover:bg-red-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-md transition shadow-sm flex items-center gap-1.5"
        >
          <LogOut size={14} />
          LOGOUT
        </button>
      </div>
    </header>
  );
};

export default POSHeader;