import { CTAButton, PageHero } from '../components/common';
import { usePageMeta } from '../lib/hooks';

export default function NotFound() {
  usePageMeta('Page not found', 'The page you were looking for could not be found.');
  return (
    <>
      <PageHero eyebrow="404" title={<>Off the <em>programme</em></>} lede="We couldn't find that page." />
      <section className="section section--tight">
        <div className="container">
          <CTAButton to="/">Back to home</CTAButton>
        </div>
      </section>
    </>
  );
}
