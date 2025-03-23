
import React from 'react';
import MyDownloads from '../resources/MyDownloads';

interface AdvancedStatsProps {
  className?: string;
}

const AdvancedStats: React.FC<AdvancedStatsProps> = ({ className }) => {
  return (
    <div className={className}>
      <MyDownloads />
    </div>
  );
};

export default AdvancedStats;
