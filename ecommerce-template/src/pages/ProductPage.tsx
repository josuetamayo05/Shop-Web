import { Link, useParams } from "react-router-dom";
import { AppLayout } from "../layout/AppLayout";
import { useCatalog } from "../app/providers/CatalogProvider";
import { formatMoney } from "../core/lib/money";

export function ProductPage(){
    const { productId } = useParams();
    const catalog = useCatalog();

    const product = catalog.products.find((p)=>p.id===productId);
    if(!product){
        return 
        <AppLayout>
            <h1 className="text-2xl font-semibold">Producto no encontrado</h1>
            <p className="mt-2 text-slate-600">
                El producto <code>{productId}</code> no existe.
            </p>
            <Link className="mt-6 inline-block text-sm font-medium text-slate-900 underline" to="/catalog">
                Volver al catálogo
            </Link>
        </AppLayout>
    }

const isOut = (product.stock ?? 0) <= 0;

return (
    <AppLayout>
        <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="aspect-[4/3] bg-slate-100">
                <img
                    src={product.images?.[0] || "/vite.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover"
                />
            </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-6">
            <Link to="/catalog" className="text-sm text-slate-600 hover:text-slate-900">
                ← Volver al catálogo
            </Link>

            <h1 className="mt-3 text-3xl font-bold tracking-tight">{product.name}</h1>

            <div className="mt-3 text-lg font-semibold">
                {formatMoney(product.price, catalog.currency)}
            </div>

            <p className="mt-4 text-slate-600">{product.description}</p>

            <div className="mt-6">
                {isOut ? (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
                        Sin stock
                    </span>
                ) : (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                    En stock: {product.stock}
                </span>
                )}
            </div>

            <button
                disabled={isOut}
                className={`mt-6 w-full rounded-xl px-5 py-3 text-sm font-medium text-white ${
                    isOut ? "bg-slate-300" : "bg-slate-900 hover:bg-slate-800"
                }`}
            >
                Añadir al carrito (siguiente paso)
            </button>
          </div>
        </div>
        </AppLayout>
    );
}