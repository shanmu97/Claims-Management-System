import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiBookOpen, FiFilePlus, FiShield } from "react-icons/fi";

function Home() {
  const reduceMotion = useReducedMotion();

  const highlights = [
    { icon: FiShield, title: "Buy policies", text: "Compare coverage and pick the right plan for every season of life." },
    { icon: FiFilePlus, title: "File claims", text: "Submit evidence-backed claims with a clear, guided experience." },
    { icon: FiBookOpen, title: "Track status", text: "Follow every update from submission through approval with confidence." },
  ];

  return (
    <div className="brand-page">
      <section className="brand-panel px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="brand-shell mx-auto flex max-w-6xl flex-col items-center text-center">
          <div className="ambient-ring left-4 top-4 h-40 w-40" />
          <div className="ambient-ring bottom-6 right-6 h-52 w-52" />
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative max-w-3xl rounded-[1.5rem] border border-[color:var(--color-line)]/40 bg-[color:var(--color-card)]/10 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.16)] backdrop-blur sm:p-10"
          >
            <div className="mx-auto inline-flex items-center rounded-full border border-[color:var(--color-accent)]/60 bg-[color:var(--color-card)]/10 px-5 py-2 text-sm font-bold text-[color:var(--color-ice)]">
              Claims made simple
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-card sm:text-5xl">
              Claims Management System
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[color:var(--color-ice)] sm:text-xl">
              Manage policies, submit claims, and track progress with a calm, polished claims experience.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/policies" className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-card transition hover:bg-accent-deep">
                Explore policies
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="brand-section">
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                whileHover={reduceMotion ? undefined : { y: -2, scale: 1.01 }}
                className="brand-card p-6"
              >
                <div className="icon-chip soft">
                  <Icon size={18} />
                </div>
                <h2 className="mt-4 text-xl font-bold text-ink">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
              </motion.article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Home;
