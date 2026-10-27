import HomeHero from '../sections/HomeHero';
import TrustStrip from '../sections/TrustStrip';
import ServicesSection from '../sections/ServicesSection';
import AboutSection from '../sections/AboutSection';
import CoachesSection from '../sections/CoachesSection';
import GallerySection from '../sections/GallerySection';
import ResultsSection from '../sections/ResultsSection';
import FAQSection from '../sections/FAQSection';
import EnquirySection from '../sections/EnquirySection';
import { siteConfig } from '../content/siteConfig';
import { usePageMeta } from '../lib/hooks';

export default function Home() {
  usePageMeta(
    siteConfig.name,
    'ACSES Fitness Studio, Chennai — coaching-led strength, conditioning and movement training built around your goals and long-term progress.',
  );
  return (
    <>
      <HomeHero />
      <TrustStrip />
      <ServicesSection limit={6} />
      <AboutSection />
      <CoachesSection />
      <GallerySection />
      <ResultsSection />
      <FAQSection />
      <EnquirySection />
    </>
  );
}
