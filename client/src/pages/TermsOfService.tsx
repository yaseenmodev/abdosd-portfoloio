import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-100">
        <div className="container py-4 flex items-center gap-3">
          <Link href="/">
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Terms of Service</h1>
        </div>
      </div>

      <div className="container max-w-3xl py-12">
        <p className="text-sm text-slate-400 mb-8">Last updated: June 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">1. Agreement to Terms</h2>
          <p className="text-slate-600 leading-relaxed">
            By accessing or using drasd.xyz, you agree to be bound by these Terms of Service.
            If you do not agree, please do not use this website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">2. Services Offered</h2>
          <p className="text-slate-600 leading-relaxed mb-3">We offer two types of services:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600">
            <li><strong>USMLE Step 1 Mentoring Sessions:</strong> Live 1-on-1 video sessions conducted via an agreed platform (e.g., Zoom, Google Meet).</li>
            <li><strong>Digital Medical Illustrations:</strong> Downloadable digital files (PDF, PNG, or similar formats).</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">3. Mentoring Sessions</h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-600">
            <li>Sessions must be scheduled and confirmed via email or WhatsApp prior to payment.</li>
            <li>Sessions not cancelled at least 24 hours in advance are non-refundable.</li>
            <li>We reserve the right to reschedule a session with at least 12 hours notice.</li>
            <li>Mentoring does not guarantee a specific exam score or outcome.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">4. Digital Products</h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-600">
            <li>All digital products are delivered via download link sent to your email after payment confirmation.</li>
            <li>You may use purchased illustrations for personal and educational purposes only.</li>
            <li>Redistribution, resale, or commercial use of our illustrations is strictly prohibited.</li>
            <li>Digital products are non-refundable once the download link has been delivered.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">5. Payments</h2>
          <p className="text-slate-600 leading-relaxed">
            All payments are processed securely through Paddle. Prices are listed in USD.
            By completing a purchase, you authorize the charge to your provided payment method.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">6. Intellectual Property</h2>
          <p className="text-slate-600 leading-relaxed">
            All content on this website including illustrations, text, and designs are the intellectual
            property of Dr. Abdellrahman Saffa Aldin. Unauthorized use is prohibited.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">7. Limitation of Liability</h2>
          <p className="text-slate-600 leading-relaxed">
            We are not liable for any indirect, incidental, or consequential damages arising from
            the use of our services. Our total liability shall not exceed the amount paid for the
            specific service in question.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">8. Changes to Terms</h2>
          <p className="text-slate-600 leading-relaxed">
            We reserve the right to update these Terms at any time. Continued use of the site after
            changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">9. Contact</h2>
          <p className="text-slate-600 leading-relaxed">
            Questions about these Terms? Email us at{" "}
            <a href="mailto:contact@drasd.xyz" className="text-blue-600 hover:underline">contact@drasd.xyz</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
