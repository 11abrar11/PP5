import { useState } from "react";
import Tilt from "react-parallax-tilt";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Palette,
  Fingerprint,
  Monitor,
  Film,
  ScanLine,
  Headphones,
  X,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

// ─── Static rich-content data ───────────────────────────────────────────────
const servicesData = [
  {
    id: "design-retainership",
    icon: Palette,
    title: "Design Retainership",
    tagline: "Your On-Demand Creative Department",
    summary:
      "Reliable, high-quality creative support on an ongoing basis — perfect for businesses that need consistent design excellence without managing an in-house team.",
    description:
      "Our retainer model ensures reliable, high-quality creative support on an ongoing basis — perfect for businesses that need consistent design excellence without managing an in-house team.",
    listLabel: "What You Get",
    list: [
      "Unlimited design requests (based on agreed scope)",
      "Consistent quality and brand alignment",
      "Dedicated creative team",
      "Predictable monthly costs",
      "Faster turnaround with priority service",
    ],
    bestFor: "Marketing teams, agencies, growing brands",
    caseSnippet: {
      client: "DFW Airport Parking",
      text: "Produced 400+ creative assets — static and animated HTML5 banners — achieving a significant CTR boost. The client praised our turnaround time and visual creativity, leading to an ongoing retainership.",
    },
  },
  {
    id: "brand-identity",
    icon: Fingerprint,
    title: "Brand Identity Design",
    tagline: "Crafting Brands That Speak and Resonate",
    summary:
      "Memorable, strategic brand identities that connect with your audience and stand out in your industry — from logo creation to full brand guidelines.",
    description:
      "We create memorable, strategic brand identities that connect with your audience and stand out in your industry. From logo creation to full brand guidelines, we make sure your identity is consistent, distinct, and impactful.",
    listLabel: "Deliverables",
    list: [
      "Logo design & variations",
      "Brand color palette & typography",
      "Brand usage guidelines",
      "Visual style development",
      "Stationery design templates",
    ],
    bestFor: "Startups, rebranding projects, growing businesses",
    impact:
      "Strong, consistent branding increases visibility, engagement, and ROI.",
  },
  {
    id: "print-digital-graphics",
    icon: Monitor,
    title: "Print & Digital Graphic Design",
    tagline: "From Paper to Pixels — We Design It All",
    summary:
      "Stunning print and digital creative assets that work across every touchpoint — from brochures to HTML5 ads.",
    description:
      "We deliver stunning print and digital creative assets that work across every touchpoint — from brochures to HTML5 ads.",
    listLabel: "Print Services",
    list: [
      "Logo design",
      "Flyers, brochures, posters",
      "Advertising campaigns",
      "Outdoor & hoarding design",
      "Menu cards, stage backdrops",
    ],
    listLabel2: "Digital Services",
    list2: [
      "Static & animated banners",
      "Responsive e-blasts",
      "E-commerce websites",
      "E-learning visuals",
      "DOOH creative",
      "Video editing & production",
    ],
    bestFor: "Campaign launches, brand promotions, product showcases",
  },
  {
    id: "animation",
    icon: Film,
    title: "Animation",
    tagline: "Move Your Audience with Motion",
    summary:
      "Dynamic, engaging animations for campaigns, presentations, and brand storytelling using the latest software.",
    description:
      "We create dynamic, engaging animations for campaigns, presentations, and brand storytelling. Our team works with the latest animation software to bring concepts to life.",
    listLabel: "Capabilities",
    list: [
      "2D animation",
      "3D architectural walkthroughs",
      "Logo animation",
      "HTML5 animations",
      "Explainer videos",
    ],
    bestFor:
      "Interactive websites, sales decks, promotional videos, social media content",
  },
  {
    id: "digitization",
    icon: ScanLine,
    title: "Digitization",
    tagline: "Preserve, Protect, and Digitize Your Data",
    summary:
      "Securely convert physical documents, images, and media into digital formats for easy storage, retrieval, and sharing.",
    description:
      "We help businesses securely convert physical documents, images, and media into digital formats for easy storage, retrieval, and sharing.",
    listLabel: "Services",
    list: [
      "Document scanning (confidential & standard)",
      "Image scanning & editing",
      "PDF creation & conversion",
      "Digital flipbook creation",
      "Format conversion",
    ],
    bestFor: "Educational institutions, corporates, legal & finance firms",
  },
  {
    id: "bpo-services",
    icon: Headphones,
    title: "BPO Service",
    tagline: "Your Back Office, Our Expertise",
    summary:
      "Cost-effective BPO solutions to streamline your operations, reduce overhead, and free up resources for core business tasks.",
    description:
      "We offer cost-effective BPO solutions to streamline your operations, reduce overhead, and free up resources for core business tasks.",
    listLabel: "Services",
    list: [
      "Data entry, management, and conversion",
      "Report creation",
      "PPT and document formatting",
      "Video conversion & uploads",
    ],
    bestFor: "Retail, finance, education, eCommerce, marketing agencies",
    bestForLabel: "Industries Served",
  },
];

