import { Package } from "lucide-react";

const ProductGrid = ({ products, loading, onAddToCart }) => {
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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 pr-1">
      {products.map((product) => {
        const outOfStock = Number(product.stock_quantity) === 0;
        return (
          <button
            key={product.id}
            onClick={() => !outOfStock && onAddToCart(product)}
            disabled={outOfStock}
            className={`bg-white border-2 border-slate-200 rounded-lg p-2 flex flex-col items-center justify-between text-center transition min-h-[135px] max-h-[145px] ${
              outOfStock
                ? "opacity-40 cursor-not-allowed border-slate-100"
                : "hover:border-[#CD051F] hover:shadow-sm"
            }`}
          >
            {/* Image Box */}
            <div className="w-full h-16 rounded bg-slate-50 flex items-center justify-center overflow-hidden mb-1">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-0.5"
                />
              ) : (
                <Package size={22} className="text-slate-300" />
              )}
            </div>

            {/* Content Details */}
            <div className="w-full flex flex-col items-center gap-0.5">
              <p className="text-[11px] font-extrabold text-slate-900 leading-tight line-clamp-2 w-full">
                {product.name}
              </p>
              <p className="text-[11px] font-bold text-[#CD051F]">
                {outOfStock ? "Out of Stock" : `PKR ${Number(product.selling_price).toLocaleString()}`}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ProductGrid;