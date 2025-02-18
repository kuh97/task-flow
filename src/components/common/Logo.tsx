const Logo = () => {
  return (
    <div className="flex items-center gap-2 font-bold text-lg font-logo">
      <img
        src="/public/taskflow.svg"
        alt="taskflow-logo"
        width={25}
        height={25}
      />
      TaskFlow
    </div>
  );
};

export default Logo;
