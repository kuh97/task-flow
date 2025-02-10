const CalendarIcon = ({ className }: { className: string }) => {
  return (
    <svg fill="none" viewBox="0 0 24 24" className={className}>
      <path
        d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z"
        stroke="#a0aec0" // 연한 회색으로 변경
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export default CalendarIcon;
