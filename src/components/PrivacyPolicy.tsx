interface PrivacyPolicyProps {
  onBack: () => void;
}

/**
 * Static privacy policy page. Surfaced from the start screen via a small
 * footer link. Styled to match the existing dark slate cards used elsewhere
 * in the app (see StartScreen for the source of the card classes).
 */
export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="flex flex-col gap-6 px-5 py-8 max-w-md mx-auto w-full">
      <header className="mt-2">
        <button
          type="button"
          onClick={onBack}
          className="text-slate-400 hover:text-slate-200 text-sm"
        >
          ← Back
        </button>
        <h1 className="font-display font-extrabold text-3xl tracking-tight mt-3">
          Privacy Policy
        </h1>
        <p className="mt-1 text-xs uppercase tracking-widest text-slate-500">
          Last updated: April 2025
        </p>
      </header>

      <section className="rounded-2xl bg-slate-900/60 ring-1 ring-white/10 p-5 backdrop-blur">
        <h2 className="font-display font-bold text-lg text-slate-100">
          What this site is
        </h2>
        <p className="mt-2 text-sm text-slate-300 leading-relaxed">
          Flag Stop is a daily browser game about routes through Europe. It
          runs in your browser and stores your stats locally on your device so
          you can keep streaks across visits. We do not run user accounts and
          do not ask you to sign in.
        </p>
      </section>

      <section className="rounded-2xl bg-slate-900/60 ring-1 ring-white/10 p-5 backdrop-blur">
        <h2 className="font-display font-bold text-lg text-slate-100">
          Advertising
        </h2>
        <p className="mt-2 text-sm text-slate-300 leading-relaxed">
          Flag Stop may show ads served by Google AdSense. Google and its
          partners may use cookies and similar technologies to serve ads based
          on your prior visits to this and other sites. You can learn more
          about how Google uses data in its products and services at{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer noopener"
            className="text-sky-400 underline hover:text-sky-300"
          >
            policies.google.com/privacy
          </a>
          .
        </p>
        <p className="mt-3 text-sm text-slate-300 leading-relaxed">
          You can opt out of personalised advertising by visiting{' '}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noreferrer noopener"
            className="text-sky-400 underline hover:text-sky-300"
          >
            adssettings.google.com
          </a>
          .
        </p>
      </section>

      <section className="rounded-2xl bg-slate-900/60 ring-1 ring-white/10 p-5 backdrop-blur">
        <h2 className="font-display font-bold text-lg text-slate-100">
          Cookies
        </h2>
        <p className="mt-2 text-sm text-slate-300 leading-relaxed">
          Flag Stop itself uses your browser's local storage to remember your
          stats, streaks, and the last puzzle you played. This data stays on
          your device and is not sent to us. Third parties such as ad
          providers may set their own cookies as described above.
        </p>
      </section>

      <section className="rounded-2xl bg-slate-900/60 ring-1 ring-white/10 p-5 backdrop-blur">
        <h2 className="font-display font-bold text-lg text-slate-100">
          Third-party links
        </h2>
        <p className="mt-2 text-sm text-slate-300 leading-relaxed">
          This site links to other websites for reference (for example,
          Google's privacy and ad-settings pages). We are not responsible for
          the content or privacy practices of those sites.
        </p>
      </section>

      <section className="rounded-2xl bg-slate-900/60 ring-1 ring-white/10 p-5 backdrop-blur">
        <h2 className="font-display font-bold text-lg text-slate-100">
          Contact
        </h2>
        <p className="mt-2 text-sm text-slate-300 leading-relaxed">
          If you have questions about this policy, you can reach the site
          owner at the address listed on the project's homepage or repository.
        </p>
      </section>

      <button
        type="button"
        onClick={onBack}
        className="w-full rounded-xl bg-slate-800/70 hover:bg-slate-800 ring-1 ring-white/10 text-slate-100 font-medium py-3"
      >
        Back to start
      </button>
    </div>
  );
}
