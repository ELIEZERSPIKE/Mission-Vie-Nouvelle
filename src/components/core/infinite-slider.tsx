"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import useMeasure from "react-use-measure";
import { cn } from "@/lib/utils";

interface InfiniteSliderProps {
  children: React.ReactNode;
  gap?: number;
  speed?: number; // pixels per second
  duration?: number; // total duration of one cycle in seconds (overrides speed)
  speedOnHover?: number; // custom speed on hover
  durationOnHover?: number; // custom duration on hover
  hoverToPause?: boolean; // pauses the slider on hover (default: true)
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
}

export function InfiniteSlider({
  children,
  gap = 16,
  speed = 80,
  duration,
  speedOnHover,
  durationOnHover,
  hoverToPause = true,
  direction = "horizontal",
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const controlsRef = useRef<any>(null);

  const size = direction === "horizontal" ? width : height;
  const contentSize = size + gap;

  // Calculate duration of one loop
  const finalDuration = duration ? duration : contentSize / speed;

  const from = reverse ? -contentSize : 0;
  const to = reverse ? 0 : -contentSize;

  useEffect(() => {
    if (size === 0) return;

    const controls = animate(translation, [from, to], {
      ease: "linear",
      duration: finalDuration,
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 0,
    });
    controlsRef.current = controls;

    return () => {
      controls.stop();
    };
  }, [translation, size, finalDuration, from, to]);

  useEffect(() => {
    if (!controlsRef.current) return;

    if (isHovered) {
      if (speedOnHover !== undefined) {
        const factor = speedOnHover / speed;
        controlsRef.current.speed = factor;
      } else if (durationOnHover !== undefined) {
        const factor = finalDuration / durationOnHover;
        controlsRef.current.speed = factor;
      } else if (hoverToPause) {
        controlsRef.current.speed = 0;
      }
    } else {
      controlsRef.current.speed = 1;
    }
  }, [isHovered, speedOnHover, speed, durationOnHover, hoverToPause, finalDuration]);

  return (
    <div
      className={cn("overflow-hidden w-full", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        style={{
          x: direction === "horizontal" ? translation : 0,
          y: direction === "vertical" ? translation : 0,
        }}
        className={cn(
          "flex w-max",
          direction === "horizontal" ? "flex-row" : "flex-col"
        )}
      >
        <div
          ref={ref}
          className={cn(
            "flex shrink-0",
            direction === "horizontal" ? "flex-row" : "flex-col"
          )}
          style={{ gap: `${gap}px` }}
        >
          {children}
        </div>
        <div
          className={cn(
            "flex shrink-0",
            direction === "horizontal" ? "flex-row" : "flex-col"
          )}
          style={{
            gap: `${gap}px`,
            [direction === "horizontal" ? "marginLeft" : "marginTop"]: `${gap}px`,
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}
