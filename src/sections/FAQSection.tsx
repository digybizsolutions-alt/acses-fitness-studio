import FAQAccordion from '../components/FAQAccordion/FAQAccordion';
import { SectionHead } from '../components/common';
import { faqs } from '../content/faqs';
import { isPublishable } from '../content/siteConfig';

export default function FAQSection() {
  const list = faqs.filter(isPublishable);
  if (list.length === 0) return null;
  return (
    <section className="section" aria-labelledby="faq-title">
      <div className="container faq-layout">
        <SectionHead
          eyebrow="FAQ"
          title={
            <span id="faq-title">
              Good <em>questions</em>
            </span>
          }
          lede="Everything you need to know before your first visit."
        />
        <FAQAccordion items={list} />
      </div>
    </section>
  );
}
