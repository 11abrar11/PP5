import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { caseStudies } from "@/utils/case-studies";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { Link } from "wouter";
import Typewriter from 'typewriter-effect';

export default function Home() {

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-black">

        {/* Background Video — full screen, fades in from behind */}
        <video
          src="/walk.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute right-0 top-0 w-1/2 h-full object-cover opacity-70"
        />

        {/* Gradient: solid black on the left (text side) fading fully to transparent on the right (video side) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-primary text-sm font-semibold mb-6 border border-white/5 backdrop-blur-sm"
            >
              <Zap size={16} /> Digital Excellence Redefined
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold font-display text-white leading-tight mb-8"
            >
              We Craft Digital <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">
                <Typewriter
                  options={{
                    strings: ['Masterpieces.', 'Experiences.', 'Solutions.', 'Impact.'],
                    autoStart: true,
                    loop: true,
                  }}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed"
            >
              PP5 is a premier advertising agency specializing in design, technology, and strategy. We transform brands into industry leaders through innovative digital solutions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/services">
                <button className="px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-green-600 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 flex items-center justify-center gap-2">
                  Explore Services <ArrowRight size={20} />
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-8 py-4 bg-transparent border-2 border-white/20 text-white font-bold rounded-lg hover:bg-white/10 transition-all hover:-translate-y-1">
                  Contact Us
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats/Social Proof */}
      <section className="py-12 border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholders for client logos */}
            {['Goodwill', 'ABI', 'Moto Media Marketing', 'Grace Media', 'DFW Airport'].map((client, i) => (
              <span key={i} className="text-2xl font-bold font-display text-gray-400">{client}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      {/* Featured Case Studies Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Our Work</h2>
            <h3 className="text-4xl md:text-5xl font-bold font-display text-gray-900 mb-6">Featured Case Studies</h3>
            <p className="text-lg text-gray-600">
              Explore how we've helped leading brands achieve digital transformation and measurable growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {caseStudies.slice(0, 2).map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="aspect-[3/2] overflow-hidden">
                  <img
                    src={study.image}
                    alt={study.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-primary/90 text-xs font-bold uppercase tracking-wider rounded-full">
                      {study.category}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold font-display mb-6 relative inline-block">
                    <span className="relative">
                      {study.title}
                      <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-primary transition-all duration-500 group-hover:w-full rounded-full" />
                    </span>
                  </h3>
                  <Link href={`/case-study/${study.slug}`}>
                    <button className="flex items-center text-white font-bold group-hover:text-primary transition-colors duration-300">
                      View Case Study <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features/Strengths */}
      <section className="py-24 bg-black text-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Why Choose Us</h2>
                <h3 className="text-4xl md:text-5xl font-bold font-display mb-8">
                  We Don't Just Build.<br />We Evolve Brands.
                </h3>
                <div className="space-y-6">
                  {[
                    "Strategic Thinking First: We analyze before we design.",
                    "Pixel-Perfect Execution: Obsessive attention to detail.",
                    "Data-Driven Results: Decisions backed by analytics.",
                    "24/5 Dedicated Support: We are always here for you."
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="p-1 rounded-full bg-primary/20 text-primary mt-1">
                        <CheckCircle2 size={18} />
                      </div>
                      <p className="text-lg text-gray-300">{item}</p>
                    </div>
                  ))}
                </div>
                <Link href="/about">
                  <button className="mt-10 px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
                    Learn More About Us
                  </button>
                </Link>
              </motion.div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80"
                  alt="Team collaboration"
                  loading="lazy"
                  className="w-full h-auto transform hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-green-50 mb-10 max-w-2xl mx-auto">
            Let's create something extraordinary together. Schedule a free consultation today.
          </p>
          <Link href="/contact">
            <button className="px-10 py-4 bg-black text-white text-lg font-bold rounded-full hover:bg-gray-900 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 animate-pulse-green">
              Start Your Project
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
