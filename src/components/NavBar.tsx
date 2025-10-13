import Link from "next/link";
import Image from "next/image";

interface SubNavBarProps {
  selected: string;
}

// todo: select active link with bg-gray-700 and text-gray-100
export default function NavBar() {
  return (
    <nav className="flex h-32 w-full items-center justify-between bg-gray-200 p-5">
      <Image width={125} height={125} src="/logo.png" alt="logo" />
      <div className="flex flex-row items-center">
        <ul className="flex h-full w-full items-center gap-8 whitespace-pre">
          <li className="h-full w-full">
            <Link
              href="/dashboard"
              className="rounded-full bg-white px-5 py-3 font-semibold transition-all hover:bg-gray-100"
            >
              Dashboard
            </Link>
          </li>
          <li className="h-full w-full">
            <Link
              href="/dashboard/hrservices"
              className="rounded-full bg-white px-5 py-3 font-semibold transition-all hover:bg-gray-100"
            >
              HR Services
            </Link>
          </li>
          <li className="h-full w-full">
            <Link
              href="/dashboard"
              className="rounded-full bg-white px-5 py-3 font-semibold transition-all hover:bg-gray-100"
            >
              Events & Announcements
            </Link>
          </li>
          <li className="h-full w-full">
            <form action="/api/auth/signout" method="post" className="">
              <button className="rounded-full bg-white px-5 py-3 font-semibold transition-all hover:cursor-pointer hover:bg-gray-100">
                Sign out
              </button>
            </form>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export function SubNavBar(props: SubNavBarProps) {
  return (
    <div className="space flex w-full items-center justify-between">
      <div>{props.selected}</div>
    </div>
  );
}
