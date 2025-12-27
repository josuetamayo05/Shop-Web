import { AppLayout } from "../layout/AppLayout";
import { useMemo, useState } from "react";
import { useCatalog } from "../app/providers/CatalogProvider";
import { ProductCard } from "../features/catalog/components/ProductCard";

export function CatalogPage() {
    const catalog = useCatalog();
    const [query, setQuery] = useState("");
    const [categoryId, setCategoryId] = useState<string>("all");

    const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return catalog.products.filter((p) => {
        const matchesQuery =
        q.length === 0 ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);

        const matchesCategory = categoryId === "all" || p.categoryId === categoryId;

        return matchesQuery && matchesCategory;
        });
    }, [catalog.products, query, categoryId]);
    return (
        <AppLayout>
            <div className="flex flex-col gap-6">
                <div>
                <h1 className="text-2xl font-semibold">Catálogo</h1>
                <p className="mt-1 text-slate-600">
                    Productos cargados desde <code>catalog.json</code>.
                </p>
                </div>

                <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-4 md:flex-row md:items-center">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-full rounded-xl border border-black/10 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 md:flex-1"
                />

                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full rounded-xl border border-black/10 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 md:w-60"
                >
                    <option value="all">Todas las categorías</option>
                    {catalog.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                    ))}
                </select>
                </div>

                {filtered.length === 0 ? (
                <div className="rounded-2xl border border-black/10 bg-white p-10 text-slate-600">
                    No hay productos que coincidan con tu búsqueda.
                </div>
                ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} currency={catalog.currency} />
                    ))}
                </div>
                )}
            </div>
        </AppLayout>
    );
}