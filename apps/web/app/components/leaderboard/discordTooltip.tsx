import Image from "next/image";
import { useState } from "react";

export default function DiscordTooltip({ username }: { username: string }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative flex items-center">
      <button
        className="text-indigo-500 hover:text-indigo-400 cursor-pointer"
        onClick={() => setShow(!show)}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <Image className="w-5 h-5" width={23} height={23} src="/imgs/discord.png" alt="Discord" />
      </button>

      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-white shadow-lg">
          <div className="text-xs">Discord: {username}</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
        </div>
      )}
    </div>
  );
}
