export default function Footer() {
  return (
    <footer className="footer-center mt-2 footer border-t-1 border-base-300 p-10 text-xs text-base-content">
      <p className="flex">
        Powered by{" "}
        <a
          href="https://emory-hack4impact.github.io/"
          target="_blank"
          className="link font-bold link-neutral link-hover"
          rel="noreferrer"
        >
          EmoryHack4Impact
        </a>{" "}
        &amp;{" "}
        <a
          href="https://www.linkedin.com/company/project-emory/"
          target="_blank"
          className="link font-bold link-neutral link-hover"
          rel="noreferrer"
        >
          PROJECT Emory
        </a>
      </p>
    </footer>
  );
}
