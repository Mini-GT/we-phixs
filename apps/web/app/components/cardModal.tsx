import { X } from "lucide-react";
import { Card } from "./ui/card";
import IconButton from "./ui/iconButton";
import Link from "next/link";

export default function CardModal({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute flex z-50 -inset-2 items-center justify-center backdrop-blur-xs bg-black/50">
      <Card
        className={`relative w-full max-w-sm p-6 bg-white rounded-2xl shadow-lg animate-popup-enter`}
      >
        <Link href="/">
          <IconButton
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            aria-label="Close form"
          >
            <X size={20} />
          </IconButton>
        </Link>
        {children}
      </Card>
    </div>
  );
}
