import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EventNotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-accent mb-4">404</h1>
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Evento no encontrado
        </h2>
        <p className="text-text-secondary mb-6">
          El evento que buscas no existe o fue eliminado.
        </p>
        <Link href="/events">
          <Button>Ver todos los eventos</Button>
        </Link>
      </div>
    </div>
  );
}
