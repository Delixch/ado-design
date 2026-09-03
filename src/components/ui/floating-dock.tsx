import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { playClick } from '@/lib/sound';

export interface DockItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

export const FloatingDock: React.FC<{
  items: DockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
}> = ({ items, desktopClassName, mobileClassName }) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile: React.FC<{
  items: DockItem[];
  className?: string;
}> = ({ items, className }) => {
  const [open, setOpen] = useState(false);

  // Select key items for mobile flower petal arc (5 items)
  const mobileItems = items.slice(0, 5);
  const radius = 68; // distance from center button in pixels

  return (
    <div className={cn('relative block md:hidden', className)}>
      <AnimatePresence>
        {open && (
          <div className="absolute inset-0 pointer-events-auto">
            {mobileItems.map((item, idx) => {
              // Distribute angles in a 140-degree radial arc around top of button (-160deg to -20deg)
              const total = mobileItems.length;
              const angleDeg = -160 + (idx * 140) / (total - 1);
              const angleRad = (angleDeg * Math.PI) / 180;
              const targetX = Math.round(radius * Math.cos(angleRad));
              const targetY = Math.round(radius * Math.sin(angleRad));

              return (
                <motion.div
                  key={item.title}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: -60 }}
                  animate={{
                    x: targetX,
                    y: targetY,
                    scale: 1,
                    opacity: 1,
                    rotate: 0,
                  }}
                  exit={{
                    x: 0,
                    y: 0,
                    scale: 0,
                    opacity: 0,
                    rotate: 60,
                    transition: { duration: 0.2, delay: idx * 0.03 },
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 22,
                    delay: idx * 0.04,
                  }}
                  className="absolute top-1/2 left-1/2 -mt-5 -ml-5 z-20"
                >
                  <a
                    href={item.href}
                    onClick={() => {
                      playClick();
                      setOpen(false);
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#000000] border-2 border-[#FF5A1F] text-[#FF5A1F] shadow-[0_0_15px_rgba(255,90,31,0.5)] transition-transform active:scale-95"
                    title={item.title}
                  >
                    <div className="h-4 w-4 flex items-center justify-center">{item.icon}</div>
                  </a>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
      <button
        onClick={() => {
          playClick();
          setOpen(!open);
        }}
        className="relative z-30 flex h-12 w-12 items-center justify-center rounded-full bg-[#000000] border-2 border-[#FF5A1F] text-[#FF5A1F] shadow-[0_0_20px_rgba(255,90,31,0.6)] active:scale-90 transition-transform"
      >
        <motion.span
          animate={{ rotate: open ? 135 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="font-mono-ui text-[16px] font-bold"
        >
          ⚡
        </motion.span>
      </button>
    </div>
  );
};

const FloatingDockDesktop: React.FC<{
  items: DockItem[];
  className?: string;
}> = ({ items, className }) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        'mx-auto hidden md:flex h-16 items-end gap-3.5 rounded-sm bg-[#000000] border-2 border-[#FF5A1F] px-4 pb-2.5 shadow-[0_0_32px_rgba(255,90,31,0.55)] transition-shadow duration-300',
        className
      )}
    >
      {items.map((item, idx) => (
        <IconContainer mouseX={mouseX} key={item.title} idx={idx} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  idx = 0,
}: {
  mouseX: any;
  title: string;
  icon: React.ReactNode;
  href: string;
  idx?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const isHeartbeat = title === 'Kontakt' || title === 'Contact';

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [42, 75, 42]);
  const heightSync = useTransform(distance, [-150, 0, 150], [42, 75, 42]);

  const iconWidthSync = useTransform(distance, [-150, 0, 150], [22, 38, 22]);
  const iconHeightSync = useTransform(distance, [-150, 0, 150], [22, 38, 22]);

  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });
  const height = useSpring(heightSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const iconWidth = useSpring(iconWidthSync, { mass: 0.1, stiffness: 150, damping: 12 });
  const iconHeight = useSpring(iconHeightSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <a
      href={href}
      onClick={() => playClick()}
      target={href.startsWith('http') ? '_blank' : '_self'}
      rel="noopener noreferrer"
    >
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "relative flex items-center justify-center rounded-sm bg-[#000000] border transition-colors shadow-md group",
          isHeartbeat ? "border-[#FF5A1F]/60 shadow-[0_0_15px_rgba(255,90,31,0.35)]" : "border-white/10 hover:border-[#FF5A1F] hover:bg-[#FF5A1F]/20"
        )}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 2, x: '-50%' }}
              className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#0A0A0A] px-2.5 py-1 font-mono-ui text-[10px] uppercase tracking-[0.14em] text-[#FF5A1F] shadow-lg"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          animate={hovered ? { y: 0, scale: 1 } : (isHeartbeat ? {
            scale: [1, 1.32, 1.08, 1.4, 1, 1],
          } : {
            y: [0, -3.5, 0, 2, 0],
            scale: [1, 1.08, 1, 0.96, 1],
          })}
          transition={hovered ? { duration: 0.2 } : (isHeartbeat ? {
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.14, 0.28, 0.42, 0.6, 1],
          } : {
            duration: 3.6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: idx * 0.45,
          })}
          style={{ width: iconWidth, height: iconHeight }}
          className={cn(
            "flex items-center justify-center transition-colors",
            isHeartbeat ? "text-[#FF5A1F]" : "text-white/80 group-hover:text-[#FF5A1F]"
          )}
        >
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
}
