"use client";

import React, { useMemo } from "react";
import {
  motion,
  Transition,
  Variants,
  useAnimation,
} from "framer-motion";

type TextRollProps = {
  children: string;
  className?: string;
  duration?: number;
  getEnterDelay?: (index: number) => number;
  getExitDelay?: (index: number) => number;
  transition?: Transition;
  variants?: { enter: { initial: any; animate: any }; exit: { initial: any; animate: any } };
  onStart?: () => void;
  onEnd?: () => void;
  center?: boolean;
};

const defaultVariants = {
  enter: {
    initial: { rotateX: 0 },
    animate: { rotateX: 90 },
  },
  exit: {
    initial: { rotateX: 90 },
    animate: { rotateX: 0 },
  },
};

export default function TextRoll({
  children,
  className = "",
  duration = 0.32,
  getEnterDelay = (i) => i * 0.025,
  getExitDelay = (i) => i * 0.025 + 0.08,
  transition = { ease: "easeIn" },
  variants = defaultVariants,
  onStart,
  onEnd,
  center = false,
}: TextRollProps) {
  const characters = useMemo(() => children.split(""), [children]);
  const controls = useAnimation();

  const enterVariants: Variants = {
    initial: variants.enter.initial,
    animate: variants.enter.animate,
  };
  const exitVariants: Variants = {
    initial: variants.exit.initial,
    animate: variants.exit.animate,
  };

  const handleHoverStart = () => {
    onStart?.();
    controls.start("hovered");
  };

  const handleHoverEnd = () => {
    onEnd?.();
  };

  return (
  <motion.span
  className={`relative inline-block whitespace-nowrap ${className}`}
  style={{ perspective: 800 }}
  onMouseEnter={handleHoverStart}
  onMouseLeave={handleHoverEnd}
  onAnimationComplete={() => onEnd?.()}
>
      <span className="relative inline-flex overflow-hidden">
        {characters.map((char, i) => (
          <span
            key={`top-${i}`}
            className="relative inline-block"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.span
              className="inline-block"
              style={{ transformOrigin: "50% 100%", backfaceVisibility: "hidden" }}
              initial="initial"
              variants={enterVariants}
              animate={controls}
              transition={{
                ...transition,
                duration,
                delay: getEnterDelay(i),
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          </span>
        ))}
      </span>
      <span className="absolute inset-0 inline-flex overflow-hidden">
        {characters.map((char, i) => (
          <span
            key={`bottom-${i}`}
            className="relative inline-block"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.span
              className="inline-block"
              style={{ transformOrigin: "50% 0%", backfaceVisibility: "hidden" }}
              initial="initial"
              variants={exitVariants}
              animate={controls}
              transition={{
                ...transition,
                duration,
                delay: getExitDelay(i),
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          </span>
        ))}
      </span>
      {/* Spacer invisible pour garder la largeur du texte */}
      <span className="invisible">{center ? children : children}</span>
    </motion.span>
  );
}