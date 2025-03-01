import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header>
        <NavBar />
      </header>
      <main className="flex flex-col"> {children}
        
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
