import { NeoGatedStory } from "./NeoGatedStory";
import { NeoThemePanel } from "./NeoThemePanel";

export function NeoHiFiExploration() {
  return (
    <>
      <NeoGatedStory
        id="neo-hifi-exploration"
        label="03 _ HI-FI EXPLORATION"
        story={{
          title: "Too Late to Test, Too Risky Not To",
          body: "Two weeks before launch, the team was still misaligned on several key decisions. Product and Design wanted a final usability test, but leadership pushed back because testing all 10 flows and 200+ screens would take too long.",
        }}
        resolution={{
          title: "Breaking the Validation Trap",
          body: "After a tough leadership discussion, I grouped the open questions by type and matched each with the fastest research method. After a quick stakeholder sync, I ran 3 focused studies in 3 days, giving the team clear evidence to finalize the design.",
        }}
      />
      <NeoThemePanel />
    </>
  );
}
