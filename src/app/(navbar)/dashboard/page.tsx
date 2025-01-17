import { SubNavBar } from "@/components/NavBar";

export default async function Index() {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-20">
      <div className="animate-in flex max-w-4xl flex-1 flex-col gap-20 px-3 opacity-0">
        <SubNavBar selected="HR Services for Jane" />
      </div>
    </div>
  );
}
