
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
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Top Performing Areas</CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
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
                indicatorClassName={area.color ? `bg-[${area.color}]` : undefined}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AreaPerformance;
