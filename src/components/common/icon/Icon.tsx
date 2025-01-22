import React, { Suspense, useMemo } from "react";

interface IconProps {
  name: string;
  className?: string;
  alt?: string;
}

const Icon = ({ name, className, alt }: IconProps) => {
  const IconComponent = useMemo(
    () =>
      React.lazy(() =>
        import(`@assets/${name}.svg?react`).then((module) => ({
          default: (props: React.SVGProps<SVGSVGElement>) =>
            React.createElement(module.default || module, props),
        }))
      ),
    [name]
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IconComponent className={className} aria-label={alt} />
    </Suspense>
  );
};

export default Icon;
