import { useUser } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AuthButton() {
  const user = await useUser();

  return user ? (
    <form action="/auth/signout" method="post" className="">
      <button className="rounded-full bg-white px-5 py-3  font-semibold transition-all hover:bg-gray-100">
        Logout
      </button>
    </form>
  ) : (
    <Link
      href="/login"
      className="rounded-full bg-white px-5 py-3 font-semibold transition-all hover:bg-gray-100"
    >
      Login
    </Link>
  );
}
