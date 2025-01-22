interface ChevronIconProps {
  isDown: boolean;
}

/**
 * 위, 아래 화살표 아이콘입니다.
 */
const ChevronIcon = ({ isDown }: ChevronIconProps) => {
  return (
    <svg
      className={`w-4 h-4 ml-auto transition-transform ${!isDown ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
};

export default ChevronIcon;
