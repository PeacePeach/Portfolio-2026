import { NeoStoryInteraction } from './NeoStoryInteraction';
import { NeoThemePanel } from './NeoThemePanel';

export function NeoValidation() {
  return <NeoStoryInteraction
    id="neo-validation"
    chapter="03 _ HI-FI EXPLORATION"
    className="neo-validation-section"
    problemTitle={"Too Late to Test,\nToo Risky Not To"}
    problemBody="Two weeks before launch, the team was still misaligned on several key decisions. Product and Design wanted a final usability test, but leadership pushed back because testing all 10 flows and 200+ screens would take too long."
    resolutionTitle={"Breaking the\nValidation Trap"}
    resolutionBody="After a tough leadership discussion, I grouped the open questions by type and matched each with the fastest research method. After a quick stakeholder sync, I ran 3 focused studies in 3 days, giving the team clear evidence to finalize the design."
  ><NeoThemePanel /></NeoStoryInteraction>;
}
