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
import { useState, useEffect } from "react";

const CreateNewCombobox = ({
  initialOptions,
  createNewFunction = (value) => {},
  label,
  value,
  onValueChange,
}: {
  initialOptions: { value: string; label: string }[];
  createNewFunction?: ({
    id,
    name,
    companyId,
  }: {
    id: string;
    name: string;
    companyId?: string;
  }) => void;
  label?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}) => {
  const [data, setData] = useState(initialOptions);

  useEffect(() => {
    setData(initialOptions);
  }, [initialOptions]);

  const handleCreateNew = (newValue: string) => {
    const uuid = crypto.randomUUID();
    const formattedValue = {
      value: uuid,
      label: newValue,
    };
    setData((prev) => [...prev, formattedValue]);
    // Select the newly created item by UUID
    // Use setTimeout to ensure this runs after ComboboxCreateNew's onValueChange
    setTimeout(() => {
      if (onValueChange) {
        onValueChange(uuid);
      }
    }, 0);
    createNewFunction({ id: uuid, name: newValue });
  };

  return (
    <Combobox
      data={data}
      type={label ?? "item"}
      value={value ?? ""}
      onValueChange={onValueChange}
    >
      <ComboboxTrigger className="w-[300px]" />
      <ComboboxContent>
        <ComboboxInput />
        <ComboboxEmpty>
          <ComboboxCreateNew onCreateNew={handleCreateNew} />
        </ComboboxEmpty>
        <ComboboxList>
          <ComboboxGroup>
            {data.map((option) => (
              <ComboboxItem
                key={option.value}
                value={option.value}
                keywords={[option.label]}
              >
                {option.label}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default CreateNewCombobox;
