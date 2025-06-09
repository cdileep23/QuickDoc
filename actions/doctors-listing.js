"use server"
import { db } from "@/lib/prisma"

export async function getDoctorsBySpecialty(specialty){
if(!specialty){
    throw new Error("Invalid Input")
}
try {
    let modifiedSpecialty = specialty.replace(/[^a-zA-Z]/g, "");
    console.log(modifiedSpecialty);

   const doctors = await db.user.findMany({
     where: {
       role: "DOCTOR",
       verificationStatus: "VERIFIED",
       specialty: modifiedSpecialty,
     },
     orderBy: {
       name: "asc",
     },
   });

   return { doctors };
} catch (error) {
     console.error("Failed to fetch doctors by specialty:", error);
     return { error: "Failed to fetch doctors" };
}
}