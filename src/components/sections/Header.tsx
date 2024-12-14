interface HeaderProps {
  title: string;
  buttonLabel?: string;
  onClick?: () => void;
}

function Header({ title, buttonLabel, onClick }: HeaderProps) {
  return (
    <div className="flex justify-between">
      <h1 className="text-2xl font-bold">{title}</h1>
      {buttonLabel && (
        <button
          className={
            "bg-primary text-white hover:bg-primary-hover font-medium py-2 px-4 rounded mr-2 transition duration-300"
          }
          onClick={onClick}
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}

export default Header;
