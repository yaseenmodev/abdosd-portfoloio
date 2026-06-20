import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-100">
        <div className="container py-4 flex items-center gap-3">
          <Link href="/">
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Refund Policy</h1>
        </div>
      </div>

      <div className="container max-w-3xl py-12">
        <p className="text-sm text-slate-400 mb-8">Last updated: June 2026</p>

        <p className="text-slate-600 leading-relaxed mb-8">
          We want you to be completely satisfied with your purchase. Please read this policy carefully
          before completing any transaction on drasd.xyz.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Digital Illustrations</h2>
          <div className="space-y-3">
            <div className="flex gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 text-sm">No refunds after download delivery</p>
                <p className="text-sm text-slate-600 mt-1">
                  Due to the digital nature of our products, once the download link has been sent to your email,
                  the sale is final and no refund can be issued.
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 text-sm">Full refund if download fails</p>
                <p className="text-sm text-slate-600 mt-1">
                  If you were charged but did not receive your download link within 24 hours, you are
                  entitled to a full refund. Contact us immediately.
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 text-sm">Full refund for duplicate charges</p>
                <p className="text-sm text-slate-600 mt-1">
                  If you were charged more than once for the same order, we will refund the extra charge immediately.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Mentoring Sessions</h2>
          <div className="space-y-3">
            <div className="flex gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 text-sm">Full refund — cancelled 24+ hours in advance</p>
                <p className="text-sm text-slate-600 mt-1">
                  If you cancel your session at least 24 hours before the scheduled time, you will receive a full refund.
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
              <XCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 text-sm">No refund — cancelled less than 24 hours before</p>
                <p className="text-sm text-slate-600 mt-1">
                  Cancellations made less than 24 hours before the session are non-refundable.
                  However, you may reschedule once at no extra charge.
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 text-sm">Full refund — no-show by mentor</p>
                <p className="text-sm text-slate-600 mt-1">
                  If we fail to show up for a confirmed session without prior notice, you will receive a full refund.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">How to Request a Refund</h2>
          <p className="text-slate-600 leading-relaxed mb-3">
            To request a refund, email us at{" "}
            <a href="mailto:contact@drasd.xyz" className="text-blue-600 hover:underline">contact@drasd.xyz</a>{" "}
            with the following:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600">
            <li>Your full name and email address used for the purchase</li>
            <li>Order ID or transaction reference</li>
            <li>Reason for the refund request</li>
          </ul>
          <p className="text-slate-600 leading-relaxed mt-3">
            Approved refunds are processed within <strong>5–10 business days</strong> back to your original payment method.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Contact Us</h2>
          <p className="text-slate-600 leading-relaxed">
            Still have questions? Reach us at{" "}
            <a href="mailto:contact@drasd.xyz" className="text-blue-600 hover:underline">contact@drasd.xyz</a>{" "}
            or via WhatsApp at +20 104 426 4096.
          </p>
        </section>
      </div>
    </div>
  );
}
