"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Detect current pathname and add `btn-neutral` class to the active link(s)
export default function NavBar() {
  const pathname = usePathname() || "/";

  const isActive = (href: string, exact = false) => {
    if (!href) return false;
    // exact match or href is a prefix of the pathname (e.g. /dashboard -> /dashboard/xyz)
    return pathname === href || (!exact && pathname.startsWith(href + "/"));
  };

  return (
    <nav className="navbar bg-gray-100 px-5 shadow-sm">
      <div className="flex w-full items-center justify-between gap-6">
        <Image width={125} height={125} src="/logo.png" alt="logo" />
        <ul className="flex items-center gap-4 whitespace-pre">
          <li>
            <Link
              href="/dashboard"
              className={`btn rounded-full border-none bg-white font-normal text-gray-800 hover:bg-gray-100 hover:text-gray-800 ${isActive("/dashboard", true) ? "!bg-black !text-white hover:!bg-gray-800 hover:!text-white" : ""}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/hrservices"
              className={`btn rounded-full border-none bg-white font-normal text-gray-800 hover:bg-gray-100 hover:text-gray-800 ${isActive("/dashboard/hrservices") ? "!bg-black !text-white hover:!bg-gray-800 hover:!text-white" : ""}`}
            >
              HR Services
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/bulletin"
              className={`btn rounded-full border-none bg-white font-normal text-gray-800 hover:bg-gray-100 hover:text-gray-800 ${isActive("/dashboard/bulletin") ? "!bg-black !text-white hover:!bg-gray-800 hover:!text-white" : ""}`}
            >
              Events & Announcements
            </Link>
          </li>
          <li>
            <form action="/api/auth/signout" method="post" className="">
              <button className="btn rounded-full border-none bg-white font-normal text-gray-800 hover:bg-gray-100">
                Sign out
              </button>
            </form>
          </li>
        </ul>
      </div>
    </nav>
  );
}
