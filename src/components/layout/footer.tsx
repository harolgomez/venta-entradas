import { Ticket } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-accent" />
            <span className="font-bold text-text-primary">{SITE_NAME}</span>
          </div>
          <p className="text-sm text-text-secondary">
            &copy; {new Date().getFullYear()} {SITE_NAME}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
