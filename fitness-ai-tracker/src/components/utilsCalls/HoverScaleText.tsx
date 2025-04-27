import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
  } from "framer-motion";
  import React, { useRef } from "react";
  import { FC } from "react";
  
  const springCfg = { mass: 0.3, stiffness: 150, damping: 42 };
  
  const HoverScaleText: FC<{ children: React.ReactNode }> = ({ children }) => {
    const mouseX = useMotionValue<number | undefined>(undefined);
    const ref = useRef<HTMLAnchorElement | null>(null);
  
    /* ---------- distance & scale ---------- */
    const dist = useTransform(mouseX, (x = Infinity) => {
      const r = ref.current?.getBoundingClientRect();
      return r ? Math.abs(x - (r.x + r.width / 2)) : Infinity;
    });
    const scaleTarget = useTransform(dist, [0, 120], [1.3, 1]); // slightly less zoom
    const scale = useSpring(scaleTarget, springCfg);
  
    /* ---------- border & color maps ---------- */
    const borderWidth = useTransform(dist, [0, 120], [1, 0]);     // px
    const color = useTransform(
      dist,
      [0, 120],
      ["#c9c9c9", "#ffffff"] // darker when close
    );
  
    return (
      <motion.a
        href="/"
        ref={ref}
        style={{ scale, color, borderWidth }}
        className="lt-brand-link"
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(undefined)}
      >
        {children}
      </motion.a>
    );
  };
  
  export default HoverScaleText;
  