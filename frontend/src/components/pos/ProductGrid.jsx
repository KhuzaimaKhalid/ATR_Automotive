import { Package } from "lucide-react";

const ProductGrid = ({ products, loading, onAddToCart }) => {
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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pr-2">
      {products.map((product) => {
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
  );
};

export default ProductGrid;