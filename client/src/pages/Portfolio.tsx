import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { portfolioItems } from "@/utils/portfolio";
import type { PortfolioItem } from "@/utils/portfolio";
import { Play, X, ZoomIn, ChevronLeft, ChevronRight, FileText, ExternalLink } from "lucide-react";

// ─── Filter categories ────────────────────────────────────────────────────────
const FILTERS = [
  { label: "All Work", value: "all" },
  { label: "Social & GIFs", value: "social" },
  { label: "Video", value: "video" },
  { label: "Banner Ads", value: "banners" },
  { label: "Packaging", value: "packaging" },
  { label: "Flyers & Print", value: "flyers" },
  { label: "E-blasts", value: "eblast" },
  { label: "Magazine", value: "magazine" },
];

// ─── Masonry grid using CSS columns ──────────────────────────────────────────
function MasonryGrid({ items, onOpen }: { items: PortfolioItem[]; onOpen: (i: PortfolioItem) => void }) {
  return (
    <div
      className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 w-full"
      style={{ columnFill: "balance" }}
    >
      {items.map((item, idx) => (
        <PortfolioCard key={item.id} item={item} index={idx} onOpen={onOpen} />
      ))}
    </div>
  );
}

// ─── Individual card ──────────────────────────────────────────────────────────
function PortfolioCard({ item, index, onOpen }: { item: PortfolioItem; index: number; onOpen: (i: PortfolioItem) => void }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.07, ease: "easeOut" }}
      className="break-inside-avoid mb-4 relative group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(item)}
    >
      <div className="rounded-2xl overflow-hidden relative bg-gray-950 shadow-md hover:shadow-2xl transition-shadow duration-300">
        {/* Media */}
        {item.pdf ? (
          // ── PDF card — styled document tile ──────────────────────────────
          <div
            className={`w-full flex flex-col items-center justify-center gap-4 px-6 py-10 bg-gradient-to-br from-gray-900 to-gray-800 transition-transform duration-500 ${hovered ? 'scale-105' : 'scale-100'}`}
            style={{ minHeight: 220 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              {item.client && <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-1">{item.client}</p>}
              <p className="text-white font-bold text-sm leading-snug">{item.title}</p>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-white/30 border border-white/10 rounded-full px-3 py-1">PDF Document</span>
          </div>
        ) : item.video ? (
          <div className="relative">
            <video
              src={item.image}
              muted
              loop
              playsInline
              className={`w-full h-auto object-cover transition-transform duration-500 ${hovered ? "scale-105" : "scale-100"}`}
              ref={(el) => {
                if (el) hovered ? el.play().catch(() => { }) : el.pause();
              }}
            />
            {/* Play badge always visible on video */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ scale: hovered ? 1.15 : 1, opacity: hovered ? 1 : 0.85 }}
                transition={{ duration: 0.2 }}
                className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-2xl"
              >
                <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
              </motion.div>
            </div>
          </div>
        ) : (
          <img
            src={item.thumbnail}
            alt={item.title}
            loading="lazy"
            className={`w-full h-auto object-cover transition-transform duration-500 ${hovered ? "scale-105" : "scale-100"}`}
          />
        )}

        {/* Hover overlay */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 flex flex-col justify-end p-5"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
          }}
        >
          {item.client && (
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
              {item.client}
            </p>
          )}
          <h3 className="text-white font-bold text-base leading-snug mb-2">{item.title}</h3>
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] uppercase tracking-wide font-medium text-white/80 bg-white/10 border border-white/20 rounded-full px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
          {/* Zoom / play icon */}
          <div className="absolute top-4 right-4">
            {item.video ? (
              <div className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center">
                <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <ZoomIn className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ item, items, onClose, onNav }: {
  item: PortfolioItem;
  items: PortfolioItem[];
  onClose: () => void;
  onNav: (dir: 1 | -1) => void;
}) {
  const currentIndex = items.findIndex((i) => i.id === item.id);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNav]);

  return (
    <motion.div
      key="lb-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
        onClick={onClose}
      >
        <X size={20} />
      </button>

      {/* Prev */}
      {currentIndex > 0 && (
        <button
          className="absolute left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10 transition-colors"
          onClick={(e) => { e.stopPropagation(); onNav(-1); }}
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* Next */}
      {currentIndex < items.length - 1 && (
        <button
          className="absolute right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10 transition-colors"
          onClick={(e) => { e.stopPropagation(); onNav(1); }}
        >
          <ChevronRight size={22} />
        </button>
      )}

      {/* Content */}
      {item.pdf ? (
        // ── PDF lightbox ─────────────────────────────────────────────────
        <motion.div
          key={item.id}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-5xl flex flex-col items-center gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <iframe
            src={item.image}
            title={item.title}
            className="w-full rounded-2xl shadow-2xl border border-white/10"
            style={{ height: '80vh' }}
          />
          <div className="flex items-center gap-4">
            <a
              href={item.image}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/80 transition-colors"
            >
              <ExternalLink size={14} /> Open in new tab
            </a>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key={item.id}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {item.video ? (
            <video
              src={item.image}
              controls
              autoPlay
              className="w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl"
            />
          ) : (
            <img
              src={item.image}
              alt={item.title}
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
          )}

          {/* Caption */}
          <div className="mt-4 text-center">
            {item.client && (
              <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-1">{item.client}</p>
            )}
            <h3 className="text-white font-bold text-lg">{item.title}</h3>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {item.tags.map((tag) => (
                <span key={tag} className="text-[11px] bg-white/10 text-white/70 border border-white/20 rounded-full px-2.5 py-0.5 uppercase tracking-wide">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

    </motion.div>
  );
}

// ─── Hero parallax strip ──────────────────────────────────────────────────────
function HeroStrip() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <div ref={ref} className="relative h-64 md:h-80 overflow-hidden bg-black flex items-center justify-center">
      <motion.div style={{ y }} className="absolute inset-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 25% 50%, #16a34a30, transparent 50%), radial-gradient(circle at 75% 30%, #16a34a20, transparent 50%)",
          }}
        />
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
      </motion.div>
      <div className="relative z-10 text-center px-4">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-primary text-sm font-semibold uppercase tracking-[0.3em] mb-3"
        >
          PP5 Media Solutions
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-white font-display tracking-tight"
        >
          Our Work Speaks<span className="text-primary">.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-white/50 mt-3 text-base max-w-xl mx-auto"
        >
          Creative work spanning social media, video, print, digital ads, and brand identity.
        </motion.p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return portfolioItems;
    return portfolioItems.filter((i) => i.category === activeFilter);
  }, [activeFilter]);

  const handleNav = (dir: 1 | -1) => {
    if (!lightboxItem) return;
    const idx = filteredItems.findIndex((i) => i.id === lightboxItem.id);
    const next = filteredItems[idx + dir];
    if (next) setLightboxItem(next);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar variant="dark-text" />

      <HeroStrip />

      {/* ── Filter bar ── */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {FILTERS.map((f) => (
            <motion.button
              key={f.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(f.value)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 flex-shrink-0 ${activeFilter === f.value
                ? "bg-primary text-white border-primary shadow-[0_0_12px_rgba(22,163,74,0.5)]"
                : "bg-transparent text-white/50 border-white/10 hover:border-primary/40 hover:text-white"
                }`}
            >
              {f.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <MasonryGrid items={filteredItems} onOpen={setLightboxItem} />
          </motion.div>
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-white/30">No items in this category yet.</div>
        )}
      </main>

      <Footer />

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxItem && (
          <Lightbox
            item={lightboxItem}
            items={filteredItems}
            onClose={() => setLightboxItem(null)}
            onNav={handleNav}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
