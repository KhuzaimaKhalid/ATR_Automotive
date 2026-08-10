import { useState } from "react";
import { Package, ArrowLeft, ArrowRight } from "lucide-react";

const PRODUCTS_PER_PAGE = 15;

const ProductGrid = ({ products, loading, onAddToCart }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-slate-400 py-20">
        Loading products...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-slate-400 py-20">
        No products found.
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);
  const startIdx = (activePage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = products.slice(startIdx, startIdx + PRODUCTS_PER_PAGE);

  return (
    <div className="flex flex-col gap-4">
      {/* Top Product Pagination Controls */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-2">
        <span className="text-xs font-bold text-slate-600">
          Page {activePage} of {totalPages} ({products.length} Items)
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={activePage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#151B26] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#20293b] transition"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={activePage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#CD051F] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-700 transition"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        {paginatedProducts.map((product) => {
          const outOfStock = product.stock_quantity === 0;
          return (
            <button
              key={product.id}
              onClick={() => !outOfStock && onAddToCart(product)}
              disabled={outOfStock}
              className={`bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center shadow-sm transition ${
                outOfStock
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:border-[#CD051F] hover:shadow-md"
              }`}
            >
              <div className="w-20 h-20 rounded-lg bg-slate-50 flex items-center justify-center mb-3 overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package size={32} className="text-slate-300" />
                )}
              </div>
              <p className="text-sm font-bold text-slate-900 leading-snug">
                {product.name}
              </p>
              <p className="text-sm font-semibold text-[#CD051F] mt-1">
                {outOfStock ? "Out of Stock" : `PKR ${Number(product.selling_price).toLocaleString()}`}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGrid;