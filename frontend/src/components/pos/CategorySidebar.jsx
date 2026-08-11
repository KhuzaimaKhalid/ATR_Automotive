import {
  ChevronRight,
  LayoutGrid,
  Cog,
  CircleDot,
  Waves,
  Filter,
  BatteryCharging,
  Car,
  Droplet,
  Wrench,
  Package,
  X,
} from "lucide-react";

const ICON_RULES = [
  { match: /engine/i, icon: Cog },
  { match: /brake/i, icon: CircleDot },
  { match: /suspension/i, icon: Waves },
  { match: /filter/i, icon: Filter },
  { match: /electric/i, icon: BatteryCharging },
  { match: /body/i, icon: Car },
  { match: /oil|fluid/i, icon: Droplet },
  { match: /accessor/i, icon: Wrench },
];

const getIconFor = (name) => {
  const rule = ICON_RULES.find((r) => r.match.test(name));
  return rule ? rule.icon : Package;
};

const CategorySidebar = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  mobileOpen,
  onClose,
}) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-[260px] bg-[#151B26] flex flex-col py-4 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:min-h-[calc(100vh-90px)] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Header with Close Icon */}
        <div className="flex items-center justify-between px-4 mb-3 lg:hidden">
          <span className="text-white font-extrabold text-base tracking-wider">
            CATEGORIES
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        <button
          onClick={() => {
            onSelectCategory(null);
            onClose();
          }}
          className={`mx-4 mb-3 flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition ${
            selectedCategoryId === null
              ? "bg-[#CD051F] text-white shadow-md"
              : "text-slate-300 hover:bg-white/5 hover:text-white"
          }`}
        >
          <LayoutGrid size={20} strokeWidth={2} />
          <span>All Categories</span>
        </button>

        <nav className="px-4 flex flex-col gap-1.5 overflow-y-auto flex-1">
          {categories.map((cat) => {
            const Icon = getIconFor(cat.name);
            const isActive = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onClose();
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#5c1017] text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={20} strokeWidth={2} />
                  {cat.name}
                </span>
                <ChevronRight size={16} className="text-slate-500" />
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default CategorySidebar;