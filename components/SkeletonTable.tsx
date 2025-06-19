import { Skeleton } from "./ui/skeleton";

export function SkeletonTable({
  rows = 5,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="px-4 w-full h-full space-y-2">
      {/* หัวตาราง */}
      <div className="flex space-x-2">
        {Array.from({ length: cols }).map((_, colIdx) => (
          <Skeleton key={colIdx} className="h-6 w-full flex-1" />
        ))}
      </div>

      {/* แถวข้อมูล */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex space-x-2">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Skeleton key={colIdx} className="h-6 w-full flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
