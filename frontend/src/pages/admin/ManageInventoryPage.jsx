import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, SquarePen, Trash2, Pencil, X } from "lucide-react";
import api from "../../services/api";
import AdminLayout from "../../components/layout/AdminLayout";
import AddPageModal from "./AddPageModal";
import EditPageModal from "./EditPageModal";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";

const PAGE_SIZE = 8;
const STATUS_OPTIONS = ["All Status", "Active", "Inactive", "Out of Stock"];

const getDisplayStatus = (product) => {
    if (Number(product.stock_quantity) <= 0) return "Out of Stock";
    return product.status || "Active";
};

const ManageInventoryPage = () => {
    const navigate = useNavigate();

    const [pages, setPages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedPageId, setSelectedPageId] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const [isAddPageOpen, setIsAddPageOpen] = useState(false);
    const [editPageTarget, setEditPageTarget] = useState(null);
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [editCategoryTarget, setEditCategoryTarget] = useState(null);

    const [deleteProductTarget, setDeleteProductTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [tablePage, setTablePage] = useState(1);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);

                const [pagesRes, categoriesRes, productsRes] = await Promise.all([
                    api.get("/pages").catch(() => ({ data: { pages: [] } })),
                    api.get("/categories").catch(() => ({ data: { categories: [] } })),
                    api.get("/product").catch(() => api.get("/products")).catch(() => ({ data: [] }))
                ]);

                const fetchedPages = Array.isArray(pagesRes.data?.pages) 
                    ? pagesRes.data.pages 
                    : Array.isArray(pagesRes.data) 
                    ? pagesRes.data 
                    : [];
                setPages(fetchedPages);

                if (fetchedPages.length > 0) {
                    setSelectedPageId(fetchedPages[0].id);
                }

                const fetchedCategories = Array.isArray(categoriesRes.data?.categories)
                    ? categoriesRes.data.categories
                    : Array.isArray(categoriesRes.data)
                    ? categoriesRes.data
                    : [];
                setCategories(fetchedCategories);

                const rawProducts = Array.isArray(productsRes.data?.products)
                    ? productsRes.data.products
                    : Array.isArray(productsRes.data)
                    ? productsRes.data
                    : [];

                setProducts(rawProducts);
            } catch (error) {
                console.error("Error fetching inventory data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    const categoriesForSelectedPage = useMemo(() => {
        if (!selectedPageId) return categories;
        return categories.filter((c) => String(c.page_id) === String(selectedPageId));
    }, [categories, selectedPageId]);

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            let matchesCategory = false;
    
            if (selectedCategoryId) {
                // Specific category button selected (e.g. Engine Parts)
                matchesCategory = String(p.category_id) === String(selectedCategoryId);
            } else {
                // "All Categories" button is active -> show all products
                matchesCategory = true;
            }
    
            const matchesSearch = p.name ? p.name.toLowerCase().includes(search.toLowerCase()) : true;
            const displayStatus = getDisplayStatus(p);
            const matchesStatus = statusFilter === "All Status" || displayStatus === statusFilter;
    
            return matchesCategory && matchesSearch && matchesStatus;
        });
    }, [products, selectedCategoryId, search, statusFilter]);
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
    const currentPage = Math.min(tablePage, totalPages);
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const paginatedProducts = filteredProducts.slice(startIdx, startIdx + PAGE_SIZE);

    const handlePageAdded = (newPage) => {
        setPages((prev) => [...prev, newPage]);
        setSelectedPageId(newPage.id);
    };

    const handlePageUpdated = (updatedPage) => {
        setPages((prev) => prev.map((p) => (p.id === updatedPage.id ? updatedPage : p)));
    };

    const handleCategoryAdded = (newCategory) => {
        setCategories((prev) => [newCategory, ...prev]);
    };

    const handleCategoryUpdated = (updatedCategory) => {
        setCategories((prev) =>
            prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c))
        );
    };

    const confirmDeleteProduct = async () => {
        if (!deleteProductTarget) return;
        setDeleting(true);
        try {
            await api.delete(`/product/${deleteProductTarget.id}`);
            setProducts((prev) => prev.filter((p) => p.id !== deleteProductTarget.id));
            setDeleteProductTarget(null);
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <AdminLayout>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-6 tracking-tight">
                Manage Inventory
            </h1>

            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-slate-900">Page</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-8">
                {pages.map((page) => {
                    const isActive = page.id === selectedPageId;
                    return (
                        <div
                            key={page.id}
                            className="flex items-center rounded-lg overflow-hidden border border-slate-900"
                        >
                            <button
                                onClick={() => {
                                    setSelectedPageId(page.id);
                                    setSelectedCategoryId(null);
                                    setTablePage(1);
                                }}
                                className={`px-4 py-2 text-sm font-bold transition ${isActive ? "bg-[#CD051F] text-white" : "bg-white text-slate-900"
                                    }`}
                            >
                                {page.name}
                            </button>
                            <button
                                onClick={() => setEditPageTarget(page)}
                                className={`px-2.5 py-2 border-l transition ${isActive
                                        ? "bg-[#CD051F] border-white/30 text-white hover:bg-red-700"
                                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                    }`}
                            >
                                <Pencil size={14} />
                            </button>
                        </div>
                    );
                })}

                <button
                    onClick={() => setIsAddPageOpen(true)}
                    className="flex items-center gap-2 bg-[#CD051F] hover:bg-red-700 text-white text-sm font-bold px-4 py-2.5 rounded-lg transition shadow-sm"
                >
                    <Plus size={16} strokeWidth={3} />
                    Add New Page
                </button>
            </div>

            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-slate-900">Categories</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-8">
                <div
                    className={`flex items-center rounded-lg overflow-hidden border border-slate-900`}
                >
                    <button
                        onClick={() => {
                            setSelectedCategoryId(null);
                            setTablePage(1);
                        }}
                        className={`px-4 py-2 text-sm font-bold transition ${!selectedCategoryId ? "bg-[#CD051F] text-white" : "bg-white text-slate-900"
                            }`}
                    >
                        All Categories
                    </button>
                </div>

                {categoriesForSelectedPage.map((category) => {
                    const isActive = String(category.id) === String(selectedCategoryId);
                    return (
                        <div
                            key={category.id}
                            className="flex items-center rounded-lg overflow-hidden border border-slate-900"
                        >
                            <button
                                onClick={() => {
                                    setSelectedCategoryId(category.id);
                                    setTablePage(1);
                                }}
                                className={`px-4 py-2 text-sm font-bold transition ${isActive ? "bg-[#CD051F] text-white" : "bg-white text-slate-900"
                                    }`}
                            >
                                {category.name}
                            </button>
                            <button
                                onClick={() => setEditCategoryTarget(category)}
                                className={`px-2.5 py-2 border-l transition ${isActive
                                        ? "bg-[#CD051F] border-white/30 text-white hover:bg-red-700"
                                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                    }`}
                            >
                                <Pencil size={14} />
                            </button>
                        </div>
                    );
                })}

                <button
                    onClick={() => setIsAddCategoryOpen(true)}
                    disabled={!selectedPageId}
                    className="flex items-center gap-2 bg-[#CD051F] hover:bg-red-700 disabled:opacity-50 text-white text-sm font-bold px-4 py-2.5 rounded-lg transition shadow-sm"
                >
                    <Plus size={16} strokeWidth={3} />
                    Add New Category
                </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-bold text-slate-900 shrink-0">Product List</h2>

                <div className="flex flex-wrap items-center gap-3 flex-1 justify-end">
                    <div className="relative w-full max-w-[280px]">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setTablePage(1);
                            }}
                            placeholder="Search product by name"
                            className="w-full border border-slate-200 rounded-lg pl-4 pr-9 py-2 text-sm text-slate-700 placeholder-slate-400 bg-white focus:outline-none focus:border-[#CD051F] transition"
                        />
                        <Search
                            size={16}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setTablePage(1);
                        }}
                        className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:border-[#CD051F] transition"
                    >
                        {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => navigate("/admin/products/add")}
                        className="flex items-center gap-2 bg-[#CD051F] hover:bg-red-700 text-white text-sm font-bold px-4 py-2.5 rounded-lg transition shadow-sm shrink-0"
                    >
                        <Plus size={16} strokeWidth={3} />
                        Add New Product
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wide px-6 py-4">
                                Product Image
                            </th>
                            <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wide px-6 py-4">
                                Product Name
                            </th>
                            <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wide px-6 py-4">
                                Price (PKR)
                            </th>
                            <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wide px-6 py-4">
                                Stock
                            </th>
                            <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wide px-6 py-4">
                                Status
                            </th>
                            <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wide px-6 py-4">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-slate-400 text-sm">
                                    Loading products...
                                </td>
                            </tr>
                        ) : paginatedProducts.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-slate-400 text-sm">
                                    No products found.
                                </td>
                            </tr>
                        ) : (
                            paginatedProducts.map((product) => {
                                const displayStatus = getDisplayStatus(product);
                                const statusStyle =
                                    displayStatus === "Out of Stock"
                                        ? "bg-slate-200 text-slate-600"
                                        : displayStatus === "Active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-600";

                                return (
                                    <tr
                                        key={product.id}
                                        className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition"
                                    >
                                        <td className="px-6 py-3">
                                            <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-slate-300 text-xs">N/A</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 font-semibold text-slate-800">
                                            {product.name}
                                        </td>
                                        <td className="px-6 py-3 text-slate-700">
                                            {Number(product.selling_price).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-3 text-slate-700">
                                            {product.stock_quantity}
                                        </td>
                                        <td className="px-6 py-3">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyle}`}
                                            >
                                                {displayStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                                                    title="Edit"
                                                >
                                                    <SquarePen size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteProductTarget(product)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md bg-[#CD051F] hover:bg-red-700 text-white transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                <p className="text-xs text-slate-500">
                    {filteredProducts.length === 0
                        ? "Showing 0 products"
                        : `Showing ${startIdx + 1} to ${Math.min(
                            startIdx + PAGE_SIZE,
                            filteredProducts.length
                        )} of ${filteredProducts.length} products`}
                </p>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setTablePage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                        <button
                            key={num}
                            onClick={() => setTablePage(num)}
                            className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${currentPage === num
                                    ? "bg-[#CD051F] text-white"
                                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                }`}
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        onClick={() => setTablePage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                    >
                        Next
                    </button>
                </div>
            </div>

            {isAddPageOpen && (
                <AddPageModal onClose={() => setIsAddPageOpen(false)} onAdded={handlePageAdded} />
            )}
            {editPageTarget && (
                <EditPageModal
                    page={editPageTarget}
                    onClose={() => setEditPageTarget(null)}
                    onUpdated={handlePageUpdated}
                />
            )}
            {isAddCategoryOpen && (
                <AddCategoryModal
                    pages={pages}
                    defaultPageId={selectedPageId}
                    onClose={() => setIsAddCategoryOpen(false)}
                    onAdded={handleCategoryAdded}
                />
            )}
            {editCategoryTarget && (
                <EditCategoryModal
                    category={editCategoryTarget}
                    pages={pages}
                    onClose={() => setEditCategoryTarget(null)}
                    onUpdated={handleCategoryUpdated}
                />
            )}

            {deleteProductTarget && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h3 className="text-lg font-extrabold text-[#CD051F]">Delete Product</h3>
                            <button
                                onClick={() => setDeleteProductTarget(null)}
                                className="text-slate-500 hover:text-slate-700 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="px-6 py-8 text-center">
                            <p className="text-base font-bold text-slate-900">
                                Are you sure you want to delete "{deleteProductTarget.name}"?
                            </p>
                        </div>
                        <div className="px-6 pb-6 grid grid-cols-2 gap-4">
                            <button
                                onClick={confirmDeleteProduct}
                                disabled={deleting}
                                className="w-full bg-green-100 hover:bg-green-200 disabled:opacity-60 text-green-700 font-bold py-3 rounded-lg transition"
                            >
                                {deleting ? "Deleting..." : "Yes"}
                            </button>
                            <button
                                onClick={() => setDeleteProductTarget(null)}
                                disabled={deleting}
                                className="w-full bg-red-50 hover:bg-red-100 text-[#CD051F] font-bold py-3 rounded-lg transition"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default ManageInventoryPage;