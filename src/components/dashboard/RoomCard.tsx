import { Room } from '@/types/booking';
import { Users, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import StatusIndicator from './StatusIndicator';

interface RoomCardProps {
  room: Room;
  onBook: (room: Room) => void;
}

const RoomCard = ({ room, onBook }: RoomCardProps) => {
  const lastUpdated = new Date(room.lastUpdated);
  const timeAgo = Math.floor((Date.now() - lastUpdated.getTime()) / 1000 / 60);
  const timeDisplay = timeAgo < 1 ? 'Just now' : `${timeAgo}m ago`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-card-foreground">{room.name}</h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin size={16} />
            <span>Room {room.roomNumber}</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex items-center justify-between py-3 border-y border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Users size={16} />
            <span>Capacity: {room.capacity}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Clock size={14} />
            <span>{timeDisplay}</span>
          </div>
        </div>

        {/* Status */}
        <StatusIndicator status={room.status} />

        {/* Action Button */}
        <Button
          onClick={() => onBook(room)}
          disabled={room.status !== 'empty'}
          className="w-full"
          variant={room.status === 'empty' ? 'default' : 'secondary'}
        >
          {room.status === 'empty' ? 'Book Room' : 'Not Available'}
        </Button>
      </div>
    </motion.div>
  );
};

export default RoomCard;
