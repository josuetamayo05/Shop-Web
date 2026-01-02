import { useMemo, useState } from "react";
import { AppLayout } from "../layout/AppLayout";
import { useConfig, useConfigActions, type SiteConfig } from "../app/providers/ConfigProvider";
import { useCatalog, useCatalogActions, type CatalogConfig } from "../app/providers/CatalogProvider";

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN ?? "1234";

function deepCopy<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

export function AdminPage() {
  const config = useConfig();
  const catalog = useCatalog();

  const { hasOverride: siteHas, setConfigOverride, resetConfigOverride } = useConfigActions();
  const { hasOverride: catHas, setCatalogOverride, resetCatalogOverride } = useCatalogActions();

  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");

  const [siteDraft, setSiteDraft] = useState<SiteConfig>(() => deepCopy(config));
  const [catalogDraft, setCatalogDraft] = useState<CatalogConfig>(() => deepCopy(catalog));

  // Textareas para import/export
  const siteJson = useMemo(() => JSON.stringify(siteDraft, null, 2), [siteDraft]);
  const catalogJson = useMemo(() => JSON.stringify(catalogDraft, null, 2), [catalogDraft]);

  if (!authed) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-md rounded-2xl border border-black/10 bg-white p-6">
          <h1 className="text-xl font-semibold">Admin</h1>
          <p className="mt-2 text-sm text-slate-600">Acceso restringido.</p>

          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN"
            className="mt-4 w-full rounded-xl border border-black/10 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
          />

          <button
            onClick={() => setAuthed(pin === ADMIN_PIN)}
            className="mt-3 w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            Entrar
          </button>

          {pin.length > 0 && pin !== ADMIN_PIN && (
            <p className="mt-2 text-xs text-red-700">PIN incorrecto</p>
          )}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Panel Admin</h1>
            <p className="mt-1 text-slate-600">Edita contenido y productos. Se guarda en este navegador.</p>
          </div>
        </div>

        {/* TIENDA */}
        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Tienda (site)</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSiteDraft(deepCopy(config))}
                className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
              >
                Cargar actual
              </button>
              <button
                onClick={resetConfigOverride}
                className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
              >
                Reset override {siteHas ? "✓" : ""}
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Nombre marca">
              <input
                className={inputCls}
                value={siteDraft.brand.name}
                onChange={(e) =>
                  setSiteDraft({ ...siteDraft, brand: { ...siteDraft.brand, name: e.target.value } })
                }
              />
            </Field>

            <Field label="Logo texto">
              <input
                className={inputCls}
                value={siteDraft.brand.logoText}
                onChange={(e) =>
                    setSiteDraft((prev) => ({
                        ...prev,
                        brand: { ...prev.brand, logoText: e.target.value },
                    }))
                }
              />
            </Field>

            <Field label="Home título">
              <input
                className={inputCls}
                value={siteDraft.home.heroTitle}
                onChange={(e) =>
                    setSiteDraft((prev) => ({
                        ...prev,
                        home: { ...prev.home, heroTitle: e.target.value },
                    }))
                }
              />
            </Field>

            <Field label="Home subtítulo">
              <input
                className={inputCls}
                value={siteDraft.home.heroSubtitle}
                onChange={(e) =>
                  setSiteDraft((prev) => ({
                        ...prev,
                        home: { ...prev.home, heroSubtitle: e.target.value },
                   }))
                }
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Footer texto">
                <input
                  className={inputCls}
                  value={siteDraft.footer.text}
                  onChange={(e) =>
                    setSiteDraft((prev) => ({
                    ...prev,
                    footer: { ...prev.footer, text: e.target.value },
                    }))
                  }
                />
              </Field>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              onClick={() => setConfigOverride(siteDraft)}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              Guardar (override)
            </button>
          </div>

          <details className="mt-6">
            <summary className="cursor-pointer text-sm font-medium text-slate-700">Import/Export JSON</summary>
            <div className="mt-3 grid gap-3">
              <textarea className={taCls} value={siteJson} readOnly />
              <ImportBox
                onImport={(raw) => {
                  const parsed = JSON.parse(raw) as SiteConfig;
                  setSiteDraft(parsed);
                }}
              />
            </div>
          </details>
        </section>

        {/* CATALOGO */}
        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Productos (catalog)</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCatalogDraft(deepCopy(catalog))}
                className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
              >
                Cargar actual
              </button>
              <button
                onClick={resetCatalogOverride}
                className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
              >
                Reset override {catHas ? "✓" : ""}
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {catalogDraft.products.map((p, idx) => (
              <div key={p.id} className="rounded-2xl border border-black/10 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{p.name}</div>
                    <div className="text-xs text-slate-600 truncate">{p.id}</div>
                  </div>

                  <button
                    onClick={() => {
                      const next = deepCopy(catalogDraft);
                      next.products.splice(idx, 1);
                      setCatalogDraft(next);
                    }}
                    className="text-sm font-medium text-red-700 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Field label="Nombre">
                    <input
                      className={inputCls}
                      value={p.name}
                      onChange={(e) => {
                        const next = deepCopy(catalogDraft);
                        next.products[idx].name = e.target.value;
                        setCatalogDraft(next);
                      }}
                    />
                  </Field>

                  <Field label="Precio">
                    <input
                      className={inputCls}
                      type="number"
                      step="0.01"
                      value={p.price}
                      onChange={(e) => {
                        const next = deepCopy(catalogDraft);
                        next.products[idx].price = Number(e.target.value);
                        setCatalogDraft(next);
                      }}
                    />
                  </Field>

                  <Field label="Stock">
                    <input
                      className={inputCls}
                      type="number"
                      step="1"
                      value={p.stock ?? 0}
                      onChange={(e) => {
                        const next = deepCopy(catalogDraft);
                        next.products[idx].stock = Number(e.target.value);
                        setCatalogDraft(next);
                      }}
                    />
                  </Field>

                  <Field label="Categoría">
                    <select
                      className={inputCls}
                      value={p.categoryId}
                      onChange={(e) => {
                        const next = deepCopy(catalogDraft);
                        next.products[idx].categoryId = e.target.value;
                        setCatalogDraft(next);
                      }}
                    >
                      {catalogDraft.categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => {
                const next = deepCopy(catalogDraft);
                next.products.unshift({
                  id: `new-${Date.now()}`,
                  name: "Nuevo producto",
                  description: "Descripción...",
                  price: 0,
                  categoryId: next.categories[0]?.id ?? "default",
                  images: ["/vite.svg"],
                  stock: 0,
                });
                setCatalogDraft(next);
              }}
              className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              + Añadir producto
            </button>

            <button
              onClick={() => setCatalogOverride(catalogDraft)}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              Guardar (override)
            </button>
          </div>

          <details className="mt-6">
            <summary className="cursor-pointer text-sm font-medium text-slate-700">Import/Export JSON</summary>
            <div className="mt-3 grid gap-3">
              <textarea className={taCls} value={catalogJson} readOnly />
              <ImportBox
                onImport={(raw) => {
                  const parsed = JSON.parse(raw) as CatalogConfig;
                  setCatalogDraft(parsed);
                }}
              />
            </div>
          </details>
        </section>
      </div>
    </AppLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-sm font-medium">{label}</div>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function ImportBox({ onImport }: { onImport: (raw: string) => void }) {
  const [raw, setRaw] = useState("");
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-black/10 p-4">
      <div className="text-sm font-medium">Importar JSON</div>
      <textarea
        className={taCls}
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder="Pega aquí un JSON válido..."
      />
      {err && <div className="mt-2 text-xs text-red-700">{err}</div>}
      <button
        onClick={() => {
          try {
            setErr(null);
            onImport(raw);
          } catch {
            setErr("JSON inválido");
          }
        }}
        className="mt-3 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
      >
        Cargar en editor
      </button>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-black/10 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200";

const taCls =
  "mt-2 w-full min-h-40 rounded-xl border border-black/10 px-4 py-2 font-mono text-xs outline-none focus:ring-2 focus:ring-slate-200";