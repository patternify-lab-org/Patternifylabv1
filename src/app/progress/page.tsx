import type { Metadata } from "next";
import { Eyebrow } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "My Progress",
  description: "A future view of learning progress saved on this device."
};

export default function ProgressPage() {
  return (
    <div className="pageWrap">
      <section className="pageIntro">
        <Eyebrow>Your learning, at your pace</Eyebrow>
        <h1 className="pageTitle">My Progress</h1>
        <p>
          Progress tracking is planned for a later phase. The foundation avoids accounts and keeps
          the door open for private, device-local progress when learning activities are available.
        </p>
      </section>
      <section className="pageSectionTight">
        <div className="infoPanel">
          <h2>Start with understanding</h2>
          <p>
            For now, explore the Sliding Window sample and use your own notes to track what you want
            to practise next.
          </p>
        </div>
      </section>
    </div>
  );
}
