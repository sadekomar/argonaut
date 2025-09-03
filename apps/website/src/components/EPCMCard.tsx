import React from "react";

type Props = {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
};

export default function EPCMCard({ Icon, title }: Props) {
  return (
    <div className="bg-neutral-100 p-6 flex flex-col justify-between rounded-md">
      <Icon className="w-12 h-12 stroke-[#8390FA]" />
      <div className="text-[#808080] font-medium text-lg">{title}</div>
    </div>
  );
}
