
import { ArrowDown, ArrowUp, LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  change?: number;
  changeText?: string;
  className?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeText,
  className,
}: StatCardProps) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  const isNeutral = change === 0;

  return (
    <Card className={className}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{value}</div>
          {change !== undefined && (
            <div
              className={`flex items-center text-sm font-medium ${
                isPositive
                  ? "text-emerald-500"
                  : isNegative
                  ? "text-rose-500"
                  : "text-amber-500"
              }`}
            >
              {isPositive && <ArrowUp className="h-4 w-4 mr-1" />}
              {isNegative && <ArrowDown className="h-4 w-4 mr-1" />}
              {isNeutral && <span className="h-4 mr-1">0%</span>}
              {isPositive ? "+" : ""}
              {change}%
            </div>
          )}
        </div>
        {changeText && (
          <p className="text-xs text-muted-foreground mt-1">{changeText}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
