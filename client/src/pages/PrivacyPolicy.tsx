import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-100">
        <div className="container py-4 flex items-center gap-3">
          <Link href="/">
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Privacy Policy</h1>
        </div>
      </div>

      <div className="container max-w-3xl py-12 prose prose-slate">
        <p className="text-sm text-slate-400 mb-8">Last updated: June 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">1. Who We Are</h2>
          <p className="text-slate-600 leading-relaxed">
            This website is operated by Dr. Abdellrahman Saffa Aldin ("we", "us", or "our") at <strong>drasd.xyz</strong>.
            We provide USMLE Step 1 mentoring sessions and digital medical illustrations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">2. Information We Collect</h2>
          <p className="text-slate-600 leading-relaxed mb-3">We collect the following information when you use our services:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600">
            <li><strong>Contact information:</strong> Name, email address, and phone number when you fill out the contact form or book a session.</li>
            <li><strong>Payment information:</strong> Payment is processed securely by Paddle. We never store your card details.</li>
            <li><strong>Usage data:</strong> Basic analytics such as pages visited (no personal identifiers).</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-600">
            <li>To respond to your inquiries and book mentoring sessions.</li>
            <li>To deliver purchased digital products to your email.</li>
            <li>To send session confirmations and follow-up materials.</li>
            <li>We do not sell, rent, or share your data with third parties for marketing purposes.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">4. Payment Processing</h2>
          <p className="text-slate-600 leading-relaxed">
            All payments are processed by <strong>Paddle</strong>, a PCI-DSS compliant payment provider.
            Your payment details are handled entirely by Paddle and are never stored on our servers.
            Please review Paddle's privacy policy at paddle.com for more information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">5. Data Retention</h2>
          <p className="text-slate-600 leading-relaxed">
            We retain your contact and order information for up to 2 years for record-keeping purposes.
            You may request deletion of your data at any time by contacting us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">6. Cookies</h2>
          <p className="text-slate-600 leading-relaxed">
            We use only essential cookies required for the site to function (such as session authentication).
            We do not use tracking or advertising cookies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">7. Your Rights</h2>
          <p className="text-slate-600 leading-relaxed">
            You have the right to access, correct, or delete your personal data at any time.
            To exercise these rights, contact us at <a href="mailto:contact@drasd.xyz" className="text-blue-600 hover:underline">contact@drasd.xyz</a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">8. Contact</h2>
          <p className="text-slate-600 leading-relaxed">
            For any privacy-related questions, email us at{" "}
            <a href="mailto:contact@drasd.xyz" className="text-blue-600 hover:underline">contact@drasd.xyz</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
