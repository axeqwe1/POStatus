"use client";
import * as React from "react";
import { cn } from "@/lib/utils"; // helper classnames
import { Input } from "./input";

interface InputDropdownProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string; // สำหรับ container wrapper
  inputClassName?: string; // สำหรับ input element
  optionClassName?: string; // สำหรับแต่ละ option
  dropdownClassName?: string; // สำหรับ ul dropdown
}

export function InputDropdown({
  options,
  value,
  onChange,
  placeholder,
  className,
  inputClassName,
  optionClassName,
  dropdownClassName,
}: InputDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // ปิด dropdown ถ้าคลิกรอบนอก
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className={cn("relative w-full", className)} ref={ref}>
      <Input
        type="text"
        className={cn(
          "input input-bordered w-full",
          open && "rounded-b-none",
          inputClassName
        )}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        autoComplete="off"
      />
      {open && filteredOptions.length > 0 && (
        <ul
          className={cn(
            "absolute z-10 mt-0.5 w-full max-h-48 overflow-auto rounded-b-md border border-accent bg-accent shadow-lg",
            dropdownClassName
          )}
        >
          {filteredOptions.map((opt) => (
            <li
              key={opt}
              className={cn(
                "cursor-pointer px-4 py-2 hover:bg-primary hover:text-white",
                optionClassName
              )}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
