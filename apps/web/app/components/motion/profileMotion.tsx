import { Card } from "../ui/card";
import { UserRound, X } from "lucide-react";
import IconButton from "../ui/iconButton";
import ProfileForm from "../form/profileForm";
import { useSelectedContent } from "@/context/selectedContent.context";
import { type RefObject } from "react";
import MotionComponent from "./motion";
import { useUser } from "@/context/user.context";

export default function ProfileMotion({ cardRef }: { cardRef: RefObject<HTMLDivElement | null> }) {
  const { user } = useUser();
  const { setSelectedContent } = useSelectedContent();

  return (
    <MotionComponent>
      <Card
        ref={cardRef}
        className={`relative w-[95vw] max-w-[600px] h-[90vh] ${user?.discord?.username ? "max-h-[785px]" : "max-h-[640px]"} overflow-y-auto scrollbar-custom p-6 bg-white border-cyan-300 rounded-4xl`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
              <UserRound fill="#8e44ad" strokeWidth={0} className="mr-3 h-7 w-7" />
              Edit Profile
            </div>
          </div>
          <IconButton
            className="top-2 right-2 shadow-none border-none text-gray-600 hover:text-gray-900"
            aria-label="Close form"
            onClick={() => setSelectedContent(null)}
          >
            <X size={20} />
          </IconButton>
        </div>

        <ProfileForm />
      </Card>
    </MotionComponent>
  );
}
