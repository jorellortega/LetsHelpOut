import React from 'react';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface DatePickerProps {
  label: string;
  selected: string;
  onChange: (date: string) => void;
  minDate?: string;
}

export function DatePicker({ label, selected, onChange, minDate }: DatePickerProps) {
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    onChange(formatDate(date));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="date-picker">{label}</Label>
      <Input
        type="date"
        id="date-picker"
        value={selected}
        onChange={handleChange}
        min={minDate}
        className="w-full"
      />
    </div>
  );
}