type ServiceData = (typeof servicesData)[number];

// ─── Service Detail Modal ────────────────────────────────────────────────────
function ServiceModal({
  service,
  onClose,
}: {
  service: ServiceData;
  onClose: () => void;
}) {
  const Icon = service.icon;
  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-10 px-4"
        onClick={onClose}
      >
        <motion.div
          key="panel"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hero strip */}
          <div className="bg-black text-white px-10 pt-14 pb-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X size={18} className="text-white" />
            </button>
            <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6">
              <Icon size={28} />
            </div>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-2">
              {service.title}
            </p>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight mb-4">
              {service.tagline}
            </h2>
            <p className="text-gray-400 leading-relaxed max-w-xl">
              {service.description}
            </p>
          </div>

          {/* Body */}
          <div className="px-10 py-10 space-y-8">
            {/* Primary list */}
            <div>
              <h3 className="text-sm font-semibold tracking-widest text-primary uppercase mb-4">
                {service.listLabel}
              </h3>
              <ul className="space-y-3">
                {service.list.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="text-primary mt-0.5 shrink-0"
                    />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Secondary list (Print & Digital has two) */}
            {"list2" in service && service.list2 && (
              <div>
                <h3 className="text-sm font-semibold tracking-widest text-primary uppercase mb-4">
                  {(service as any).listLabel2}
                </h3>
                <ul className="space-y-3">
                  {service.list2.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2
                        size={18}
                        className="text-primary mt-0.5 shrink-0"
                      />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Best For */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-2">
                {(service as any).bestForLabel || "Best For"}
              </p>
              <p className="text-gray-700">{service.bestFor}</p>
            </div>

            {/* Impact (Brand Identity) */}
            {"impact" in service && service.impact && (
              <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl">
                <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-2">
                  Impact
                </p>
                <p className="text-gray-700">{(service as any).impact}</p>
              </div>
            )}

            {/* Case snippet (Design Retainership) */}
            {"caseSnippet" in service && service.caseSnippet && (
              <div className="p-6 bg-black rounded-2xl text-white">
                <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-2">
                  Case Example — {service.caseSnippet.client}
                </p>
                <p className="text-gray-300 leading-relaxed">
                  {service.caseSnippet.text}
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="pt-2">
              <Link href="/contact">
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                >
                  Get Started <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Service Tile Card ───────────────────────────────────────────────────────
function ServiceTile({
  service,
  index,
  onClick,
}: {
  service: ServiceData;
  index: number;
  onClick: () => void;
}) {
  const Icon = service.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Tilt
        perspective={1000}
        glareEnable={true}
        glareMaxOpacity={0.15}
        scale={1.02}
        className="h-full"
      >
        <button
          onClick={onClick}
          className="group relative p-8 rounded-2xl bg-white border border-gray-100 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden text-left w-full h-full"
        >
          {/* BG accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:bg-primary/10 group-hover:scale-110" />

          <div className="relative z-10">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <Icon size={26} />
            </div>

            <h3 className="text-xl font-bold font-display text-gray-900 mb-3 group-hover:text-primary transition-colors">
              {service.title}
            </h3>

            <p className="text-gray-500 leading-relaxed text-sm mb-6">
              {service.summary}
            </p>

            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              Learn More <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </button>
      </Tilt>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function Services() {
  const [activeService, setActiveService] = useState<ServiceData | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHeader
        title="Creative & Digital Solutions Tailored for Impact"
        subtitle="From branding to animation, our services are designed to make your business stand out and succeed."
        bgImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
      />

      {/* ── Services Grid ── */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-sm font-semibold tracking-widest text-primary uppercase mb-3"
            >
              What We Offer
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-display font-bold text-gray-900"
            >
              Our Services
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.map((service, index) => (
              <ServiceTile
                key={service.id}
                service={service}
                index={index}
                onClick={() => setActiveService(service)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-semibold tracking-widest text-primary uppercase mb-4"
          >
            Let's Collaborate
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight"
          >
            Need a creative solution?
            <br />
            <span className="text-primary">Let's talk.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg mb-10 max-w-xl mx-auto"
          >
            Whether you need a one-time project or an ongoing creative partner,
            we're ready to make it happen.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/contact">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/30 text-base">
                Contact Us <ArrowRight size={18} />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* ── Service Detail Modal ── */}
      {activeService && (
        <ServiceModal
          service={activeService}
          onClose={() => setActiveService(null)}
        />
      )}
    </div>
  );
}
