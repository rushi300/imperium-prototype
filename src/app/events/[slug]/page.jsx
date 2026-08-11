import { EVENTS } from "@/data/imperium";
import EventDetailClient from "./EventDetailClient";

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export default function Page({ params }) {
  return <EventDetailClient slug={params.slug} />;
}
