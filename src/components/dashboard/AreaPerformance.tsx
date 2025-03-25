
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AreaData {
  name: string;
  percentage: number;
  color?: string;
}

interface AreaPerformanceProps {
  areas: AreaData[];
  className?: string;
}

const AreaPerformance = ({ areas, className }: AreaPerformanceProps) => {
  return (
    <div className={className}>
      <div className="space-y-4">
        {areas.map((area, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{area.name}</p>
              <p className="text-sm font-medium">{area.percentage}%</p>
            </div>
            <Progress 
              value={area.percentage} 
              className="h-2" 
              style={area.color ? { '--progress-color': area.color } as React.CSSProperties : undefined}
              indicatorClassName={area.color ? `bg-[color:var(--progress-color)]` : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AreaPerformance;
