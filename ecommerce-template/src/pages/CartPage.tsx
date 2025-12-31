import { Link } from "react-router-dom";
import { AppLayout } from "../layout/AppLayout";
import { useCatalog } from "../app/providers/CatalogProvider";
import { useCartStore } from "../features/cart/cart.store";
import { formatMoney } from "../core/lib/money";
import { useEffect, useMemo } from "react";

export function CartPage() {
    const catalog = useCatalog();

    const items = useCartStore((s) => s.items);
    const setQuantity = useCartStore((s) => s.setQuantity);
    const removeFromCart = useCartStore((s) => s.removeFromCart);
    const clearCart = useCartStore((s) => s.clearCart);

    const lines = useMemo(() => {
        return items.map((it) => {
        const product = catalog.products.find((p) => p.id === it.productId);
        return { item: it, product };
        });
    }, [items, catalog.products]);

    // Si el stock se redujo (por ejemplo desde Admin), ajusta el carrito automáticamente
    useEffect(() => {
        for (const { item, product } of lines) {
        if (!product) continue;
        const stock = typeof product.stock === "number" ? product.stock : undefined;
        if (typeof stock === "number") {
            if (stock <= 0) {
            // sin stock => quítalo del carrito
            removeFromCart(item.productId);
            } else if (item.quantity > stock) {
            // clamp al stock disponible
            setQuantity(item.productId, stock, stock);
            }
        }
        }
    }, [lines, removeFromCart, setQuantity]);

    const subtotal = useMemo(() => {
        return lines.reduce((sum, line) => {
        if (!line.product) return sum;
        return sum + line.product.price * line.item.quantity;
        }, 0);
    }, [lines]);

    return (
        <AppLayout>
        <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
            <div>
                <h1 className="text-2xl font-semibold">Carrito</h1>
                <p className="mt-1 text-slate-600">Gestiona tus productos antes de pagar.</p>
            </div>

            {items.length > 0 && (
                <button
                onClick={clearCart}
                className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
                >
                Vaciar carrito
                </button>
            )}
            </div>

            {items.length === 0 ? (
            <div className="rounded-2xl border border-black/10 bg-white p-10">
                <p className="text-slate-700">Tu carrito está vacío.</p>
                <Link
                to="/catalog"
                className="mt-4 inline-block rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
                >
                Ir al catálogo
                </Link>
            </div>
            ) : (
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Lista */}
                <div className="lg:col-span-2 space-y-3">
                {lines.map(({ item, product }) => {
                    if (!product) {
                    return (
                        <div
                        key={item.productId}
                        className="rounded-2xl border border-black/10 bg-white p-4"
                        >
                        <div className="flex items-center justify-between gap-4">
                            <div>
                            <div className="font-semibold">Producto no encontrado</div>
                            <div className="text-sm text-slate-600">{item.productId}</div>
                            </div>
                            <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-sm font-medium text-red-700 hover:underline"
                            >
                            Eliminar
                            </button>
                        </div>
                        </div>
                    );
                    }

                    const stock = typeof product.stock === "number" ? product.stock : undefined;
                    const disablePlus = typeof stock === "number" && item.quantity >= stock;

                    const lineTotal = product.price * item.quantity;
                    const img = product.images?.[0] || "/vite.svg";

                    return (
                    <div
                        key={item.productId}
                        className="rounded-2xl border border-black/10 bg-white p-4"
                    >
                        <div className="flex gap-4">
                        <div className="h-20 w-20 overflow-hidden rounded-xl bg-slate-100 border border-black/5">
                            <img
                            src={img}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = "/vite.svg";
                            }}
                            />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="font-semibold">{product.name}</div>
                                <div className="mt-1 text-sm text-slate-600 line-clamp-1">
                                {product.description}
                                </div>
                            </div>

                            <button
                                onClick={() => removeFromCart(item.productId)}
                                className="text-sm font-medium text-red-700 hover:underline"
                            >
                                Eliminar
                            </button>
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-4">
                            {/* Cantidad */}
                            <div className="inline-flex items-center rounded-xl border border-black/10 bg-white">
                                <button
                                onClick={() =>
                                    item.quantity <= 1
                                    ? removeFromCart(item.productId)
                                    : setQuantity(item.productId, item.quantity - 1, stock)
                                }
                                className="px-3 py-2 text-sm font-semibold"
                                aria-label="Disminuir cantidad"
                                >
                                −
                                </button>

                                <div className="min-w-10 px-3 py-2 text-center text-sm font-medium">
                                {item.quantity}
                                </div>

                                <button
                                disabled={disablePlus}
                                onClick={() => setQuantity(item.productId, item.quantity + 1, stock)}
                                className={`px-3 py-2 text-sm font-semibold ${
                                    disablePlus ? "text-slate-300" : ""
                                }`}
                                aria-label="Aumentar cantidad"
                                >
                                +
                                </button>
                            </div>

                            {/* Totales */}
                            <div className="text-right">
                                <div className="text-sm text-slate-600">
                                {formatMoney(product.price, catalog.currency)} c/u
                                </div>
                                <div className="font-semibold">
                                {formatMoney(lineTotal, catalog.currency)}
                                </div>
                            </div>
                            </div>

                            {disablePlus && typeof stock === "number" && (
                            <div className="mt-2 text-xs text-slate-500">
                                Máximo disponible: {stock}
                            </div>
                            )}
                        </div>
                        </div>
                    </div>
                    );
                })}
                </div>

                {/* Resumen */}
                <aside className="rounded-2xl border border-black/10 bg-white p-5 h-fit">
                <h2 className="text-lg font-semibold">Resumen</h2>

                <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold">
                    {formatMoney(subtotal, catalog.currency)}
                    </span>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                    En checkout añadimos envío e impuestos.
                </p>

                <Link
                    to="/checkout"
                    className="mt-5 block rounded-xl bg-slate-900 px-5 py-3 text-center text-sm font-medium text-white hover:bg-slate-800"
                >
                    Ir a checkout
                </Link>

                <Link
                    to="/catalog"
                    className="mt-3 block rounded-xl border border-black/10 bg-white px-5 py-3 text-center text-sm font-medium hover:bg-slate-50"
                >
                    Seguir comprando
                </Link>
                </aside>
            </div>
            )}
        </div>
        </AppLayout>
    );
}