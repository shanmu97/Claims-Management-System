import { motion, useReducedMotion } from "framer-motion";
import { FiShield } from "react-icons/fi";

function About() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="brand-page px-4 py-10 sm:px-6 lg:px-8">
      <div className="brand-section">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          className="brand-card p-8 sm:p-10"
        >
          <div className="flex items-center gap-3">
            <div className="icon-chip">
              <FiShield size={18} />
            </div>
            <div>
              <p className="section-label">About LumiqSure</p>
              <h1 className="text-3xl font-bold text-ink">Trusted protection, clearly managed</h1>
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            LumiqSure makes insurance simple, transparent, and easy to manage. From policy selection to claim tracking, every step is designed to keep customers informed and supported.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-row-alt)] p-6">
              <h2 className="text-xl font-bold text-ink">Our mission</h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                We focus on clarity, speed, and dependable service so that every policyholder feels confident when making decisions and filing claims.
              </p>
            </div>
            <div className="rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-row-alt)] p-6">
              <h2 className="text-xl font-bold text-ink">Why choose us</h2>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-muted">
                <li>• Transparent coverage choices</li>
                <li>• Fast claim updates and support</li>
                <li>• Personalized guidance for each customer</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default About;