import Link from "next/link";
import { SearchSVG } from "./svg";

interface SubNavBarProps {
  selected: string;
}

// todo: select active link with bg-gray-700 and text-gray-100
export default function NavBar() {
  return (
    <nav className="flex h-32 w-full items-center justify-center gap-x-20 bg-gray-200 py-5">
      <img src="/logo.png" alt="logo" className="scale-50" />
      <ul className="flex gap-10 whitespace-pre">
        <li>
          <Link
            href="/"
            className="rounded-full bg-white px-5 py-3 font-semibold transition-all hover:bg-gray-100"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/"
            className="rounded-full bg-white px-5 py-3 font-semibold transition-all hover:bg-gray-100"
          >
            HR Services
          </Link>
        </li>
        <li>
          <Link
            href="/"
            className="rounded-full bg-white px-5 py-3 font-semibold transition-all hover:bg-gray-100"
          >
            Events & Announcements
          </Link>
        </li>
        <li>
          <Link
            href="/"
            className="rounded-full bg-white px-5 py-3 font-semibold transition-all hover:bg-gray-100"
          >
            Employee Directory
          </Link>
        </li>
        <li>
          <Link
            href="/"
            className="rounded-full bg-white px-5 py-3 font-semibold transition-all hover:bg-gray-100"
          >
            Feedback
          </Link>
        </li>
      </ul>

      <div className="flex items-center justify-center gap-5 text-gray-500">
        <SearchSVG />
        <div className="h-[48px] w-[48px] rounded-full bg-gray-500"></div>
      </div>
    </nav>
  );
}

export function SubNavBar(props: SubNavBarProps) {
  return (
    <div className="space flex w-full items-center justify-between">
      <div>{props.selected}</div>
      <ul className="flex">
        <li>
          <Link
            href="/"
            className="rounded-full bg-white px-5 py-3 font-semibold transition-all hover:bg-gray-100"
          >
            Time Off
          </Link>
        </li>
        <li>
          <Link
            href="/performance-evaluation"
            className="rounded-full bg-white px-5 py-3 font-semibold transition-all hover:bg-gray-100"
          >
            Performance Evaluations
          </Link>
        </li>
      </ul>
    </div>
  );
}
