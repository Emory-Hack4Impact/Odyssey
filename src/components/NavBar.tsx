"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Detect current pathname and add `btn-neutral` class to the active link(s)
export default function NavBar() {
  const pathname = usePathname() || "/";

  const activeClass = (href: string, exact = false) => {
    if (!href) return "";
    // exact match or href is a prefix of the pathname (e.g. /dashboard -> /dashboard/xyz)
    return pathname === href || (!exact && pathname.startsWith(href + "/")) ? "btn-neutral" : "";
  };

  return (
    <nav className="navbar justify-between bg-base-100 px-5 shadow-sm">
      <Image width={125} height={125} src="/logo.png" alt="logo" />
      <div className="flex flex-row items-center">
        <ul className="flex h-full w-full items-center gap-8 whitespace-pre">
          <li className="h-full w-full">
            <Link
              href="/dashboard"
              className={`btn rounded-full ${activeClass("/dashboard", true)}`}
            >
              Dashboard
            </Link>
          </li>
          <li className="h-full w-full">
            <Link
              href="/dashboard/hrservices"
              className={`btn rounded-full ${activeClass("/dashboard/hrservices")}`}
            >
              HR Services
            </Link>
          </li>
          <li className="h-full w-full">
            <Link
              href="/dashboard/bulletin"
              className={`btn rounded-full ${activeClass("/dashboard/bulletin")}`}
            >
              Events & Announcements
            </Link>
          </li>
          <li className="h-full w-full">
            <Link
              href="/dashboard/directory"
              className={`btn rounded-full ${activeClass("/dashboard/directory")}`}
            >
              Directory
            </Link>
          </li>
          <li className="h-full w-full">
            <form action="/api/auth/signout" method="post" className="">
              <button className="btn rounded-full">Sign out</button>
            </form>
          </li>
        </ul>
      </div>
    </nav>
  );
}
