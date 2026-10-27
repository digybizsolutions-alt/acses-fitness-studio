import { Link } from 'react-router-dom';
import { DraftBadge, PageHero } from '../components/common';
import { SHOW_DRAFTS, siteConfig } from '../content/siteConfig';
import { usePageMeta } from '../lib/hooks';

export default function Privacy() {
  usePageMeta('Privacy Policy', 'How ACSES Fitness Studio collects, uses and protects the information you share through our enquiry form.');
  const { privacy } = siteConfig;
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy policy" lede={`Last updated: ${privacy.lastUpdated}`} />
      <section className="section">
        <div className="container prose reveal">
          {SHOW_DRAFTS && (
            <p>
              <DraftBadge label="Draft — ACSES to approve wording, contact route & retention" />
            </p>
          )}
          <h2>Who we are</h2>
          <p>
            This website is operated by {siteConfig.name} ({siteConfig.city}). This policy explains what information we collect when you contact
            us through this website and how we use it.
          </p>

          <h2>What we collect</h2>
          <p>When you submit an enquiry, we collect only what you choose to provide:</p>
          <ul>
            <li>Your full name and phone / WhatsApp number</li>
            <li>Your email address (optional)</li>
            <li>The programme you are interested in, your preferred contact method and time</li>
            <li>Any message you add about your goals</li>
            <li>Your consent to be contacted</li>
          </ul>
          <p>
            We also record the date and time of your enquiry, the page it was sent from, and — if you arrived via a marketing link — basic campaign
            information (UTM source, medium and campaign). We do not ask for health or medical information through this form; please do not
            include it.
          </p>

          <h2>Why we collect it</h2>
          <p>
            We use your information solely to respond to your enquiry and to discuss programmes with you. Campaign information helps us understand
            which channels people use to find us. We do not sell your information, and we do not use it for unrelated marketing without your
            permission.
          </p>

          <h2>How it is stored</h2>
          <p>
            Enquiries are stored in a private, access-restricted Google Sheet operated by ACSES using Google Workspace services. Only authorised
            ACSES staff can view enquiries.
          </p>

          <h2>How long we keep it</h2>
          <p>
            {privacy.retentionMonths
              ? `We keep enquiry records for up to ${privacy.retentionMonths} months, after which they are deleted unless you have become a member.`
              : 'We keep enquiry records only for as long as needed to respond to and follow up on your enquiry, after which they are deleted.'}
          </p>

          <h2>Your choices</h2>
          <p>
            You can ask us at any time to access, correct or delete the information you have shared, or to stop contacting you.
            {privacy.contactEmail ? (
              <>
                {' '}
                Email <a href={`mailto:${privacy.contactEmail}`}>{privacy.contactEmail}</a> and we will action your request.
              </>
            ) : (
              <>
                {' '}
                Contact us using the details on our <Link to="/contact">contact page</Link> and we will action your request.
              </>
            )}
          </p>

          <h2>Cookies &amp; analytics</h2>
          <p>
            This website does not currently use advertising or analytics cookies. If that changes, we will update this policy and ask for your
            consent where required.
          </p>

          <h2>Changes</h2>
          <p>We may update this policy from time to time. The latest version will always be available on this page.</p>
        </div>
      </section>
    </>
  );
}
