export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Effective Date: October 2026 • IgamaZi Directory Network
        </p>
      </div>

      <div className="prose dark:prose-invert text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Introduction & Voluntary Participation</h2>
          <p>
            Welcome to IgamaZi. By registering for an account or using our directory services, you agree to these Terms of Service. IgamaZi is a consent-based platform. You represent that all biographical, educational, professional, and credential data you submit is truthful and pertains solely to yourself.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Prohibited Conduct & Anti-Scraping Rules</h2>
          <p>
            You agree NOT to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Impersonate any real person, living or deceased, or claim false professional licenses (e.g., claiming to be a medical doctor, legal practitioner, or chartered engineer without valid accreditation).</li>
            <li>Use automated scripts, bots, spiders, or scrapers to extract directory listings, profiles, or contact coordinates from IgamaZi.</li>
            <li>Use contact relay mechanisms to send unsolicited spam, marketing blasts, threats, or harassment.</li>
            <li>Publish confidential or third-party private information without authorization.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Verification & Badging Disclaimer</h2>
          <p>
            IgamaZi awards verified badges based on evidence submitted and public registry validation. While IgamaZi takes reasonable measures to ensure authenticity, users are encouraged to perform their own due diligence when entering into contractual or legal transactions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Account Suspension & Content Removal</h2>
          <p>
            IgamaZi reserves the right to immediately suspend or permanently delete any profile found to contain fraudulent claims, forged documents, impersonation, or defamatory content.
          </p>
        </section>
      </div>
    </div>
  );
}
