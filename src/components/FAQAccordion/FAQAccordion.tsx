import { useId, useState } from 'react';
import { Plus } from 'lucide-react';
import type { Faq } from '../../content/faqs';
import { DraftBadge } from '../common';
import './FAQAccordion.css';

export default function FAQAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  const base = useId();
  return (
    <div className="faq">
      {items.map((f, i) => {
        const isOpen = open === f.id;
        const btnId = `${base}-b-${f.id}`;
        const panelId = `${base}-p-${f.id}`;
        return (
          <div key={f.id} className={`faq__item reveal ${isOpen ? 'is-open' : ''}`} style={{ ['--reveal-delay' as string]: `${i * 60}ms` }}>
            <h3 className="faq__h">
              <button id={btnId} className="faq__q" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpen(isOpen ? null : f.id)}>
                <span>{f.question}</span>
                <Plus className="faq__icon" size={22} aria-hidden="true" />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={btnId} className="faq__a" hidden={!isOpen}>
              <p>{f.answer}</p>
              {!f.verified && <DraftBadge label="Answer pending approval" />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
