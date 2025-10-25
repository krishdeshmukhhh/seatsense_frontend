import { RoomStatus } from '@/types/booking';
import { motion } from 'framer-motion';

interface StatusIndicatorProps {
  status: RoomStatus;
}

const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  const statusConfig = {
    empty: {
      color: 'hsl(var(--status-available))',
      label: 'Available',
      bgColor: 'bg-[hsl(var(--status-available))]',
    },
    occupied: {
      color: 'hsl(var(--status-occupied))',
      label: 'Occupied',
      bgColor: 'bg-[hsl(var(--status-occupied))]',
    },
    bags: {
      color: 'hsl(var(--status-bags))',
      label: 'Bags Only',
      bgColor: 'bg-[hsl(var(--status-bags))]',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center space-x-2">
      <motion.div
        className={`w-3 h-3 rounded-full ${config.bgColor}`}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="text-sm font-medium text-foreground">{config.label}</span>
    </div>
  );
};

export default StatusIndicator;
