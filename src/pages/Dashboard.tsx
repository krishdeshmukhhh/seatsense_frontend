import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/lib/mockApi';
import { Room } from '@/types/booking';
import RoomCard from '@/components/dashboard/RoomCard';
import BookingModal from '@/components/booking/BookingModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: mockApi.getRooms,
    refetchInterval: 10000, // Auto-refresh every 10 seconds
  });

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Study Room Dashboard
          </h1>
          <p className="text-muted-foreground">
            Find and book available study rooms across campus
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Room Grid */}
        {!isLoading && rooms && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {rooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <RoomCard room={room} onBook={handleBookRoom} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && rooms && rooms.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No rooms available</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          isOpen={!!selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
