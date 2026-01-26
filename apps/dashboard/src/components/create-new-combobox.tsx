"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxCreateNew,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/kibo-ui/combobox";
import { useState, useEffect, useMemo } from "react";
import { z } from "zod";

const CreateNewCombobox = ({
  initialOptions,
  createNewFunction = (value) => {},
  label,
  value,
  onValueChange,
  disableCreateNew = false,
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
  disableCreateNew?: boolean;
}) => {
  const [data, setData] = useState(initialOptions);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setData(initialOptions);
  }, [initialOptions]);

  // Create Zod schema that validates the input value
  const createNewSchema = useMemo(() => {
    const existingLabels = data.map((option) => option.label.toLowerCase());
    return z
      .string()
      .trim()
      .min(1, "Value cannot be empty")
      .refine(
        (val) => !existingLabels.includes(val.toLowerCase()),
        "This value already exists",
      );
  }, [data]);

  // Check if current input is valid for creation
  const isValidForCreation = useMemo(() => {
    const result = createNewSchema.safeParse(inputValue);
    return result.success;
  }, [inputValue, createNewSchema]);

  const handleCreateNew = (newValue: string) => {
    // Final validation before creation
    const result = createNewSchema.safeParse(newValue);
    if (!result.success) {
      return;
    }

    const uuid = crypto.randomUUID();
    const formattedValue = {
      value: uuid,
      label: newValue.trim(),
    };
    setData((prev) => [...prev, formattedValue]);
    // Select the newly created item by UUID
    // Use setTimeout to ensure this runs after ComboboxCreateNew's onValueChange
    setTimeout(() => {
      if (onValueChange) {
        onValueChange(uuid);
      }
    }, 0);
    createNewFunction({ id: uuid, name: newValue.trim() });
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
        <ComboboxInput value={inputValue} onValueChange={setInputValue} />
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
          {!disableCreateNew && isValidForCreation && (
            <ComboboxCreateNew onCreateNew={handleCreateNew} />
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default CreateNewCombobox;
