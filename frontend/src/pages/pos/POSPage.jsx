import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import POSHeader from "../../components/pos/POSHeader";
import CategorySidebar from "../../components/pos/CategorySidebar";
import CustomerTabs from "../../components/pos/CustomerTabs";
import ProductGrid from "../../components/pos/ProductGrid";
import CartPanel from "../../components/pos/CartPanel";

const createEmptyCustomer = (name) => ({
  id: `${Date.now()}-${Math.random()}`,
  name,
  items: [],
  laborCharges: "",
  paidAmount: "",
  invoiceNo: null,
  saleId: null,
});

const POSPage = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [customers, setCustomers] = useState([createEmptyCustomer("Customer 1")]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [saving, setSaving] = useState(false);

  const activeCart = customers[activeIndex];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          api.get("/categories"),
          api.get("/product"),
        ]);
        setCategories(
          Array.isArray(categoriesRes.data?.categories) ? categoriesRes.data.categories : []
        );
        setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      } catch (error) {
        console.error("Error fetching POS data:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchInitialData();
  }, []);

  const refreshProducts = async () => {
    try {
      const res = await api.get("/product");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error refreshing products:", error);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = !selectedCategoryId || p.category_id === selectedCategoryId;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategoryId, searchTerm]);

  const updateActiveCart = (updater) => {
    setCustomers((prev) =>
      prev.map((c, idx) => (idx === activeIndex ? updater(c) : c))
    );
  };

  const handleAddToCart = (product) => {
    updateActiveCart((cart) => {
      const existing = cart.items.find((i) => i.product_id === product.id);
      if (existing) {
        if (existing.qty >= product.stock_quantity) return cart;
        return {
          ...cart,
          items: cart.items.map((i) =>
            i.product_id === product.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return {
        ...cart,
        items: [
          ...cart.items,
          {
            product_id: product.id,
            name: product.name,
            price: product.selling_price,
            qty: 1,
            maxStock: product.stock_quantity,
          },
        ],
      };
    });
  };

  const handleIncrement = (productId) => {
    updateActiveCart((cart) => ({
      ...cart,
      items: cart.items.map((i) =>
        i.product_id === productId && i.qty < i.maxStock ? { ...i, qty: i.qty + 1 } : i
      ),
    }));
  };

  const handleDecrement = (productId) => {
    updateActiveCart((cart) => ({
      ...cart,
      items: cart.items.map((i) =>
        i.product_id === productId ? { ...i, qty: Math.max(1, i.qty - 1) } : i
      ),
    }));
  };

  const handleRemoveItem = (productId) => {
    updateActiveCart((cart) => ({
      ...cart,
      items: cart.items.filter((i) => i.product_id !== productId),
    }));
  };

  const handleLaborChange = (value) => {
    updateActiveCart((cart) => ({ ...cart, laborCharges: value }));
  };

  const handlePaidChange = (value) => {
    updateActiveCart((cart) => ({ ...cart, paidAmount: value }));
  };

  const handleClear = () => {
    updateActiveCart((cart) => ({
      ...cart,
      items: [],
      laborCharges: "",
      paidAmount: "",
      invoiceNo: null,
      saleId: null,
    }));
  };

  const handleAddCustomer = () => {
    setCustomers((prev) => [...prev, createEmptyCustomer(`Customer ${prev.length + 1}`)]);
    setActiveIndex(customers.length);
  };

  const handleSaveBill = async () => {
    if (activeCart.items.length === 0) return;

    // Optional frontend check prior to sending request:
    const subtotal = activeCart.items.reduce((sum, i) => sum + i.qty * i.price, 0);
    const labor = Number(activeCart.laborCharges) || 0;
    const paid = Number(activeCart.paidAmount) || 0;

    if (paid < (subtotal + labor)) {
      alert("Paid amount is less than total.");
      return;
    }

    setSaving(true);
    try {
      // Send ONLY raw inputs: items (IDs + qtys), labor, and paid amount
      const res = await api.post("/sales", {
        items: activeCart.items.map((i) => ({
          product_id: i.product_id,
          qty: i.qty,
          // Sending price is optional if backend fetches product prices from DB!
          price: i.price, 
        })),
        labor_charges: labor,
        paid_amount: paid,
      });
      updateActiveCart((cart) => ({
        ...cart,
        invoiceNo: res.data.invoice_no,
        saleId: res.data.sale_id,
      }));

      await refreshProducts();
      return res.data;
    } catch (error) {
      console.error("Error saving bill:", error);
      alert(error?.response?.data?.message || "Failed to save bill.");
      return null;
    } finally {
      setSaving(false);
    }
  };
  const handlePrint = async () => {
    if (!activeCart.invoiceNo) {
      const result = await handleSaveBill();
      if (!result) return;
    }
    window.print();
  };

  const handleReturn = () => {
    navigate("/pos/returns");
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] flex flex-col">
      <POSHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <div className="flex flex-1">
        <CategorySidebar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />

        <main className="flex-1 p-6 flex flex-col gap-5 overflow-x-hidden">
          <CustomerTabs
            customers={customers}
            activeIndex={activeIndex}
            onSelectTab={setActiveIndex}
            onAddCustomer={handleAddCustomer}
            scrollStart={scrollStart}
            onScrollPrev={() => setScrollStart((s) => Math.max(0, s - 1))}
            onScrollNext={() =>
              setScrollStart((s) => Math.min(customers.length - 3, s + 1))
            }
          />

          <div className="flex gap-6 flex-1 items-start">
            <div className="flex-1 min-w-0">
              <ProductGrid
                products={filteredProducts}
                loading={loadingProducts}
                onAddToCart={handleAddToCart}
              />
            </div>

            <CartPanel
              cart={activeCart}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onRemoveItem={handleRemoveItem}
              onLaborChange={handleLaborChange}
              onPaidChange={handlePaidChange}
              onSaveBill={handleSaveBill}
              onPrint={handlePrint}
              onClear={handleClear}
              onReturn={handleReturn}
              saving={saving}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default POSPage;