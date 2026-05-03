import { Ticket, Shield } from "lucide-react";
import Link from "next/link";
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

          <div className="flex items-center gap-4">
            <Link
              href="/garantia"
              className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              Garantia
            </Link>
            <span className="text-border">|</span>
            <Link
              href="/faq"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              FAQ
            </Link>
            <span className="text-border">|</span>
            <p className="text-sm text-text-secondary">
              &copy; {new Date().getFullYear()} {SITE_NAME}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
