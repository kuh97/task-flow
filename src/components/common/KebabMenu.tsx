interface MenuItem {
  label: string;
  onClick: () => void;
  className?: string;
}

interface KebabMenuProps {
  menuItems: MenuItem[];
  onClose: () => void;
  className?: string;
}

/**
 * 케밥 메뉴 컴포넌트입니다.
 */
const KebabMenu = ({ menuItems, onClose, className }: KebabMenuProps) => {
  return (
    <div
      className={`absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 ${className || ""}`}
    >
      <ul className="py-1">
        {menuItems.map((item, index) => (
          <li key={index}>
            <button
              onMouseDown={() => {
                item.onClick();
                onClose();
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center ${item.className || ""}`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KebabMenu;
