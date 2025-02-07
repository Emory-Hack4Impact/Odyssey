import Link from "next/link";
import Image from "next/image";
import AuthButton from "./AuthButton";

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
              href="/dashboard/time-off"
              className="rounded-full bg-white px-5 py-3 font-semibold transition-all hover:bg-gray-100"
            >
              Time Off
            </Link>
          </li>
          <li className="h-full w-full">
            <Link
              href="/dashboard/performance-evaluation"
              className="rounded-full bg-white px-5 py-3 font-semibold transition-all hover:bg-gray-100"
            >
              Performance
            </Link>
          </li>
          <li className="h-full w-full">
            <AuthButton />
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
