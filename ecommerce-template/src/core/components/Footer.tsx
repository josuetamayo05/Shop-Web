import { useConfig } from "../../app/providers/ConfigProvider";

export function Footer(){
    const config=useConfig();
    const text = config.footer.text.replace("{{year}}", String(new Date().getFullYear()));
    return (
        <footer className="border-t border-black/10 bg-white">
            <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-600">
                {text}
            </div>
        </footer>
    );
}