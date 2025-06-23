import { getDoctorAppointments } from '@/actions/doctor';
import AppointMentCard from '@/components/AppointMentCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useFetch from '@/hooks/useFetch';
import { Calendar } from 'lucide-react';
import React from 'react'

const AppointmentsSetting = ({ appointmentsData }) => {
  console.log(appointmentsData);

   
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-400" />
            Upcoming Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointmentsData.length > 0 ? (
            <div>
              {appointmentsData.map((appointment) => (
                <AppointMentCard
                  key={appointment.id}
                  appointment={appointment}
                  userRole="DOCTOR"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-xl font-medium text-white mb-2">
                No upcoming appointments
              </h3>
              <p className="text-muted-foreground">
                You don&apos;t have any scheduled appointments yet. Make sure
                you&apos;ve set your availability to allow patients to book.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsSetting