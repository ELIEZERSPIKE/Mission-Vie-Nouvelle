import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { motion } from "framer-motion";
import { STATS } from "@/lib/content";
export default function ImpactStats() {
    return (_jsx("section", { className: "bg-background py-24 sm:py-32 grain", children: _jsxs("div", { className: "max-w-[1400px] mx-auto px-5 sm:px-8", children: [_jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border", children: STATS.map((stat, i) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.5, delay: i * 0.08 }, className: "bg-background p-8 sm:p-10 text-center", children: [_jsxs("p", { className: "font-heading text-5xl sm:text-6xl text-primary leading-none", children: [stat.value, _jsx("span", { className: "text-accent", children: stat.suffix })] }), _jsx("p", { className: "mt-4 text-sm text-foreground/60 leading-snug", children: stat.label })] }, stat.label))) }), _jsx("p", { className: "text-center text-xs text-foreground/40 mt-8 uppercase tracking-[0.2em]", children: "Qui servons-nous ? \u2014 Le peuple togolais, dans toute sa diversit\u00E9." })] }) }));
}
