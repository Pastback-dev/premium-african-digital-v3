import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Target, Eye, Award } from 'lucide-react';

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="about" className="py-24 lg:py-32 bg-background relative overflow-hidden" ref={ref}>
      {/* Subtle background accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute -left-32 top-1/2 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[150px]" />

      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center"
        >
          {/* Left Content */}
          <div>
            <motion.span
              variants={itemVariants}
              className="inline-block text-sm font-medium text-primary uppercase tracking-widest mb-6 font-heading"
            >
              About Us
            </motion.span>

            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 font-heading leading-tight"
            >
              Building Africa's
              <br />
              <span className="text-gradient-gold">Industrial Future</span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground mb-8 leading-relaxed"
            >
              Founded in Casablanca in 1995, Groupe Premium has grown to become one of Africa's 
              most trusted distributors of industrial equipment and professional supplies. Our 
              strategic network spans 12 countries, connecting global manufacturers with African 
              industries.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground mb-10 leading-relaxed"
            >
              We pride ourselves on delivering excellence at every touchpoint—from sourcing 
              world-class products to ensuring seamless logistics across the continent.
            </motion.p>

            {/* Vision & Mission */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 font-heading">Our Mission</h3>
                  <p className="text-muted-foreground">
                    To empower African industries with premium equipment and unparalleled service, 
                    driving continental growth and innovation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                  <Eye className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 font-heading">Our Vision</h3>
                  <p className="text-muted-foreground">
                    To be the definitive partner for industrial excellence across Africa, 
                    recognized for trust, quality, and transformative impact.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Image/Stats Card */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-secondary">
              {/* Placeholder for premium image */}
              <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-background" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Award className="w-20 h-20 text-gold mx-auto mb-6 opacity-50" />
                  <p className="text-muted-foreground/50 text-sm uppercase tracking-widest font-heading">
                    Excellence Since 1995
                  </p>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-6 right-6 w-20 h-20 border border-gold/20 rounded-full" />
              <div className="absolute bottom-6 left-6 w-32 h-32 border border-primary/20 rounded-full" />
            </div>

            {/* Floating stats card */}
            <div className="absolute -bottom-8 -left-8 bg-card border border-border rounded-xl p-6 premium-shadow">
              <div className="text-4xl font-bold text-foreground mb-1 font-heading">29+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-heading">
                Years of Excellence
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
