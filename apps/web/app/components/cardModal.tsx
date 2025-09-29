import { X } from "lucide-react";
import { Card } from "./ui/card";
import { useComponent } from "@/context/component.context";
import IconButton from "./ui/iconButton";

export default function CardModal({children}: {children: React.ReactNode}) {
  const { setComponent } = useComponent()

  const closeModalCard = () => {
    setComponent(null)
  }

  return (
    <div className="flex z-50 inset-0 absolute items-center justify-center backdrop-blur-xs bg-black/50">
      <Card className={`relative w-full max-w-sm p-6 bg-white rounded-2xl shadow-lg animate-popup-enter`}>
        <IconButton
          onClick={closeModalCard} 
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          aria-label="Close form"
        >
          <X size={20} />
        </IconButton>
      {children}
      </Card>
    </div>
  )
}