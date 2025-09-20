import Link from "next/link";

export default function Footer() {

  return (
    <div className="h-[200px] bg-white text-white">
      <header className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-8 border-b border-gray-300 pb-4 mb-4">
        <Link href="/" className="flex items-center text-4xl font-bold gap-2">
          <span className="text-white select-none">
            We
          </span>
          <span className="text-indigo-600">
            Phix
          </span>
        </Link>

        <div className="flex flex-col items-center justify-center sm:border-l border-gray-300 sm:pl-8">
          <div className="mx-auto">
            <h1 className="text-black text-xl">Join Now</h1>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer">
              <img className="object-cover" src="/imgs/discord.png" alt="Discord" />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer">
              <img className="object-cover" src="/imgs/reddit.png" alt="Reddit" />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer">
              <img className="object-cover" src="/imgs/twitter.png" alt="Twitter" />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer">
              <img className="object-cover" src="/imgs/telegram.png" alt="Telegram" />
            </button>
          </div>
        </div>
      </header>
      <footer className="mt-10 text-sm text-gray-600">
        <div className="flex flex-wrap gap-4 mb-2">
          <a href="#" className="hover:text-gray-900">Terms of service</a>
          <a href="#" className="hover:text-gray-900">DMCA</a>
          <a href="#" className="hover:text-gray-900">Contact</a>
        </div>
        <p>WePhoneSpec does not store any files on our server, we only linked to the media which is hosted on 3rd party services.</p>
        <p>© WePhoneSpec.to. All rights reserved.</p>
      </footer>
    </div>
  );
}