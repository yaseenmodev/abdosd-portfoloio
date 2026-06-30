import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Mail,
  MessageCircle,
  Phone,
  Instagram,
  CheckCircle2,
  ChevronDown,
  BookOpen,
  Stethoscope,
  Palette,
  Star,
  ShoppingBag,
  Award,
  Clock,
  Users,
  Loader2,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Home() {
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const submitContact = trpc.contacts.submit.useMutation();
  const { data: featuredProducts = [] } = trpc.products.featured.useQuery();

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      await submitContact.mutateAsync(contactForm);
      toast.success("Message sent! Dr. Abdellrahman will get back to you soon.");
      setContactForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const faqs = [
    {
      q: "What is USMLE Step 1 mentoring?",
      a: "USMLE Step 1 is the first licensing examination for doctors in the United States. My mentoring sessions cover high-yield concepts, question strategies, and personalized study planning to maximize your score.",
    },
    {
      q: "How long is each session and what does it cost?",
      a: "Each session is 60 minutes and costs $20 USD. Sessions are conducted via video call. You can book single sessions or packages for better value.",
    },
    {
      q: "Who are the mentoring sessions suitable for?",
      a: "These sessions are ideal for medical students preparing for USMLE Step 1, those who are retaking the exam, or anyone needing structured guidance on high-yield topics.",
    },
    {
      q: "What are the medical illustrations for?",
      a: "The illustrations are digital art pieces designed to make complex medical concepts visually clear. They are perfect for studying, presentations, or as educational wall prints.",
    },
    {
      q: "How do I receive my purchased illustration?",
      a: "After payment confirmation, you will receive a download link via email within 24 hours.",
    },
    {
      q: "Can I book a free introductory call?",
      a: "Yes! Send me a message through the contact form below and we can schedule a 15-minute introductory call to discuss your goals before booking a full session.",
    },
  ];

  const packages = [
    {
      name: "Single Session",
      price: "$20",
      per: "/ session",
      description: "Perfect for targeted help on a specific topic.",
      features: [
        "60-minute 1-on-1 session",
        "Topic-focused Q&A",
        "Key resources shared after session",
        "Email follow-up summary",
      ],
      highlight: false,
      sessions: 1,
    },
    {
      name: "Starter Pack",
      price: "$90",
      per: "/ 5 sessions",
      description: "Build momentum with a structured plan.",
      features: [
        "5 × 60-minute sessions",
        "Personalized study roadmap",
        "High-yield topic coverage",
        "WhatsApp support between sessions",
        "10% savings vs. single sessions",
      ],
      highlight: true,
      sessions: 5,
    },
    {
      name: "Intensive Pack",
      price: "$160",
      per: "/ 10 sessions",
      description: "Complete preparation for exam day.",
      features: [
        "10 × 60-minute sessions",
        "Full Step 1 curriculum coverage",
        "Question bank strategy & review",
        "Mock exam analysis",
        "Priority scheduling",
        "20% savings vs. single sessions",
      ],
      highlight: false,
      sessions: 10,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-slate-800">Dr. Abdellrahman</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-slate-600 hover:text-medical-blue transition-colors font-medium">
              Home
            </Link>
            <button
              onClick={() => scrollTo("about")}
              className="text-sm text-slate-600 hover:text-medical-blue transition-colors font-medium"
            >
              About Me
            </button>
            <Link href="/shop" className="text-sm text-slate-600 hover:text-medical-blue transition-colors font-medium">
              Shop
            </Link>
            <button
              onClick={() => scrollTo("contact")}
              className="text-sm text-slate-600 hover:text-medical-blue transition-colors font-medium"
            >
              Contact
            </button>
          </div>
          {/* Mobile */}
          <Link href="/shop" className="md:hidden">
            <Button size="sm" variant="outline" className="gap-1.5 border-medical-blue text-medical-blue">
              <ShoppingBag className="w-3.5 h-3.5" />
              Shop
            </Button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-medical-gradient-soft pt-20 pb-24">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-100/60" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-green-100/50" />
          <div className="absolute top-1/2 right-1/4 text-[10rem] font-black text-blue-50 select-none leading-none">+</div>
        </div>

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <span className="medical-badge mb-4 inline-flex">
                  <Stethoscope className="w-3 h-3 mr-1.5" /> USMLE Step 1 Mentor
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-slate-900 mt-4">
                  Dr. Abdellrahman
                  <br />
                  <span className="text-medical-blue">Safaaeldin</span>
                </h1>
                <p className="mt-4 text-xl text-slate-600 font-medium">
                  Medical Doctor · USMLE Step 1 Mentor · Medical Illustrator
                </p>
              </div>

              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                I help medical students master USMLE Step 1 through focused 1-on-1 sessions.
                I also create detailed medical illustrations that make complex anatomy and
                physiology concepts easy to visualize.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={() => scrollTo("mentoring")}
                  className="bg-medical-blue hover:bg-blue-800 text-white shadow-lg gap-2"
                >
                  Book a Session <ArrowRight className="w-4 h-4" />
                </Button>
                <Link href="/shop">
                  <Button size="lg" variant="outline" className="border-2 border-medical-blue text-medical-blue hover:bg-blue-50 gap-2">
                    <ShoppingBag className="w-4 h-4" /> Browse Shop
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <a
                  href="https://wa.me/201044264096"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-colors"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com/drasd.personal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-600 transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="mailto:contact@drasd.com"
                  className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-medical-blue transition-colors"
                  title="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Hero image / stats */}
            <div className="flex flex-col items-center gap-6 animate-fade-in-up animate-delay-200">
              <div className="relative w-72 h-72 md:w-80 md:h-80">
                <div className="absolute inset-0 rounded-full bg-medical-gradient opacity-10" />
                <div className="absolute inset-4 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-2xl">
                  <img
                    src="/dr_profile.jpg"
                    alt="Dr. Abdellrahman Safaaeldin"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "";
                      (e.target as HTMLImageElement).style.display = "none";
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="flex flex-col items-center gap-2 text-medical-blue"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><p class="text-sm font-semibold text-slate-500">Dr. Abdellrahman</p></div>`;
                      }
                    }}
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-3 -right-3 bg-white rounded-xl shadow-lg border border-slate-100 px-4 py-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-medical-blue" />
                  <span className="text-sm font-semibold text-slate-700">USMLE Step 1</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                {[
                  { value: "$20", label: "Per Session", icon: <Clock className="w-4 h-4" /> },
                  { value: "1-on-1", label: "Personal", icon: <Users className="w-4 h-4" /> },
                  { value: "Step 1", label: "Focused", icon: <BookOpen className="w-4 h-4" /> },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 text-center">
                    <div className="flex justify-center text-medical-blue mb-1">{stat.icon}</div>
                    <p className="text-lg font-bold text-slate-800">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About ──────────────────────────────────────────────────────── */}
      <section id="about" className="py-24 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">About Me</h2>
              <div className="w-16 h-1 bg-medical-blue mx-auto rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  I am Dr. Abdellrahman Safaaeldin, a medical doctor in the early stage of my career.
                  I have successfully passed USMLE Step 1, and I am passionate about helping other
                  medical students achieve the same milestone.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Beyond clinical medicine, I channel my passion for anatomy and physiology into
                  detailed medical illustrations. My artwork is designed to make complex medical
                  concepts accessible and memorable for students worldwide.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  My mentoring approach is practical, personalized, and focused on what actually
                  moves the needle on your score.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: <Stethoscope className="w-5 h-5" />, title: "Medical Doctor", desc: "Graduate with USMLE Step 1 certification" },
                  { icon: <BookOpen className="w-5 h-5" />, title: "USMLE Step 1 Mentor", desc: "1-on-1 personalized exam preparation sessions" },
                  { icon: <Palette className="w-5 h-5" />, title: "Medical Illustrator", desc: "Digital artwork focused on anatomy & physiology" },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-medical-blue flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mentoring / Packages ───────────────────────────────────────── */}
      <section id="mentoring" className="py-24 bg-slate-50">
        <div className="container">
          <div className="text-center mb-16">
            <span className="medical-badge mb-3 inline-flex">
              <BookOpen className="w-3 h-3 mr-1.5" /> USMLE Step 1 Mentoring
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Choose Your Package
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              All sessions are live 1-on-1 video calls. Book what fits your schedule and goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <Card
                key={pkg.name}
                className={`p-8 flex flex-col relative ${
                  pkg.highlight
                    ? "border-2 border-medical-blue shadow-xl"
                    : "border border-slate-200 hover:border-blue-200 hover:shadow-lg"
                } transition-all`}
              >
                {pkg.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-medical-blue text-white text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-medical-blue">{pkg.price}</span>
                    <span className="text-slate-500 text-sm">{pkg.per}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">{pkg.description}</p>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-medical-green flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => scrollTo("contact")}
                  className={`w-full gap-2 ${
                    pkg.highlight
                      ? "bg-medical-blue hover:bg-blue-800 text-white"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  Book Now <ArrowRight className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 mt-8">
            Prefer to talk first?{" "}
            <button onClick={() => scrollTo("contact")} className="text-medical-blue font-semibold hover:underline">
              Send a message
            </button>{" "}
            and we'll schedule a free 15-minute intro call.
          </p>
        </div>
      </section>

      {/* ── Shop Preview ───────────────────────────────────────────────── */}
      <section id="shop-preview" className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <span className="medical-badge mb-3 inline-flex">
              <Palette className="w-3 h-3 mr-1.5" /> Medical Art Shop
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Medical Illustrations
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Premium digital medical illustrations designed to help you study and understand
              complex concepts at a glance.
            </p>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
              <Palette className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Illustrations coming soon!</p>
              <p className="text-sm text-slate-400 mt-1">Check back shortly for new medical art.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {featuredProducts.slice(0, 3).map((product) => (
                <Link key={product.id} href={`/shop/${product.id}`}>
                  <div className="medical-card overflow-hidden group cursor-pointer">
                    <div className="aspect-square bg-slate-100 overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Palette className="w-12 h-12 text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900 truncate">{product.title}</h3>
                      <p className="text-medical-blue font-bold text-lg mt-1">${product.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link href="/shop">
              <Button size="lg" variant="outline" className="border-2 border-medical-blue text-medical-blue hover:bg-blue-50 gap-2">
                <ShoppingBag className="w-4 h-4" /> View Full Shop
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 bg-slate-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600">Everything you need to know before getting started.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((item, idx) => (
              <Card
                key={idx}
                className="border border-slate-200 bg-white overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                >
                  <span className="font-semibold text-slate-900 pr-4">{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${expandedFaq === idx ? "rotate-180" : ""}`}
                  />
                </button>
                {expandedFaq === idx && (
                  <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                    {item.a}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ───────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Get in Touch</h2>
              <p className="text-lg text-slate-600">
                Have questions or ready to book a session? Reach out directly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Send a Message</h3>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1.5 block">Name *</label>
                      <Input
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Your full name"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1.5 block">Phone</label>
                      <Input
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="+20 1xx xxx xxxx"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email *</label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="your@email.com"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Subject</label>
                    <Input
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="e.g. USMLE Step 1 session inquiry"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Message *</label>
                    <Textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Tell me about your goals or questions..."
                      rows={4}
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-medical-blue hover:bg-blue-800 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </Card>

              <div className="space-y-4">
                {/* WhatsApp */}
                <Card className="p-6 bg-green-50 border border-green-200">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 mb-1">WhatsApp</p>
                      <p className="text-sm text-slate-600 mb-3">Quick answers and session bookings via WhatsApp.</p>
                      <a
                        href="https://wa.me/201044264096"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                          Open WhatsApp Chat
                        </Button>
                      </a>
                    </div>
                  </div>
                </Card>

                {/* Contact details */}
                <Card className="p-6 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-4">Direct Contact</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Mail className="w-5 h-5 text-medical-blue flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">Email</p>
                        <a href="mailto:contact@drasd.com" className="text-medical-blue font-semibold hover:underline text-sm">
                          contact@drasd.com
                        </a>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Phone className="w-5 h-5 text-medical-blue flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">Phone / WhatsApp</p>
                        <a href="tel:+201044264096" className="text-medical-blue font-semibold hover:underline text-sm">
                          +20 104 426 4096
                        </a>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Instagram className="w-5 h-5 text-medical-blue flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">Instagram</p>
                        <a
                          href="https://instagram.com/drasd.personal"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-medical-blue font-semibold hover:underline text-sm"
                        >
                          @drasd.personal
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border border-slate-200 bg-blue-50">
                  <div className="flex gap-3">
                    <Star className="w-5 h-5 text-medical-blue flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 mb-1 text-sm">Free Intro Call</p>
                      <p className="text-sm text-slate-600">
                        Not sure where to start? Send a message and we'll schedule a free
                        15-minute call to map out your preparation.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────── */}
      <section className="py-16 bg-medical-gradient text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Conquer USMLE Step 1?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Book your first session today for just $20 and start your personalized preparation journey.
          </p>
          <Button
            onClick={() => scrollTo("contact")}
            className="bg-white text-medical-blue hover:bg-blue-50 font-bold px-8 py-3 text-base shadow-lg"
          >
            Book Your Session Now
          </Button>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">Dr. Abdellrahman Safaaeldin</span>
            </div>
            <div className="flex gap-4 text-sm">
              <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
              <button onClick={() => scrollTo("mentoring")} className="hover:text-white transition-colors">Mentoring</button>
              <button onClick={() => scrollTo("contact")} className="hover:text-white transition-colors">Contact</button>
            </div>
            <div className="flex gap-3">
              <a href="https://wa.me/201044264096" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="https://instagram.com/drasd.personal" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="mailto:contact@drasd.com"
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
            <span>© {new Date().getFullYear()} Dr. Abdellrahman Safaaeldin. All rights reserved.</span>
            <div className="flex gap-4">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
