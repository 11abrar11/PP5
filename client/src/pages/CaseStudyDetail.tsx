import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { useParams } from "wouter";
import { caseStudies } from "@/utils/case-studies";
import { ArrowLeft, CheckCircle2, ChevronRight, X, ChevronLeft, ZoomIn } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

export default function CaseStudyDetail() {
    const params = useParams();
    const slug = params.slug;
    const study = caseStudies.find(s => s.slug === slug);
    const [selectedImgIdx, setSelectedImgIdx] = useState<number | null>(null);

    useEffect(() => {
        if (selectedImgIdx !== null) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => { document.body.style.overflow = "auto"; };
    }, [selectedImgIdx]);

    if (!study) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">Case Study Not Found</h1>
                        <Link href="/">
                            <button className="px-6 py-3 bg-primary text-white rounded-lg">Return Home</button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar variant="dark-text" />

            {/* Hero */}
            <section className="relative h-[65vh] min-h-[480px]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-10" />
                <img
                    src={study.image}
                    alt={study.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="container mx-auto px-4 md:px-6 relative z-20 h-full flex flex-col justify-end pb-16">
                    <Link href="/">
                        <button className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors text-sm">
                            <ArrowLeft size={16} /> Back to Home
                        </button>
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-block px-4 py-1.5 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                            {study.category}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-3 max-w-4xl leading-tight">
                            {study.title}
                        </h1>
                        <p className="text-lg text-white/80 font-light">
                            Client: <span className="font-semibold text-white">{study.client}</span>
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid lg:grid-cols-3 gap-16">

                        {/* Left: Main Content */}
                        <div className="lg:col-span-2 space-y-14">

                            {/* Overview */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                            >
                                <p className="text-xl text-gray-600 leading-relaxed border-l-4 border-primary pl-6 italic">
                                    {study.description}
                                </p>
                            </motion.div>

                            {/* The Ask */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                            >
                                <h2 className="text-2xl font-bold font-display mb-4 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">1</span>
                                    The Ask
                                </h2>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    {study.theAsk}
                                </p>
                            </motion.div>

                            {/* Our Solution */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                            >
                                <h2 className="text-2xl font-bold font-display mb-4 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">2</span>
                                    Our Solution
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-6">{study.solutionIntro}</p>
                                <ul className="space-y-4">
                                    {study.solutionPoints.map((point, i) => {
                                        const [label, ...rest] = point.split(':');
                                        const hasLabel = rest.length > 0;
                                        return (
                                            <li key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <ChevronRight className="text-primary shrink-0 mt-0.5" size={18} />
                                                <span className="text-gray-700">
                                                    {hasLabel ? (
                                                        <><strong className="text-gray-900">{label}:</strong>{rest.join(':')}</>
                                                    ) : point}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </motion.div>

                            {/* Gallery */}
                            {study.gallery && study.gallery.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h2 className="text-2xl font-bold font-display mb-6 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">3</span>
                                        Work Samples
                                    </h2>
                                    <div className="columns-1 sm:columns-2 gap-6 [column-fill:_balance]">
                                        {study.gallery.map((img, i) => (
                                            <div key={i} className="break-inside-avoid mb-6">
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="group relative cursor-pointer"
                                                    onClick={() => setSelectedImgIdx(i)}
                                                >
                                                    <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:border-primary/20 bg-gray-50">
                                                        <img
                                                            src={img}
                                                            alt={`${study.client} work sample ${i + 1}`}
                                                            loading="lazy"
                                                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center">
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.5 }}
                                                                whileHover={{ opacity: 1, scale: 1 }}
                                                                className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                                                            >
                                                                <ZoomIn size={20} />
                                                            </motion.div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Right: Results Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-950 text-white p-8 rounded-2xl sticky top-28">
                                <h3 className="text-lg font-bold font-display mb-6 text-primary uppercase tracking-wider">The Impact</h3>
                                <div className="space-y-4">
                                    {study.results.map((result, i) => (
                                        <div key={i} className="flex items-start gap-3 pb-4 border-b border-white/10 last:border-0 last:pb-0">
                                            <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={18} />
                                            <span className="text-gray-300 text-sm leading-relaxed">{result}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-10 pt-8 border-t border-white/10">
                                    <p className="text-gray-400 text-sm mb-4">Ready for similar results?</p>
                                    <Link href="/contact">
                                        <button className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-green-600 transition-colors shadow-lg shadow-primary/20">
                                            Start Your Project
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImgIdx !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
                        onClick={() => setSelectedImgIdx(null)}
                    >
                        <button
                            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all z-[110]"
                            onClick={() => setSelectedImgIdx(null)}
                        >
                            <X size={24} />
                        </button>

                        {selectedImgIdx > 0 && (
                            <button
                                className="absolute left-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all z-[110]"
                                onClick={(e) => { e.stopPropagation(); setSelectedImgIdx(selectedImgIdx - 1); }}
                            >
                                <ChevronLeft size={28} />
                            </button>
                        )}

                        {selectedImgIdx < (study.gallery?.length || 0) - 1 && (
                            <button
                                className="absolute right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all z-[110]"
                                onClick={(e) => { e.stopPropagation(); setSelectedImgIdx(selectedImgIdx + 1); }}
                            >
                                <ChevronRight size={28} />
                            </button>
                        )}

                        <motion.div
                            key={selectedImgIdx}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative max-w-7xl max-h-[85vh] w-full flex flex-col items-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={study.gallery?.[selectedImgIdx]}
                                alt="Work sample"
                                className="w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                            />
                            <div className="mt-6 text-center">
                                <p className="text-white/60 text-sm font-medium uppercase tracking-[0.2em] mb-1">{study.client}</p>
                                <h3 className="text-white text-xl font-bold font-display">{study.title}</h3>
                                <p className="text-white/40 text-xs mt-2">
                                    Sample {selectedImgIdx + 1} of {study.gallery?.length}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
