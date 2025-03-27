import { useState } from "react";

export interface TabProps {
  label: React.ReactNode;
  children: React.ReactNode;
  value: string;
}

export const Tab = ({ label, value, children }: TabProps) => {
  return (
    <div key={value} className="py-4">
      {children}
    </div>
  );
};

const Tabs = ({ children }: { children: React.ReactElement<TabProps>[] }) => {
  const tabValues = children.map((child) => child.props.value); // value로 탭 값들을 구함
  const [selectedTab, setSelectedTab] = useState(tabValues[0]);

  return (
    <div className="w-full">
      {/* 탭 버튼 */}
      <div className="flex border-b border-gray-200">
        {children.map(({ props: { label, value } }) => (
          <button
            key={value} // value를 key로 사용하여 고유하게 설정
            className={`px-4 py-2 text-sm font-medium ${
              selectedTab === value
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500"
            }`}
            onClick={() => setSelectedTab(value)} // value를 사용하여 클릭 시 탭을 선택
          >
            {label}
          </button>
        ))}
      </div>

      {/* 선택된 탭 내용 */}
      {children.find((child) => child.props.value === selectedTab)}
    </div>
  );
};

export default Tabs;
