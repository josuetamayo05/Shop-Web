import { Link } from "react-router-dom";
import { formatMoney } from "../../../core/lib/money";
import { useToast } from "../../../core/toast/toast.context";
import { useCartStore } from "../../cart/cart.store";

type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    stock?: number;
};

export function ProductCard({  product,  currency,}: {
  product: Product;
  currency: string;
}) {
  const toast=useToast();
  const addToCart=useCartStore((s)=>s.addToCart);
  const inCartQty=useCartStore((s)=>s.items.find((i)=>i.productId===product.id)?.quantity??0);
  const stock=typeof product.stock==="number"?product.stock:undefined;
  const reachedMax=typeof stock ==="number"?inCartQty>=stock:false;
  const isOut=typeof stock==="number"?stock<=0:false;
  const img=product.images?.[0]||"/vite.svg";

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
      {/* Click para ir al detalle */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-[4/3] bg-slate-100">
          <img
            src={img}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/vite.svg";
            }}
          />
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold leading-tight">{product.name}</h3>
            <div className="text-sm font-semibold">
              {formatMoney(product.price, currency)}
            </div>
          </div>

          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
            {product.description}
          </p>

          <div className="mt-3 text-xs">
            {isOut ? (
              <span className="rounded-full bg-red-50 px-2 py-1 font-medium text-red-700">
                Sin stock
              </span>
            ) : (
              <span className="rounded-full bg-emerald-50 px-2 py-1 font-medium text-emerald-700">
                En stock
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Acción de carrito (fuera del Link para que no navegue) */}
      <div className="border-t border-black/10 p-4">
        <button
          disabled={isOut || reachedMax}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            if (isOut) {
              toast.push("Este producto está sin stock.", "error");
              return;
            }
            if (reachedMax) {
              toast.push("Ya tienes el máximo disponible en el carrito.", "info");
              return;
            }

            addToCart(product.id, 1, stock);
            toast.push("Añadido al carrito", "success");
          }}
          className={`w-full rounded-xl px-4 py-2 text-sm font-medium text-white ${
            isOut || reachedMax
              ? "bg-slate-300"
              : "bg-slate-900 hover:bg-slate-800"
          }`}
        >
          {isOut ? "Sin stock" : reachedMax ? "Máximo en carrito" : "Añadir al carrito"}
        </button>
      </div>
    </div>
  );
}
