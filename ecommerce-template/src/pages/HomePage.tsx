import { Link } from "react-router-dom";
import { AppLayout } from "../layout/AppLayout";
import { useConfig } from "../app/providers/ConfigProvider";


export function HomePage(){
    const config = useConfig();

    return (
        <AppLayout>
            <section className="rounded-2xl border border-black/10 bg-white p-10">
                <h1 className="text-4xl font-bold tracking-tight">
                    {config.home.heroTitle}
                </h1>

                <p className="mt-4 text-slate-600">
                    {config.home.heroSubtitle}
                </p>

                <div className="mt-8 flex gap-3">
                    <Link
                        to={config.home.primaryCta.to}
                        className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
                    >
                        {config.home.primaryCta.label}
                    </Link>

                    <Link
                        to={config.home.secondaryCta.to}
                        className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-medium"
                    >
                        {config.home.secondaryCta.label}
                    </Link>
                </div>
            </section>
        </AppLayout>
    );
}
