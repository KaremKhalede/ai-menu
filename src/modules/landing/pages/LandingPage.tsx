'use client';

import { useLanding } from '../hooks/useLanding';
import { LandingNav } from '../components/LandingNav';
import { LandingHero } from '../components/LandingHero';
import { LandingFeatures } from '../components/LandingFeatures';
import { LandingHowItWorks } from '../components/LandingHowItWorks';
import { LandingDemoPreview } from '../components/LandingDemoPreview';
import { LandingCTA } from '../components/LandingCTA';
import { LandingFooter } from '../components/LandingFooter';

/**
 * Landing Page.
 *
 * This orchestrator is extremely thin and focused (under 50 lines):
 *  - Links all landing marketing panels: navigation, hero descriptors, features, previews, and footers.
 *  - Coordinates routing actions using useLanding hook.
 */
export default function LandingPage() {
  const form = useLanding();

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation header bar */}
      <LandingNav form={form} />

      {/* Main hero title presentation */}
      <LandingHero form={form} />

      {/* Grid of features list */}
      <LandingFeatures />

      {/* Step by step directions */}
      <LandingHowItWorks />

      {/* Visual mobile preview mock */}
      <LandingDemoPreview form={form} />

      {/* Registration call to action banner */}
      <LandingCTA form={form} />

      {/* Footer copyright anchors */}
      <LandingFooter />
    </div>
  );
}
