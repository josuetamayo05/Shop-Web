import { NavLink, Link } from "react-router-dom";
import { useConfig } from "../../app/providers/ConfigProvider";

const base =
  "rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100";
const active =
  "rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 bg-slate-100";

export function Navbar({ cartCount = 0 }: { cartCount?: number }) {
  const config = useConfig();

  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-slate-900 text-xs font-semibold text-white">
            {config.brand.logoText}
          </div>
          <span className="font-semibold tracking-tight">{config.brand.name}</span>
        </Link>

        <nav className="flex items-center gap-1">
          {config.navigation.map((item) => {
            const isCart = item.to === "/cart";

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? active : base)}
              >
                <span className="inline-flex items-center gap-2">
                  {item.label}
                  {isCart && cartCount > 0 && (
                    <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
                      {cartCount}
                    </span>
                  )}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}