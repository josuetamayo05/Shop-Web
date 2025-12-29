import { Link, useParams } from "react-router-dom";
import { AppLayout } from "../layout/AppLayout";
import { findOrderbyId } from "../features/checkout/orders.storage"; 
import { formatMoney } from "../core/lib/money";

export function OrderPage() {
  const { orderId } = useParams();
  const order = orderId ? findOrderbyId(orderId) : undefined;

  if (!order) {
    return (
      <AppLayout>
        <h1 className="text-2xl font-semibold">Pedido no encontrado</h1>
        <p className="mt-2 text-slate-600">No existe el pedido: {orderId}</p>
        <Link to="/" className="mt-6 inline-block underline">
          Volver al inicio
        </Link>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="rounded-2xl border border-black/10 bg-white p-8">
        <h1 className="text-2xl font-semibold">Pedido confirmado</h1>
        <p className="mt-2 text-slate-600">
          ID: <code>{order.id}</code>
        </p>

        <div className="mt-6 space-y-2 text-sm">
          {order.items.map((it) => (
            <div key={it.productId} className="flex items-center justify-between">
              <span className="text-slate-700">
                {it.name} × {it.quantity}
              </span>
              <span className="font-semibold">
                {formatMoney(it.lineTotal, order.currency)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-black/10 pt-4 flex items-center justify-between">
          <span className="text-slate-600">Total</span>
          <span className="text-lg font-semibold">
            {formatMoney(order.totals.total, order.currency)}
          </span>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            to="/catalog"
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
          >
            Seguir comprando
          </Link>
          <Link
            to="/"
            className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-medium"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}