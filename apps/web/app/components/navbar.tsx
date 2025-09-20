import Link from "next/link";

export default function Navbar() {
  const user = null
  return (
    <>
      <header className="w-full text-gray-700 bg-white border-b-1">
        <div className="w-full h-15 flex md:flex-row sm:py-2 items-center gap-6">
          <Link href="/" className="flex flex-wrap flex-shrink-1 sm:flex-shrink-0 text-xl sm:text-2xl items-center justify-center font-black text-gray-900 select-none">
            <span>We</span>
            <span className="text-indigo-600">Phix</span>
          </Link>
          <nav className="w-full">
            <div className="flex gap-6 w-full">
              <Link
                href="/"
                className="font-medium text-gray-600 hover:text-gray-900"
              >
                <span>Home</span>
              </Link>
              <Link
                href="/leaderboard"
                className="font-medium text-gray-600 hover:text-gray-900"
              >
                <span>Leaderboard</span>
              </Link>
              <Link
                href="/about"
                className="font-medium text-gray-600 hover:text-gray-900"
              >
                About
              </Link>
            </div>
          </nav>
          <div className="flex w-auto ml-auto">
            {user ? 
            <div
              // name={user.name}
              // email={user.email}
              // profileImage={user.profileImage}
              // role={user.role}
            >User</div> :
            <button 
              className="cursor-pointer"
              >
              Login
            </button>}
          </div>
        </div>
      </header>
    </>
  )
}