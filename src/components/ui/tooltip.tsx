import React, { useState, useRef, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";

interface TooltipPortalProps {
  tooltip: ReactNode;
  children: ReactNode;
}

export default function ToolTip({ tooltip, children }: TooltipPortalProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      // Adjust tooltip above the element with a small gap (e.g., 8px)
      setPosition({ top: rect.top - 8, left: rect.left + rect.width / 2 });
    }
    setVisible(true);
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  // Update position on window resize or scroll
  useEffect(() => {
    const updatePosition = () => {
      if (triggerRef.current && visible) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({ top: rect.top - 8, left: rect.left + rect.width / 2 });
      }
    };

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [visible]);

  return (
    <>
      {/* Wrap the trigger element */}
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>

      {visible &&
        createPortal(
          <div
            className="bg-gray-700 text-white text-xs rounded px-3 py-2 max-w-[250px] min-w-[100px] w-fit text-center z-[1000] pointer-events-none shadow-lg transition-opacity duration-200"
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              transform: "translate(-50%, -100%)",
            }}
          >
            {tooltip}
          </div>,
          document.body
        )}
    </>
  );
}
