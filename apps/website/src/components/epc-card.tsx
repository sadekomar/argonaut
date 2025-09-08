import React from "react";

type Props = {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
};

export default function EPCCard({ Icon, title }: Props) {
  return (
    <div className="base:!gap-4 flex flex-col justify-between gap-4 rounded-md bg-neutral-100 p-4 sm:gap-6 sm:p-6">
      <Icon className="base:h-10 base:w-10 h-8 w-8 stroke-[#8390FA]" />
      <div className="description1 text-[#808080]">{title}</div>
    </div>
  );
}
