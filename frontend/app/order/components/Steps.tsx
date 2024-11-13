import { StepItem } from "./step-item";

const stepData = [
  { num: 1, title: "Step 1", description: "Pickup and Dropoff" },
  { num: 2, title: "Step 2", description: "Packages" },
  { num: 3, title: "Step 3", description: "Summary and Payment" },
  { num: 4, title: "Step 4", description: "Confimration" },
];
export function Steps() {
  return (
    <header className="flex items-start justify-center bg-sidebarMobile bg-cover bg-no-repeat p-6 lg:rounded-md lg:bg-sidebarDesktop lg:bg-cover lg:bg-center bg-white">
      <ul className="flex gap-4 text-white lg:gap-8">
        {stepData.map((info, index) => {
          return <StepItem key={index} infos={info} />;
        })}
      </ul>
    </header>
  );
}
