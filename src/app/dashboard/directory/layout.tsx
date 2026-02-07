export default function DirectoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex flex-col">{children}</main>
    </>
  );
}
