import Link from "next/link";

export default function NavBar() {
    return (
        <nav className="flex items-center justify-center p-6 gap-x-20">
            <div>
                <img src="/logo.png" alt="logo" className="h-full w-full" />
            </div>
            <ul className="flex gap-10">
                <li>
                    <Link href="/">
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link href="/">
                        HR Services
                    </Link>
                </li>
                <li>
                    <Link href="/">
                        Events & Announcements
                    </Link>
                </li>
                <li>
                    <Link href="/">
                        Employee Directory
                    </Link>
                </li>
                <li>
                    <Link href="/">
                        Feedback
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
