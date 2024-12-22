const CloseButtonIcon = ({ className }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 32 32" height="24" width="24">
      <g id="cross">
        <line
          x1="7"
          y1="7"
          x2="25"
          y2="25"
          className="fill-none stroke-current stroke-2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="7"
          y1="25"
          x2="25"
          y2="7"
          className="fill-none stroke-current stroke-2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default CloseButtonIcon;
