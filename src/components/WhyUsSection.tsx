import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, Clock, Users, Globe, Award, Zap } from 'lucide-react';

const reasons = [
  {
    icon: Shield,
    title: 'Unmatched Trust',
    description: 'Three decades of reliability and integrity have made us the preferred partner for Africa\'s leading enterprises.',
  },
  {
    icon: Clock,
    title: '29+ Years Experience',
    description: 'Deep industry expertise and market knowledge refined over nearly three decades of operations.',
  },
  {
    icon: Users,
    title: 'Quality Partners',
    description: 'Exclusive partnerships with world-class manufacturers ensuring premium products at competitive prices.',
  },
  {
    icon: Globe,
    title: 'Pan-African Network',
    description: 'Strategic presence across 12 countries with localized teams understanding regional requirements.',
  },
  {
    icon: Award,
    title: 'Certified Excellence',
    description: 'International certifications and quality standards ensuring consistent product performance.',
  },
  {
    icon: Zap,
    title: 'Rapid Delivery',
    description: 'Optimized logistics and strategic warehousing enabling swift delivery across the continent.',
  },
];

export const WhyUsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="why-us" className="py-24 lg:py-32 bg-secondary/30 relative overflow-hidden" ref={ref}>
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[150px] -translate-y-1/2" />
      
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <span className="inline-block text-sm font-medium text-primary uppercase tracking-widest mb-6 font-heading">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-heading">
            The Groupe Premium
            <br />
            <span className="text-gradient-crimson">Advantage</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Discover why industry leaders across Africa trust us as their 
            preferred partner for industrial equipment and professional supplies.
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group text-center p-8"
            >
              {/* Icon with glow effect */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-gold/20 blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center group-hover:border-primary/50 transition-all duration-500">
                  <reason.icon className="w-7 h-7 text-gold group-hover:text-primary transition-colors duration-500" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-3 font-heading">
                {reason.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 p-6 rounded-xl bg-card border border-border">
            <div className="text-left">
              <div className="text-2xl font-bold text-foreground font-heading">500+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-heading">Satisfied Clients</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-left">
              <div className="text-2xl font-bold text-foreground font-heading">98%</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-heading">Client Retention</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-left">
              <div className="text-2xl font-bold text-foreground font-heading">24/7</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-heading">Support Available</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
