import { getDoctorAppointments, getDoctorAvailability } from "@/actions/doctor";
import { getCurrentUser } from "@/actions/onBoardng";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarRange, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import AppointmentsSetting from "./_components/AppointmentsSetting";
import AvailabilitySettings from "./_components/AvailabilitySettings";

const Page = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/"); // or some fallback
  }

  // Redirect if user is a doctor who hasn't completed onboarding
  if (user.role !== "DOCTOR") {
    redirect("/onboarding");
  }

  // Redirect if verification not complete
  if (user.verificationStatus !== "VERIFIED") {
    redirect("/doctor/verification");
  }

  const [appointmentsData,availabilityData] = await Promise.all([
    getDoctorAppointments(),
    getDoctorAvailability(),
  ]);

  return (
    <div>
      <Tabs
        defaultValue="appointments"
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6"
      >
        <div className="bg-muted p-2 shadow-sm  md:h-fit col-span-1">
          <TabsList className="gap-2 w-full  flex flex-row md:flex-col justify-items-start">
            <TabsTrigger
              value="appointments"
              className="flex rounded-0 items-center gap-2 justify-start w-full p-1"
            >
              <CalendarRange className="w-4 h-4" />
              <span>Appointments</span>
            </TabsTrigger>
            <TabsTrigger
              value="availability"
              className="flex items-center gap-2 justify-start w-full p-1"
            >
              <Clock className="w-4 h-4" />
              <span>Availability</span>
            </TabsTrigger>
          </TabsList>
        </div>
        <div className=" col-span-1 md:col-span-3">
          <TabsContent value="appointments">
            <AppointmentsSetting appointmentsData={appointmentsData.appointments||[]} />
          </TabsContent>
          <TabsContent value="availability">
            <AvailabilitySettings slots={availabilityData.slots || []} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Page;
