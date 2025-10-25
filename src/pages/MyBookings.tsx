import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi } from '@/lib/mockApi';
import { Booking } from '@/types/booking';
import { Calendar, Clock, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { format } from 'date-fns';

const MyBookings = () => {
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: mockApi.getMyBookings,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => mockApi.cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Booking cancelled successfully');
    },
    onError: () => {
      toast.error('Failed to cancel booking');
    },
  });

  const upcomingBookings = bookings?.filter((b) => b.status === 'upcoming') || [];
  const pastBookings = bookings?.filter((b) => b.status === 'past' || b.status === 'cancelled') || [];

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const isPast = booking.status === 'past' || booking.status === 'cancelled';
    const isCancelled = booking.status === 'cancelled';

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`bg-card border border-border rounded-xl p-6 ${
          isPast ? 'opacity-60' : ''
        }`}
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-card-foreground">{booking.roomName}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                <MapPin size={14} />
                <span>Room {booking.roomNumber}</span>
              </div>
            </div>
            {isCancelled && (
              <span className="px-3 py-1 bg-destructive/10 text-destructive text-xs font-medium rounded-full">
                Cancelled
              </span>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-foreground">
              <Calendar size={16} />
              <span>{format(new Date(booking.date), 'PPP')}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-foreground">
              <Clock size={16} />
              <span>
                {booking.startTime} - {booking.endTime}
              </span>
            </div>
          </div>

          {!isPast && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => cancelMutation.mutate(booking.id)}
              disabled={cancelMutation.isPending}
              className="w-full"
            >
              <X size={16} className="mr-2" />
              {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Booking'}
            </Button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">My Bookings</h1>
          <p className="text-muted-foreground">View and manage your study room bookings</p>
        </motion.div>

        {isLoading && (
          <div className="py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {!isLoading && bookings && (
          <div className="space-y-8">
            {/* Upcoming Bookings */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Upcoming Bookings</h2>
              {upcomingBookings.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-12 text-center">
                  <p className="text-muted-foreground">No upcoming bookings</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              )}
            </div>

            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Past Bookings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pastBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
