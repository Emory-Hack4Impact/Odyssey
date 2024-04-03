import Link from "next/link";
import { SearchSVG } from "./svg";

interface SubNavBarProps {
    selected: string;
}

// todo: select active link with bg-gray-700 and text-gray-100
export default function NavBar() {
    return (
        <nav className="flex w-full h-32 py-5 items-center justify-center gap-x-20 bg-gray-200">
            <img src="/logo.png" alt="logo" className="scale-50" />
            <ul className="flex gap-10 whitespace-pre">
                <li>
                    <Link href="/" className="bg-white px-5 py-3 rounded-full transition-all font-semibold hover:bg-gray-100">
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link href="/" className="bg-white px-5 py-3 rounded-full transition-all font-semibold hover:bg-gray-100">
                        HR Services
                    </Link>
                </li>
                <li>
                    <Link href="/" className="bg-white px-5 py-3 rounded-full transition-all font-semibold hover:bg-gray-100">
                        Events & Announcements
                    </Link>
                </li>
                <li>
                    <Link href="/" className="bg-white px-5 py-3 rounded-full transition-all font-semibold hover:bg-gray-100">
                        Employee Directory
                    </Link>
                </li>
                <li>
                    <Link href="/" className="bg-white px-5 py-3 rounded-full transition-all font-semibold hover:bg-gray-100">
                        Feedback
                    </Link>
                </li>
            </ul>
            
            <div className="flex gap-5 items-center justify-center text-gray-500">
                <SearchSVG />
                <div className="rounded-full w-[48px] h-[48px] bg-gray-500"></div>
            </div>
            
        </nav>
    );
}

export function SubNavBar(props: SubNavBarProps) {
    return (
        <div className="flex w-full space items-center justify-between">
            <div>
                {props.selected}
            </div>
            <ul className="flex">
                <li>
                    <Link href="/" className="bg-white px-5 py-3 rounded-full transition-all font-semibold hover:bg-gray-100">
                        Time Off
                    </Link>
                </li>
                <li>
                    <Link href="/performance-evaluation" className="bg-white px-5 py-3 rounded-full transition-all font-semibold hover:bg-gray-100">
                        Performance Evaluations
                    </Link>
                </li>
            </ul>
        </div>
    );
}
