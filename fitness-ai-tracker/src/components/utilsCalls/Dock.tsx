"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  FC,
  ReactNode,
} from "react";

import "./Dock.css";

/* ----------------------------------------------------------
   Types
---------------------------------------------------------- */

export interface DockItemConfig {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

interface DockProps {
  /** Array of objects: { icon, label, onClick } */
  items: DockItemConfig[];
  /** Spring settings for Framer Motion */
  spring?: { mass: number; stiffness: number; damping: number };
  /** Max scale in px when hovered */
  magnification?: number;
  /** Distance in px from cursor that influences scale fall-off */
  distance?: number;
  /** Height of the visible bar while inactive */
  panelHeight?: number;
  /** Max height when items are magnified */
  dockHeight?: number;
  /** Base size (width/height) of each icon item in px */
  baseItemSize?: number;
  /** Extra utility classes */
  className?: string;
}

/* ----------------------------------------------------------
   Helper components 
---------------------------------------------------------- */

const DockIcon: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <div className={`dock-icon ${className}`}>{children}</div>;

const DockLabel: FC<{
  children: ReactNode;
  isHovered: ReturnType<typeof useMotionValue>;
  className?: string;
}> = ({ children, isHovered, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsub = isHovered.on("change", (v) => setIsVisible(v === 1));
    return () => unsub();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`dock-label ${className}`}
          role="tooltip"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DockItem: FC<{
  cfg: DockItemConfig;
  mouseX: ReturnType<typeof useMotionValue>;
  spring: NonNullable<DockProps["spring"]>;
  distance: number;
  magnification: number;
  baseItemSize: number;
}> = ({ cfg, mouseX, spring, distance, magnification, baseItemSize }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isHovered = useMotionValue(0);

  // distance from cursor to icon center
  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  // map distance to target size
  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={cfg.onClick}
      tabIndex={0}
      role="button"
      aria-label={cfg.label}
      className={`dock-item ${cfg.className ?? ""}`}
    >
      <DockIcon>{cfg.icon}</DockIcon>
      <DockLabel isHovered={isHovered}>{cfg.label}</DockLabel>
    </motion.div>
  );
};

/* ----------------------------------------------------------
   Main Dock component
---------------------------------------------------------- */

const Dock: FC<DockProps> = ({
  items,
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 68,
  dockHeight = 256,
  baseItemSize = 50,
}) => {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight]
  );

  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div style={{ height }} className="dock-outer">
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`dock-panel ${className}`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((cfg, idx) => (
          <DockItem
            key={idx}
            cfg={cfg}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Dock;
