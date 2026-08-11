import { useState } from "react";
import { Package, ArrowLeft, ArrowRight } from "lucide-react";

const PRODUCTS_PER_PAGE = 20;

const ProductGrid = ({ products, loading, onAddToCart }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-xs text-slate-400 py-12">
        Loading products...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-xs text-slate-400 py-12">
        No products found.
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);
  const startIdx = (activePage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = products.slice(startIdx, startIdx + PRODUCTS_PER_PAGE);

  return (
    <div className="flex flex-col gap-2 h-full justify-between">
      {/* Top Pagination Controls (Triggers when > 20 products) */}
      {products.length > PRODUCTS_PER_PAGE && (
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-1.5 shrink-0">
          <span className="text-xs font-bold text-slate-700">
            Page {activePage} of {totalPages} ({products.length} Items)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={activePage === 1}
              className="w-7 h-7 flex items-center justify-center rounded-md bg-[#151B26] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#20293b] transition"
              title="Previous Page"
            >
              <ArrowLeft size={14} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={activePage === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-md bg-[#CD051F] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-700 transition"
              title="Next Page"
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 5 Column x 4 Row Grid (20 Items Fit Cleanly) */}
      <div className="grid grid-cols-5 gap-2 flex-1 min-h-0 overflow-hidden">
        {paginatedProducts.map((product) => {
          const outOfStock = Number(product.stock_quantity) === 0;
          return (
            <button
              key={product.id}
              onClick={() => !outOfStock && onAddToCart(product)}
              disabled={outOfStock}
              className={`bg-white border-2 border-slate-200 rounded-lg p-1.5 flex flex-col items-center justify-between text-center transition h-[115px] ${
                outOfStock
                  ? "opacity-40 cursor-not-allowed border-slate-100"
                  : "hover:border-[#CD051F] hover:shadow-sm"
              }`}
            >
              {/* Image Container */}
              <div className="w-full h-12 rounded bg-slate-50 flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-0.5"
                  />
                ) : (
                  <Package size={18} className="text-slate-300" />
                )}
              </div>

              {/* Product Info */}
              <div className="w-full flex flex-col items-center leading-none gap-0.5 mt-0.5">
                <p className="text-[10px] font-extrabold text-slate-900 line-clamp-2 w-full">
                  {product.name}
                </p>
                <p className="text-[10px] font-bold text-[#CD051F]">
                  {outOfStock
                    ? "Out of Stock"
                    : `PKR ${Number(product.selling_price).toLocaleString()}`}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGrid;