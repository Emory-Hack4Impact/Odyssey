export default function Footer() {
  return (
    <footer className="flex w-full justify-center border-t border-t-foreground/10 p-8 text-center text-xs">
      <p>
        Powered by{" "}
        <a
          href="https://emory-hack4impact.github.io/"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          EmoryHack4Impact
        </a>
      </p>
    </footer>
  );
}
