"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxCreateNew,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/kibo-ui/combobox";
import { useState } from "react";

// const initialFrameworks = [
//   {
//     value: "next.js",
//     label: "Next.js",
//   },
//   {
//     value: "sveltekit",
//     label: "SvelteKit",
//   },
//   {
//     value: "nuxt.js",
//     label: "Nuxt.js",
//   },
//   {
//     value: "remix",
//     label: "Remix",
//   },
//   {
//     value: "astro",
//     label: "Astro",
//   },
//   {
//     value: "vite",
//     label: "Vite",
//   },
// ];

const CreateNewCombobox = ({
  initialOptions,
  createNewFunction = (value) => {},
}: {
  initialOptions: { value: string; label: string }[];
  createNewFunction?: (value: string) => void;
}) => {
  const [data, setData] = useState(initialOptions);
  const [currentValue, setCurrentValue] = useState("");

  const handleCreateNew = (newValue: string) => {
    // console.log("Creating new framework:", newValue);

    // Add the new framework to the list
    const newFramework = {
      value: newValue.toLowerCase().replace(/\s+/g, "-"),
      label: newValue,
    };
    setData((prev) => [...prev, newFramework]);
    setCurrentValue(newFramework.value);
    createNewFunction(newValue);
  };

  return (
    <Combobox
      data={data}
      onValueChange={setCurrentValue}
      type="framework"
      value={currentValue}
    >
      <ComboboxTrigger className="w-[300px]" />
      <ComboboxContent>
        <ComboboxInput />
        <ComboboxEmpty>
          <ComboboxCreateNew onCreateNew={handleCreateNew} />
        </ComboboxEmpty>
        <ComboboxList>
          <ComboboxGroup>
            {data.map((framework) => (
              <ComboboxItem key={framework.value} value={framework.value}>
                {framework.label}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default CreateNewCombobox;
