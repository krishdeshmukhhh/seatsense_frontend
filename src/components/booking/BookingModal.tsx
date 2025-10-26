import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Room, TimeSlot } from '@/types/booking';
import { X, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi } from '@/lib/mockApi';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface BookingModalProps {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ room, isOpen, onClose }: BookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const queryClient = useQueryClient();

  const dateString = format(selectedDate, 'yyyy-MM-dd');

  // Debug: confirm mount & isOpen
  if (process.env.NODE_ENV !== 'production') {
    console.log('BookingModal render - isOpen:', isOpen, 'room:', room?.id);
  }

  const { data: slots, isLoading } = useQuery({
    queryKey: ['slots', room.id, dateString],
    queryFn: () => mockApi.getAvailableSlots(room.id, dateString),
    enabled: isOpen,
  });

  const bookingMutation = useMutation({
    mutationFn: (data: { roomId: string; date: string; startTime: string; endTime: string }) =>
      mockApi.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Booking confirmed!', {
        description: `${room.name} on ${format(selectedDate, 'PPP')} at ${selectedSlot?.startTime}`,
      });
      onClose();
    },
    onError: () => {
      toast.error('Booking failed', {
        description: 'Please try again later.',
      });
    },
  });

  const handleConfirm = () => {
    if (!selectedSlot) return;

    bookingMutation.mutate({
      roomId: room.id,
      date: dateString,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
    });
  };

  // Render modal into document.body so it's not affected by parent transforms
  if (typeof document === 'undefined') return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Debug badge so we can visually confirm the portal is rendered */}
          {/* {process.env.NODE_ENV !== 'production' && (
            <div className="fixed top-4 right-4 z-[9999] bg-red-600 text-white px-3 py-1 rounded-md shadow-md">
              BookingModal mounted
            </div>
          )} */}
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[99998]"
          />

          {/* Centering wrapper ensures the modal always appears in the middle */}
          <div className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none">
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-auto w-full max-w-lg bg-background rounded-2xl shadow-xl z-[100000] max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Book {room.name}</h2>
                  <p className="text-sm text-muted-foreground">Room {room.roomNumber}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Date Picker */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-foreground mb-3">
                    <CalendarIcon size={16} />
                    <span>Select Date</span>
                  </label>
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      className="rounded-xl border border-border pointer-events-auto"
                    />
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-foreground mb-3">
                    <Clock size={16} />
                    <span>Select Time Slot (1 hour)</span>
                  </label>
                  {isLoading ? (
                    <div className="py-8">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                      {slots?.map((slot) => (
                        <button
                          key={slot.startTime}
                          onClick={() => slot.available && setSelectedSlot(slot)}
                          disabled={!slot.available}
                          className={cn(
                            'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                            slot.available
                              ? selectedSlot?.startTime === slot.startTime
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground hover:bg-primary/10'
                              : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                          )}
                        >
                          {slot.startTime}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4 flex items-center justify-end space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleConfirm} disabled={!selectedSlot || bookingMutation.isPending}>
                  {bookingMutation.isPending ? 'Booking...' : 'Confirm Booking'}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>{createPortal(modalContent, document.body)}</>
  );
};

export default BookingModal;
