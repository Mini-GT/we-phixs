import { useSelectedContent } from "@/context/selectedContent.context";
import { Mail, Plus } from "lucide-react";

export default function Guild() {
  const { setSelectedContent } = useSelectedContent();

  return (
    <div className="w-full max-w-2xl relative">
      {/* Content */}
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <p className="text-gray-500 text-center mb-12">You are not in a guild:</p>

        {/* Get invited button */}
        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors">
          <Mail className="w-5 h-5" />
          <span className="font-medium">Get invited to a guild</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 w-full max-w-md mb-8">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Create guild button */}
        <button
          onClick={() => setSelectedContent("createGuild")}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5 text-gray-700" />
          <span className="font-medium text-gray-700">Create a guild</span>
        </button>
      </div>
    </div>
  );
}
