import React from "react";

const LogoSvg = () => {
  return (
    <svg
      className="w-full block dark:hidden"
      viewBox="0 0 100 20" // Adjusted viewBox for text
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="50%" // Center the text horizontally
        y="50%" // Center the text vertically
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="12" // Adjust font size as needed
        fill="currentColor" // Use currentColor for dark text on light background
        fontFamily="Arial, sans-serif" // Specify a common font family
      >
        HabibiStay
      </text>
    </svg>
  );
};

export default LogoSvg;
