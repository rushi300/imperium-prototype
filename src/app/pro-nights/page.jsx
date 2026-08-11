"use client";

import Image from "next/image";
import { useImperium } from "@/context/ImperiumContext";
import { Section, SectionHead, Button, Reveal, HeroPhoto, SynapseField } from "@/components/ui";
import { HERO_IMAGES, PRO_NIGHT_IMAGES } from "@/lib/media";
import Link from "next/link";

export default function ProNights() {
  const { proNights, mode } = useImperium();
  return (
    <>
      <div className="relative overflow-hidden border-b border-line min-h-[420px] flex items-center">
        <HeroPhoto {...HERO_IMAGES.proNights} tint="flame" priority />
        <SynapseField className="absolute inset-0 w-full h-full opacity-50" nodeColor="#FF8A3D" />
        <div className="relative max-w-shell mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-20 w-full">
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.14em] text-magenta font-semibold mb-4">Pro Nights</div>
            <h1 className="font-display text-[38px] sm:text-[56px] font-extrabold leading-[1.02] mb-4">
              Three nights on the Central Lawn.
            </h1>
            <p className="text-[17px] text-ink-2 max-w-prose">
              Every day of Imperium closes on the lawn. Entry is free for all registered attendees with a valid college ID
              — gates open at 6:30 PM.
            </p>
          </Reveal>
        </div>
      </div>

      <Section>
        <div className="grid sm:grid-cols-3 gap-4">
          {proNights.map((p, i) => {
            const img = PRO_NIGHT_IMAGES[i % PRO_NIGHT_IMAGES.length];
            return (
              <Reveal key={p.day} delay={i * 0.07}>
                <div className="group relative rounded-lg overflow-hidden h-[320px] border border-line">
                  <Image src={img.src} alt="" fill sizes="(min-width:640px) 33vw, 100vw" className="object-cover transition-transform duration-500 ease-imp group-hover:scale-[1.06]" />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />
                  <div className="relative h-full flex flex-col justify-end p-6">
                    <div className="text-[11px] uppercase tracking-[0.12em] text-magenta font-bold mb-3">{p.day}</div>
                    <h2 className="font-display text-[28px] font-extrabold mb-2 leading-tight">{p.act}</h2>
                    <p className="text-[15px] text-ink-2">{p.type}</p>
                    <div className="mt-5 pt-5 border-t border-line/60 text-[14px] text-ink-2 space-y-1">
                      <p>{p.time}</p>
                      <p className="text-ink-3">{p.venue}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-10 bg-surface border border-line rounded-lg p-6">
          <h2 className="font-display text-[20px] font-bold mb-3">Entry</h2>
          <ul className="space-y-2.5 text-[15px] text-ink-2">
            <li className="flex gap-3"><span className="text-magenta">·</span> Gates open at 6:30 PM on all three days.</li>
            <li className="flex gap-3"><span className="text-magenta">·</span> Free for all attendees with a valid college ID.</li>
            <li className="flex gap-3"><span className="text-magenta">·</span> Your Imperium Pass speeds up entry at the gate.</li>
            <li className="flex gap-3"><span className="text-magenta">·</span> No outside food, drink or professional cameras.</li>
          </ul>
          <Button as={Link} href="/pass" className="mt-5">Get your Pass</Button>
        </div>

        <p className="mt-8 text-[12px] text-ink-dis max-w-prose leading-relaxed">
          Shaan, Euphoria and The Local Train are named on the current Imperium site as past performers. Their placement
          in this line-up is illustrative for the prototype and is not an announced booking.
        </p>
      </Section>
    </>
  );
}
