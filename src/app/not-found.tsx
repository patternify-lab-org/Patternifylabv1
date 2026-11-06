import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="pageWrap">
      <section className="pageIntro">
        <span className="eyebrow">Not found</span>
        <h1 className="pageTitle">This learning page is not here yet.</h1>
        <p>The content may have moved, or it may not have been added to the repository.</p>
        <div className="buttonRow">
          <Link className="button buttonPrimary" href="/patterns">
            Browse patterns
          </Link>
          <Link className="button buttonSecondary" href="/">
            Return home
          </Link>
        </div>
      </section>
    </div>
  );
}
