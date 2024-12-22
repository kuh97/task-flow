interface CircularProgressProps {
  progress: number; // 0 ~ 100
  size?: number; // 원형의 크기
  strokeWidth?: number; // 선의 두께
  className?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  className,
  size = 100,
  strokeWidth = 10,
}) => {
  // 원의 반지름
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // 진행률에 따른 stroke-dashoffset 계산
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`${className} flex justify-center items-center w-fit`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 배경 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgb(199 210 254)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* 진행률 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgb(99 102 241)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
    </div>
  );
};

export default CircularProgress;
