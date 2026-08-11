"use client";

import Link from "next/link";
import Image from "next/image";
import { useImperium } from "@/context/ImperiumContext";
import { Section, SectionHead, Button, Reveal, HeroPhoto, SynapseField, InitialsAvatar } from "@/components/ui";
import { HERO_IMAGES, GALLERY_IMAGES } from "@/lib/media";

export default function AboutPage() {
  const { edition, team, editions } = useImperium();
  const verticals = Array.from(new Set(team.map((t) => t.vertical)));

  return (
    <>
      <div className="relative overflow-hidden border-b border-line min-h-[300px] flex items-end">
        <HeroPhoto {...HERO_IMAGES.about} tint="magenta" priority />
        <SynapseField className="absolute inset-0 w-full h-full opacity-40" />
        <div className="relative max-w-shell mx-auto px-4 sm:px-6 lg:px-12 py-12 w-full">
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.12em] text-magenta font-semibold mb-2">About</div>
            <h1 className="font-display text-[36px] sm:text-[48px] font-extrabold leading-[1.05]">Imperium</h1>
          </Reveal>
        </div>
      </div>

      <Section>
        <div className="max-w-prose space-y-4 text-[16px] text-ink-2 leading-relaxed">
          <p>
            Imperium is MDI Gurgaon&apos;s flagship annual festival, spanning management competitions, sports and
            culture. It draws participants from top institutions across the country, including the IIMs, XLRI, SP Jain
            and the IITs.
          </p>
          <p>
            Competitions run across strategy, marketing, finance, human resources and operations, alongside a full
            cultural and sports programme and three nights of live performances.
          </p>
          <p className="text-ink">{edition.theme}.</p>
        </div>
      </Section>

      <Section id="team" className="border-t border-line scroll-mt-20">
        <SectionHead eyebrow="Who runs it" title="The team" />
        <p className="text-ink-2 max-w-prose mb-8">
          Grouped by vertical, so you can find the right person rather than a generic inbox.
        </p>
        {verticals.map((v) => (
          <div key={v} className="mb-8">
            <h3 className="text-[11px] uppercase tracking-[0.12em] text-magenta font-semibold mb-3">{v}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {team.filter((t) => t.vertical === v).map((t) => (
                <div key={t.id} className="bg-surface border border-line rounded-md p-4 flex items-center gap-3">
                  <InitialsAvatar name={t.name} size={40} />
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{t.name}</div>
                    <div className="text-[13px] text-ink-3 truncate">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <p className="text-[12px] text-ink-dis">
          Names and roles are taken from the current Imperium site. This is a subset of the full committee.
        </p>
      </Section>

      <Section id="gallery" className="border-t border-line scroll-mt-20">
        <SectionHead eyebrow="Archive" title="Gallery" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {GALLERY_IMAGES.map((g, i) => (
            <Reveal key={g.src} delay={Math.min(i, 6) * 0.05}>
              <div className="group relative aspect-[4/3] rounded-md overflow-hidden border border-line bg-surface">
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-imp group-hover:scale-[1.08]"
                />
              </div>
            </Reveal>
          ))}
        </div>
        <p className="text-[13px] text-ink-3 mt-4 max-w-prose">
          Illustrative stock photography chosen to match Imperium&apos;s tracks and energy — not verified photography
          from a specific edition. A production gallery would be filtered by edition and event from the real media
          library.
        </p>
      </Section>

      <Section id="editions" className="border-t border-line scroll-mt-20">
        <SectionHead eyebrow="Every year" title="Past editions" />
        <div className="grid sm:grid-cols-3 gap-4">
          {editions.map((ed) => (
            <div key={ed.id} className="bg-surface border border-line rounded-lg p-5">
              <div className="font-display text-[24px] font-extrabold mb-1">{ed.name}</div>
              <div className="text-[13px] text-ink-3 mb-4">
                {ed.status === "archived" ? "Archived · permanently readable" : "Current edition"}
              </div>
              <Button as={Link} href="/results" variant="ghost" size="sm">Results →</Button>
            </div>
          ))}
        </div>
      </Section>

      <Section id="contact" className="border-t border-line scroll-mt-20">
        <SectionHead eyebrow="Reach us" title="Contact" />
        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
          <div className="bg-surface border border-line rounded-md p-5">
            <div className="text-[11px] uppercase tracking-[0.1em] text-ink-3 font-semibold mb-2">General</div>
            <a href="mailto:imperium@mdi.ac.in" className="text-magenta hover:underline">imperium@mdi.ac.in</a>
            <p className="text-[14px] text-ink-2 mt-2">{edition.venueName}</p>
          </div>
          <div className="bg-surface border border-line rounded-md p-5">
            <div className="text-[11px] uppercase tracking-[0.1em] text-ink-3 font-semibold mb-2">Sponsorships</div>
            <div className="font-semibold">Soumya Sharma</div>
            <a href="tel:+919654330572" className="text-[14px] text-magenta hover:underline">+91 96543 30572</a>
            <div className="mt-3"><Button as={Link} href="/partner" variant="secondary" size="sm">Partner with us</Button></div>
          </div>
        </div>
      </Section>
    </>
  );
}
