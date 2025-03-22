import { Code2 } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { signOut, useSession } from "next-auth/react"


function Header() {
    const { data: session, status } = useSession();
    const firstChar = session?.user?.email?.charAt(0).toUpperCase();
  
  return (
    <div className="flex items-center justify-between mx-4 py-3">
    <Link href="/" className="cursor-pointer">
      {" "}
      <Code2 />   
    </Link>
    {status === "authenticated" ? (
      <div className="flex items-center justify-center gap-2">
        <Button onClick={() => signOut()} className="cursor-pointer">
          Logout{" "}
        </Button>
        <p className="h-9 w-9 font-semibold cursor-pointer hover:bg-gray-200 bg-white rounded-full text-black flex items-center justify-center">
          {firstChar}
        </p>
      </div>
    ) : (
      <Link 
        href="/signin"
        className="cursor-pointer bg-white text-black px-3 py-1 rounded font-semibold hover:bg-gray-200"
      >
        Sign In
      </Link>
    )}
  </div>
  )
}

export default Header