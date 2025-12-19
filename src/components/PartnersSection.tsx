import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const partners = [
  'Caterpillar',
  'Siemens',
  'Schneider Electric',
  'ABB',
  'Bosch',
  'Atlas Copco',
  'SKF',
  'Mitsubishi',
  'Hitachi',
  'Komatsu',
  'Volvo',
  'JCB',
];

export const PartnersSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="partners" className="py-24 lg:py-32 bg-background relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <span className="inline-block text-sm font-medium text-primary uppercase tracking-widest mb-6 font-heading">
            Our Partners
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-heading">
            Trusted by
            <br />
            <span className="text-gradient-gold">Global Leaders</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We partner with the world's most respected manufacturers to bring 
            premium industrial solutions to African markets.
          </p>
        </motion.div>

        {/* Partners Grid - Luxury grayscale style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
              className="group relative flex items-center justify-center h-24 rounded-lg bg-card border border-border hover:border-gold/50 transition-all duration-500"
            >
              {/* Partner name as placeholder for logo */}
              <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-300 tracking-wider font-heading uppercase">
                {partner}
              </span>
              
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>

        {/* Additional info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center text-muted-foreground mt-12 text-sm"
        >
          And many more industry-leading manufacturers
        </motion.p>
      </div>
    </section>
  );
};
