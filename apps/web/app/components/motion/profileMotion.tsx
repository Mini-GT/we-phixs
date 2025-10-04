import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { UserRound, X } from "lucide-react";
import IconButton from "../ui/iconButton";
import ProfileForm from "../form/profileForm";
import { useSelectedContent } from "@/context/selectedContent.context";

export default function ProfileMotion() {
  const { setSelectedContent } = useSelectedContent();

  return (
    <motion.div
      className="absolute z-50 flex -inset-2 items-center justify-center backdrop-blur-xs shadow-lg bg-black/5"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`relative w-full max-w-3xl p-6 bg-white rounded-4xl gap-2`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
              <UserRound fill="#8e44ad" strokeWidth={0} className="mr-3 h-7 w-7" />
              Edit Profile
            </div>
          </div>
          <IconButton
            className="top-2 right-2 text-gray-600 hover:text-gray-900"
            aria-label="Close form"
            onClick={() => setSelectedContent(null)}
          >
            <X size={20} />
          </IconButton>
        </div>

        <ProfileForm />
      </Card>
    </motion.div>
  );
}
