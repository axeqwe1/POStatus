// components/filters/DateRangeFilter.tsx
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

export function DateRangeFilter({ column }: { column: any }) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleChange = (range: DateRange | undefined) => {
    setDateRange(range);
    column.setFilterValue(range); // 👈 กรองข้อมูล
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[250px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange?.from
            ? `${format(dateRange.from, "dd/MM/yyyy")} - ${format(
                dateRange?.to ?? dateRange.from,
                "dd/MM/yyyy"
              )}`
            : "เลือกช่วงวันที่"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={handleChange}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
