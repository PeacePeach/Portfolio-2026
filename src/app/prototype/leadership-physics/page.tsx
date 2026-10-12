import type { Metadata } from "next";
import { LeadershipPhysics } from "./LeadershipPhysics";

export const metadata: Metadata = { title: "Leadership physics (prototype)", robots: { index: false } };

/** Isolated interaction experiment. Not linked from the site; do not reuse yet. */
export default function LeadershipPhysicsPrototype() {
  return (
    <main id="main" className="relative h-[100svh] w-full overflow-hidden bg-background">
      <LeadershipPhysics />
    </main>
  );
}
