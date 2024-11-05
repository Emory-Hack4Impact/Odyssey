import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { useUser } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await useUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-full w-full flex-col">
      <NavBar />
      <div className="p-8">{children}</div>
      <Footer />
    </div>
  );
}
