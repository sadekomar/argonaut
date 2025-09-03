import React from "react";

type Props = {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
};

export default function EPCMCard({ Icon, title }: Props) {
  return (
    <div className="flex flex-col justify-between rounded-md bg-neutral-100 p-6">
      <Icon className="h-12 w-12 stroke-[#8390FA]" />
      <div className="text-lg font-medium text-[#808080]">{title}</div>
    </div>
  );
}
