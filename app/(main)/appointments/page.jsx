import { getCurrentUser } from "@/actions/onBoardng";
import { getPatientAppointments } from "@/actions/patient";
import AppointmentCard from "@/components/AppointMentCard";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const user = await getCurrentUser();

  if (!user || user.role !== "PATIENT") {
    redirect("/onboarding");
  }

  const { appointments, error } = await getPatientAppointments();

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Calendar className="text-emerald-400" />}
        title="My Appointments"
        backLabel="Find doctors"
        backLink="/doctors"
      />

      <Card className="border border-emerald-900/20 bg-muted/10">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-emerald-400" />
            Your Scheduled Appointments
          </CardTitle>
        </CardHeader>

        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-400">Error: {error}</p>
            </div>
          ) : appointments?.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  userRole="PATIENT"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Appointments Yet
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                You haven&apos;t booked any appointments yet. Browse our
                verified doctors and schedule your first consultation now.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
