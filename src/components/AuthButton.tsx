export default async function AuthButton() {
  return (
    <form action="/auth/signout" method="post" className="">
      <button className="rounded-full bg-white px-5 py-3  font-semibold transition-all hover:bg-gray-100">
        Sign out
      </button>
    </form>
  );
}
