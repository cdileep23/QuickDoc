import { bookAppointment } from '@/actions/appointment'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/useFetch'
import { format } from 'date-fns'
import { ArrowLeft, Calendar, Clock, Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const AppointmentForm = ({doctorId, slot, onBack, onComplete}) => {
    const[description,setDescription]=useState("")
    const{loading,data,fn:submitBooking}=useFetch(bookAppointment)
     const handleSubmit = async (e) => {
       e.preventDefault();

       // Create form data
       const formData = new FormData();
       formData.append("doctorId", doctorId);
       formData.append("startTime", slot.startTime);
       formData.append("endTime", slot.endTime);
       formData.append("description", description);
       formData.append("availabilityId", slot.availabilityId);

       // Submit booking using the function from useFetch
       await submitBooking(formData);
     };

     // Handle response after booking attempt
     useEffect(() => {
       if (data) {
        console.log(data)
         if (data.success) {
           toast.success("Appointment booked successfully!");
           onComplete();
         }
       }
     }, [data]);
  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-blue-500 mr-2" />
          <span className="text-blue-900 font-medium">
            {format(new Date(slot.startTime), "EEEE, MMMM d, yyyy")}
          </span>
        </div>
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-blue-500 mr-2" />
          <span className="text-blue-800 font-medium">{slot.formatted}</span>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">
          Describe your medical concern (optional)
        </Label>
        <Textarea
          id="description"
          placeholder="Please provide any details about your medical concern or what you'd like to discuss in the appointment..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-background border-emerald-900/20 h-32"
        />
        <p className="text-sm text-muted-foreground">
          This information will be shared with the doctor before your
          appointment.
        </p>
      </div>

      <div className="flex justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="border-emerald-900/30"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Change Time Slot
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Booking...
            </>
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </div>
    </form>
  );
}

export default AppointmentForm