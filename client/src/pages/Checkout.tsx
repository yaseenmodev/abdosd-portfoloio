import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ShoppingCart, CreditCard, Shield, Loader2, CheckCircle2, ExternalLink } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createOrder = trpc.orders.create.useMutation();

  if (items.length === 0 && !iframeUrl) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <ShoppingCart className="w-16 h-16 text-slate-200" />
        <p className="text-xl font-semibold text-slate-600">No items to checkout</p>
        <Link href="/shop">
          <Button className="bg-medical-blue hover:bg-blue-800 text-white gap-2">
            <ArrowLeft className="w-4 h-4" /> Go to Shop
          </Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Please fill in your name and email.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await createOrder.mutateAsync({
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        items: items.map((i) => ({
          productId: i.productId,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
        })),
        totalAmount: total.toFixed(2),
      });

      if (result.iframeUrl) {
        setIframeUrl(result.iframeUrl);
        clearCart();
      } else {
        toast.success("Order placed! You will be contacted for payment details.");
        clearCart();
        navigate("/");
      }
    } catch (err) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (iframeUrl) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="bg-white border-b border-slate-100">
          <div className="container py-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-medical-blue flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Secure Payment — Paymob</p>
              <p className="text-xs text-slate-500">Your payment is protected by Paymob SSL encryption</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <Card className="w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="p-4 bg-green-50 border-b border-green-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-700 font-medium">
                Order submitted! Complete payment below.
              </p>
            </div>
            <div className="p-4 flex flex-col gap-4">
              <p className="text-sm text-slate-600">
                Complete your payment securely through Paymob. Your download link will be sent to your email after confirmation.
              </p>
              <a
                href={iframeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full bg-medical-blue hover:bg-blue-800 text-white gap-2">
                  <ExternalLink className="w-4 h-4" /> Open Paymob Payment Page
                </Button>
              </a>
              <p className="text-xs text-slate-400 text-center">
                A new tab will open with the payment form. Return here once complete.
              </p>
              <Link href="/">
                <Button variant="ghost" className="w-full text-slate-500">
                  Return to Home
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="container py-4 flex items-center gap-3">
          <Link href="/cart">
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Checkout</h1>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Form */}
          <div>
            <Card className="p-6 border border-slate-200 bg-white">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-medical-blue" /> Customer Information
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Full Name *</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email Address *</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                    disabled={isLoading}
                  />
                  <p className="text-xs text-slate-400 mt-1">Download link will be sent here after payment.</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Phone (optional)</label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+20 1xx xxx xxxx"
                    disabled={isLoading}
                  />
                </div>

                {/* Paymob policies */}
                <Card className="p-4 bg-blue-50 border border-blue-100 mt-4">
                  <div className="flex gap-2 mb-3">
                    <Shield className="w-4 h-4 text-medical-blue flex-shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold text-slate-700">Payment Policies (Paymob)</p>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li className="flex gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-medical-green flex-shrink-0 mt-0.5" /> All transactions are processed securely via Paymob (PCI-DSS compliant)</li>
                    <li className="flex gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-medical-green flex-shrink-0 mt-0.5" /> Payments are in EGP (Egyptian Pound). Amount converted at checkout.</li>
                    <li className="flex gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-medical-green flex-shrink-0 mt-0.5" /> Digital products are non-refundable after download is delivered.</li>
                    <li className="flex gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-medical-green flex-shrink-0 mt-0.5" /> Supported: Visa, MasterCard, Meeza, and mobile wallets.</li>
                    <li className="flex gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-medical-green flex-shrink-0 mt-0.5" /> Your card details are never stored on our server.</li>
                  </ul>
                </Card>

                <Button
                  type="submit"
                  className="w-full bg-medical-blue hover:bg-blue-800 text-white gap-2 py-3 mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                  ) : (
                    <><CreditCard className="w-4 h-4" /> Pay ${total.toFixed(2)}</>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Order summary */}
          <div>
            <Card className="p-6 border border-slate-200 bg-white">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3 py-2 border-b border-slate-50">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">🎨</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-slate-200 pt-4">
                <span>Total</span>
                <span className="text-medical-blue">${total.toFixed(2)}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
