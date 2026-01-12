import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-16 w-full bg-[#1a1b26] font-['VT323',_monospace] py-10 px-2 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-6 text-center">
        <div
          className="flex flex-col md:flex-row items-center gap-3 text-2xl text-gray-300 tracking-widest uppercase"
          style={{ textShadow: "2px 2px 0 #000" }}
        >
          <span className="font-bold text-white">
            &copy; {currentYear} QueueQuest
          </span>
          <span className="hidden md:block text-white/20 mx-2">-</span>
          <span className="text-[#4ade80]">
            Implementasi Teori Simulasi Pemodelan
          </span>
        </div>
      </div>
    </motion.footer>
  );
}
