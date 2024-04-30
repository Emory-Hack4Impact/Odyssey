import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { SubNavBar } from "@/components/NavBar";

export default async function Index() {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-20">
      <NavBar />
      <SubNavBar selected="HR Services for Jane" />
      <div className="animate-in flex max-w-4xl flex-1 flex-col gap-20 px-3 opacity-0">
        <main className="flex flex-1 flex-col gap-6"></main>
      </div>
      <Footer />
    </div>
  );
}
