import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  bgImage?: string;
}

export function PageHeader({ title, subtitle, bgImage }: PageHeaderProps) {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-black">
      {/* Abstract Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black z-10" />
      <img
        src={bgImage || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80'}
        alt=""
        loading="eager"
        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-1000"
        onLoad={(e) => {
          (e.target as HTMLImageElement).classList.remove('opacity-0');
          (e.target as HTMLImageElement).classList.add('opacity-40');
        }}
      />
      
      <div className="container relative z-20 mx-auto px-4 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold font-display text-white mb-6"
        >
          {title}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
}
