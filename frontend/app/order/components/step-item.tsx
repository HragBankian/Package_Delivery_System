"use client";

import { useOrderFormContext } from "@/components/multistep-form-context";

interface StepItemProps {
  infos: {
    num: number;
    title: string;
    description: string;
  };
}
export function StepItem({ infos }: StepItemProps) {
  const { step } = useOrderFormContext();
  const isFinished = step === 5 && infos.num === 4;
  return (
    <li className="flex items-center gap-4 uppercase">
      <span
        className={`flex size-10 items-center justify-center rounded-full border-2 font-medium ${
          step === infos.num || isFinished
            ? "border-omnivoxblue bg-omnivoxorange text-white"
            : "text-omnivoxorange border-omnivoxorange"
        }`}
      >
        {infos.num}
      </span>
      <div className="hidden flex-col lg:flex">
        <p className="text-sm text-gray-600 font-bold">{infos.title}</p>
        <p className="text-omnivoxdarkorange">{infos.description}</p>
      </div>
    </li>
  );
}
