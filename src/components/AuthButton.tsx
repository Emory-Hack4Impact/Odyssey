import { signOut, useUser } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AuthButton() {
  const user = await useUser();

  async function signout() {
    "use server";
    await signOut();
  }

  return user ? (
    <form action={signout} className="">
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
