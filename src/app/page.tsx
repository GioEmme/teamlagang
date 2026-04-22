import { HeroCarousel } from "@/components/sections/HeroCarousel";
import { IntroManifesto } from "@/components/sections/IntroManifesto";
import { Categories } from "@/components/sections/Categories";
import { TrackSection } from "@/components/sections/TrackSection";
import { TeamPreview } from "@/components/sections/TeamPreview";
import { NewsPreview } from "@/components/sections/NewsPreview";
import { CTA } from "@/components/sections/CTA";
import { getHeroImages } from "@/lib/heroImages";
import { getManifestoImage } from "@/lib/manifestoImage";
import { getCategoryImages } from "@/lib/categoryImages";
import { getTeamImages } from "@/lib/teamImages";

export default function Home() {
  const heroImages = getHeroImages();
  const manifestoImage = getManifestoImage();
  const categoryImages = getCategoryImages();
  const teamImages = getTeamImages();
  return (
    <>
      <HeroCarousel images={heroImages} />
      <IntroManifesto image={manifestoImage} />
      <Categories images={categoryImages} />
      <TrackSection />
      <TeamPreview images={teamImages} />
      <NewsPreview />
      <CTA />
    </>
  );
}
