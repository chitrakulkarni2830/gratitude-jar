import { motion } from 'framer-motion';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <motion.div 
      className={styles.hero}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h1 className={styles.title}>Gratitude Jar</h1>
      <p className={styles.subtitle}>
        A cozy space to capture small moments of joy, appreciation, and light.
      </p>
    </motion.div>
  );
}
