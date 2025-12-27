import { Link } from "react-router-dom";
import { formatMoney } from "../../../core/lib/money";

type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    stock?: number;
};

export function ProductCard({
  product,
  currency,
}: {
  product: Product;
  currency: string;
}) {
  const isOut = (product.stock ?? 0) <= 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-[4/3] bg-slate-100">
          <img
            src={product.images?.[0] || "/vite.svg"}
            alt={product.name}
            className="h-full w-full object-cover"
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
    </div>
  );
}
