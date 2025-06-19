"use client";

import { motion } from "motion/react";

function LoadingCircleSpinner() {
  return (
    <div className="flex justify-center items-center p-[40px] rounded-xs relative">
      <motion.div
        className="w-[90px] h-[90px] rounded-full border-4 transform border-t-primary-foreground absolute"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          // ease: [0.6, 0.2, 0.9, 1],
          ease: "linear",
        }}
      />
      Loading
      {/* <StyleSheet /> */}
    </div>
  );
}

/**
 * ==============   Styles   ================
 */
function StyleSheet() {
  return (
    <style>
      {`

            `}
    </style>
  );
}

export default LoadingCircleSpinner;
