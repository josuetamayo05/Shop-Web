import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AppLayout } from "../layout/AppLayout";
import { useCatalog } from "../app/providers/CatalogProvider";
import { useCheckoutConfig } from "../app/providers/CheckoutProvider";
import { useCartStore } from "../features/cart/cart.store";
import { formatMoney } from "../core/lib/money";

import { checkoutSchema, type CheckoutFormValues } from "../features/checkout/checkout.shema";
import { newOrderId, saveOrder, type Order } from "../features/checkout/orders.storage";

export function CheckoutPage() {
  const navigate = useNavigate();
  const catalog = useCatalog();
  const checkout = useCheckoutConfig();

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultShipping = checkout.shippingMethods[0]?.id ?? "";
  const defaultPayment = checkout.paymentMethods[0]?.id ?? "";

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullname: "",
      email: "",
      phone: "",
      address1: "",
      city: "",
      postalCode: "",
      country: "España",
      shippingMethodId: defaultShipping,
      paymentMethodId: defaultPayment,
    },
    mode: "onBlur",
  });

  const shippingMethodId = form.watch("shippingMethodId");

  const lines = useMemo(() => {
    return items.map((it) => {
      const product = catalog.products.find((p) => p.id === it.productId);
      return { item: it, product };
    });
  }, [items, catalog.products]);

  const subtotal = useMemo(() => {
    return lines.reduce((sum, l) => {
      if (!l.product) return sum;
      return sum + l.product.price * l.item.quantity;
    }, 0);
  }, [lines]);

  const shipping = useMemo(() => {
    const m = checkout.shippingMethods.find((x) => x.id === shippingMethodId);
    return m ? m.price : 0;
  }, [checkout.shippingMethods, shippingMethodId]);

  const tax = useMemo(() => {
    const base = subtotal + shipping;
    return base * checkout.taxRate;
  }, [subtotal, shipping, checkout.taxRate]);

  const total = subtotal + shipping + tax;

  const onSubmit = (values: CheckoutFormValues) => {
    setSubmitError(null);

    if (items.length === 0) {
      setSubmitError("Tu carrito está vacío.");
      return;
    }

    // Validar productos existentes y stock (si hay stock definido)
    for (const l of lines) {
      if (!l.product) {
        setSubmitError("Hay un producto en el carrito que ya no existe.");
        return;
      }
      const stock = l.product.stock;
      if (typeof stock === "number" && l.item.quantity > stock) {
        setSubmitError(
          `No hay suficiente stock de "${l.product.name}". Disponible: ${stock}`
        );
        return;
      }
    }

    const shippingMethod = checkout.shippingMethods.find((m) => m.id === values.shippingMethodId);
    const paymentMethod = checkout.paymentMethods.find((m) => m.id === values.paymentMethodId);

    if (!shippingMethod || !paymentMethod) {
      setSubmitError("Método de envío o pago inválido.");
      return;
    }

    const orderId = newOrderId();

    const order: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      currency: catalog.currency,
      taxRate: checkout.taxRate,

      customer: {
        fullName: values.fullname,
        email: values.email,
        phone: values.phone,
        address1: values.address1,
        city: values.city,
        postalCode: values.postalCode,
        country: values.country,
      },

      shipping: { id: shippingMethod.id, name: shippingMethod.name, price: shippingMethod.price },
      payment: { id: paymentMethod.id, name: paymentMethod.name },

      items: lines.map((l) => ({
        productId: l.item.productId,
        name: l.product!.name,
        unitPrice: l.product!.price,
        quantity: l.item.quantity,
        lineTotal: l.product!.price * l.item.quantity,
      })),

      totals: {
        subtotal,
        shipping,
        tax,
        total,
      },
    };

    saveOrder(order);
    clearCart();
    navigate(`/order/${orderId}`);
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold">Checkout</h1>
          <p className="mt-1 text-slate-600">Formulario simulado, pero con validación real.</p>
        </div>

        {submitError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {submitError}
          </div>
        )}

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
            {/* Formulario */}
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="lg:col-span-2 rounded-2xl border border-black/10 bg-white p-6 space-y-6"
            >
              <section>
                <h2 className="font-semibold">Datos del cliente</h2>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Nombre completo" error={form.formState.errors.fullname?.message}>
                    <input className={inputCls} {...form.register("fullname")} />
                  </Field>

                  <Field label="Email" error={form.formState.errors.email?.message}>
                    <input className={inputCls} {...form.register("email")} />
                  </Field>

                  <Field label="Teléfono" error={form.formState.errors.phone?.message}>
                    <input className={inputCls} {...form.register("phone")} />
                  </Field>
                </div>
              </section>

              <section>
                <h2 className="font-semibold">Dirección</h2>

                <div className="mt-4 grid gap-4">
                  <Field label="Dirección" error={form.formState.errors.address1?.message}>
                    <input className={inputCls} {...form.register("address1")} />
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Ciudad" error={form.formState.errors.city?.message}>
                      <input className={inputCls} {...form.register("city")} />
                    </Field>

                    <Field label="Código postal" error={form.formState.errors.postalCode?.message}>
                      <input className={inputCls} {...form.register("postalCode")} />
                    </Field>

                    <Field label="País" error={form.formState.errors.country?.message}>
                      <input className={inputCls} {...form.register("country")} />
                    </Field>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-semibold">Envío</h2>

                <div className="mt-4 space-y-2">
                  {checkout.shippingMethods.map((m) => (
                    <label
                      key={m.id}
                      className="flex cursor-pointer items-center justify-between rounded-xl border border-black/10 p-3 hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          value={m.id}
                          {...form.register("shippingMethodId")}
                        />
                        <div>
                          <div className="text-sm font-medium">{m.name}</div>
                          <div className="text-xs text-slate-600">
                            ETA {m.etaDays[0]}–{m.etaDays[1]} días
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold">
                        {formatMoney(m.price, catalog.currency)}
                      </div>
                    </label>
                  ))}
                  {form.formState.errors.shippingMethodId?.message && (
                    <p className="text-xs text-red-700">{form.formState.errors.shippingMethodId.message}</p>
                  )}
                </div>
              </section>

              <section>
                <h2 className="font-semibold">Pago</h2>

                <div className="mt-4 space-y-2">
                  {checkout.paymentMethods.map((m) => (
                    <label
                      key={m.id}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/10 p-3 hover:bg-slate-50"
                    >
                      <input type="radio" value={m.id} {...form.register("paymentMethodId")} />
                      <div className="text-sm font-medium">{m.name}</div>
                    </label>
                  ))}
                  {form.formState.errors.paymentMethodId?.message && (
                    <p className="text-xs text-red-700">{form.formState.errors.paymentMethodId.message}</p>
                  )}
                </div>
              </section>

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
              >
                Confirmar pedido (simulado)
              </button>
            </form>

            {/* Resumen */}
            <aside className="rounded-2xl border border-black/10 bg-white p-5 h-fit">
              <h2 className="text-lg font-semibold">Resumen</h2>

              <div className="mt-4 space-y-3">
                {lines.map((l) => (
                  <div key={l.item.productId} className="flex items-start justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <div className="truncate font-medium">
                        {l.product?.name ?? l.item.productId}
                      </div>
                      <div className="text-xs text-slate-600">Cantidad: {l.item.quantity}</div>
                    </div>
                    <div className="font-semibold">
                      {l.product
                        ? formatMoney(l.product.price * l.item.quantity, catalog.currency)
                        : "—"}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2 text-sm">
                <Row label="Subtotal" value={formatMoney(subtotal, catalog.currency)} />
                <Row label="Envío" value={formatMoney(shipping, catalog.currency)} />
                <Row
                  label={`Impuestos (${Math.round(checkout.taxRate * 100)}%)`}
                  value={formatMoney(tax, catalog.currency)}
                />
                <div className="border-t border-black/10 pt-3">
                  <Row label="Total" value={formatMoney(total, catalog.currency)} strong />
                </div>
              </div>

              <Link
                to="/cart"
                className="mt-4 block rounded-xl border border-black/10 bg-white px-5 py-3 text-center text-sm font-medium hover:bg-slate-50"
              >
                Volver al carrito
              </Link>
            </aside>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600">{label}</span>
      <span className={strong ? "font-semibold" : "font-medium"}>{value}</span>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-sm font-medium">{label}</div>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-black/10 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200";