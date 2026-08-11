import { JUDGE } from "@/data/imperium";
import JudgeConsoleClient from "./JudgeConsoleClient";

export function generateStaticParams() {
  return [{ token: JUDGE.token }];
}

export default function Page({ params }) {
  return <JudgeConsoleClient token={params.token} />;
}
