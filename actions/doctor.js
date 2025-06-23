"use server"

import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { date } from "zod";

export async function setAvailabilitySlots(formData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });

    if (!doctor) {
      throw new Error("Doctor Not Found");
    }

    const startTimeIST = formData.get("startTime");
    const endTimeIST = formData.get("endTime");

    if (!startTimeIST || !endTimeIST) {
      throw new Error("Start Time and End Time are required");
    }

    // Parse the ISO strings as IST times
    const newStartIST = new Date(startTimeIST);
    const newEndIST = new Date(endTimeIST);

    // Validate that dates are valid
    if (isNaN(newStartIST.getTime()) || isNaN(newEndIST.getTime())) {
      throw new Error("Invalid date format");
    }

    if (newStartIST >= newEndIST) {
      throw new Error("Start Time must be before End Time");
    }

    // Check for overlapping or duplicate slots
    const existingSlots = await db.availability.findMany({
      where: {
        doctorId: doctor.id,
        OR: [
          // Existing slot starts during new slot
          {
            startTime: {
              gte: newStartIST,
              lt: newEndIST,
            },
          },
          // Existing slot ends during new slot
          {
            endTime: {
              gt: newStartIST,
              lte: newEndIST,
            },
          },
          // New slot completely contains existing slot
          {
            startTime: {
              lte: newStartIST,
            },
            endTime: {
              gte: newEndIST,
            },
          },
          // Exact duplicate check
          {
            startTime: newStartIST,
            endTime: newEndIST,
          },
        ],
      },
    });

    if (existingSlots.length > 0) {
      throw new Error("This time slot overlaps with existing availability");
    }

    // Get current IST time for cleanup
    const nowUTC = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const nowIST = new Date(nowUTC.getTime() + istOffset);

    // Delete only old AVAILABLE slots (those that have already passed in IST)
    const deleted = await db.availability.deleteMany({
      where: {
        doctorId: doctor.id,
        status: "AVAILABLE",
        endTime: {
          lt: nowIST, // Delete slots that have already ended in IST
        },
      },
    });

    // Create the new slot (storing IST times directly)
    const newSlot = await db.availability.create({
      data: {
        doctorId: doctor.id,
        startTime: newStartIST,
        endTime: newEndIST,
        status: "AVAILABLE",
      },
    });

    console.log("Stored IST times:", newStartIST, newEndIST);

    revalidatePath("/doctor");
    return { success: true, slot: newSlot };
  } catch (error) {
    console.error("Set Availability Error:", error);
    throw new Error("Failed to set Availability: " + error.message);
  }
}

// Helper function to convert UTC datetime to IST for display
export async function convertUTCToIST(utcDateString) {
  const utcDate = new Date(utcDateString);
  const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  const istDate = new Date(utcDate.getTime() + istOffset);
  return istDate;
}

// Helper function to convert IST datetime to UTC for storage
export async function convertISTToUTC(istDateString) {
  const istDate = new Date(istDateString);
  const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  const utcDate = new Date(istDate.getTime() - istOffset);
  return utcDate;
}

export async function getDoctorAvailability(){
   const { userId } = await auth();
   if (!userId) {
     throw new Error("Unauthorized");}
     try {
         const doctor = await db.user.findUnique({
           where: {
             clerkUserId: userId,
             role: "DOCTOR",
           },
         });
         if (!doctor) {
           throw new Error("Doctor Not Found");
         }
         const availabilitySlots=await db.availability.findMany({
            where:{
                doctorId:doctor.id
            },orderBy:{
                startTime:'asc'
            }
         })
       
         return {slots:availabilitySlots}
     } catch (error) {
        throw new Error("Failed to fetch slots"+error.message)
     } 
   
}

export async function getDoctorAppointments(){
  const {userId} =await auth()
  if(!userId){
    throw new Error("Unauthorized")
  }
   try {
    const doctor=await db.user.findUnique({
      where:{
        clerkUserId:userId,
        role:"DOCTOR"
      }
    })
    if(!doctor){
      throw new Error("Doctor not Found")

    }
    const appointments=await db.appointment.findMany({
      where:{
        doctorId:doctor.id,
        status:{
          in:["SCHEDULED"]
        }
      },
      include:{
        patient:true
      },
      orderBy:{
        startTime:"asc"
      }
    })
    return {appointments}
    
   } catch (error) {
    throw new Error("Failed to fetch Appointments" , error.message)
   }
}


export async function cancelAppointment(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const appointmentId = formData.get("appointmentId");

    if (!appointmentId) {
      throw new Error("Appointment ID is required");
    }

    // Find the appointment with both patient and doctor details
    const appointment = await db.appointment.findUnique({
      where: {
        id: appointmentId,
      },
      include: {
        patient: true,
        doctor: true,
      },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    // Verify the user is either the doctor or the patient for this appointment
    if (appointment.doctorId !== user.id && appointment.patientId !== user.id) {
      throw new Error("You are not authorized to cancel this appointment");
    }

    

    await db.appointment.update({
      where:{
        id:appointmentId
      },
      data:{
        status:"CANCELLED"
      }
    })

    // Determine which path to revalidate based on user role
    if (user.role === "DOCTOR") {
      revalidatePath("/doctor");
    } else if (user.role === "PATIENT") {
      revalidatePath("/appointments");
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to cancel appointment:", error);
    throw new Error("Failed to cancel appointment: " + error.message);
  }
}
export async function AddNotesAppointmens(formData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  try {
    const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });
    if (!doctor) {
      throw new Error("Doctor not Found");
    }
    const appointmentId = formData.get("appointmentId");
    if (!appointmentId) {
      throw new Error("AppointmentId is requires");
    }
    const notes=formData.get("notes");

    const appoinment = await db.appointment.findUnique({
      where: {
        id: appointmentId,
        doctorId: doctor.id,
      },
    });
    if(!appoinment){
      throw new Error("Appointment not Found")
    }
    const updateAppointment = await db.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        notes,
      },
    });
    revalidatePath('/doctor')
    return{success:true}
  } catch (error) {
    throw new Error("Failed to update Notes "+ error.message);
  }
}
export async function markAppointmentCompleted(formData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  try {
    const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });
    if (!doctor) {
      throw new Error("Doctor not Found");
    }
    const appointmentId = formData.get("appointmentId");
    if (!appointmentId) {
      throw new Error("AppointmentId is requires");
    }


    const appoinment = await db.appointment.findUnique({
      where: {
        id: appointmentId,
        doctorId: doctor.id,
      },
      include:{
        patient:true
      }
    });
    if (!appoinment) {
      throw new Error("Appointment not Found");
    }
    if(appoinment.status!=="SCHEDULED"){
      throw new Error("Only schedules appointments can be marked as completed")
    }
    const now=new Date();
    const appointmentEndTime=new date(appoinment.endTime);
    if(now<appointmentEndTime){
      throw new Error("Cannot mark appointment as completed before the schedules end time")
    }

    const updateAppointment = await db.appoinment.update({
      where: {
        id: appointmentId,
      },
      data: {
        status:"COMPLETED",
      },
    });
    revalidatePath("/doctor");
    return {success:true,appoinment:updateAppointment}
  } catch (error) {
    throw new Error("Failed to update Notes " + error.message);
  }
}