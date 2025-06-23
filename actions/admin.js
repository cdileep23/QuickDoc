"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

export async function verifyAdmin(){
    const {userId}=await auth();
    if(!userId){
        return false
    }
    try {
        const user=await db.user.findUnique({
            where:{
                clerkUserId:userId
            }
        })
        return user?.role==="ADMIN"
    } catch (error) {
        console.log("Failed to verify Error",error)
        return false
    }
}
export async function getPendingDoctors(){
    const isAdmin=await verifyAdmin()
    if(!isAdmin){
        throw new Error("Unauthorized")

    }
    try {
        const pendingDoctors = await db.user.findMany({
          where: {
            verificationStatus: "PENDING",
            role: "DOCTOR",
          },
          orderBy:{
            createdAt:"desc"
          }
        });  
    return {doctors:pendingDoctors}
    
    } catch (error) {
      console.log(error)
        throw  new Error("Failed to fetch pending doctors")
        
    }
}

export async function getVerifiedDoctors(){
      const isAdmin = await verifyAdmin();
      if (!isAdmin) {
        throw new Error("Unauthorized");
      }
      try {
        const verifiedDoctors = await db.user.findMany({
          where: {
            verificationStatus: "VERIFIED",
            role: "DOCTOR",
          },
          orderBy: {
            createdAt: "asc",
          },
        });
        return { doctors: verifiedDoctors };
      } catch (error) {
console.log(error)
        throw new Error("Failed to fetch Verified doctors");
      }
}

export async function updateDoctorStatus({ doctorId, status }) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    throw new Error("Unauthorized");
  }
console.log(doctorId)
  console.log(status)
 
  if (!doctorId || !["VERIFIED", "REJECTED"].includes(status)) {
    throw new Error("Invalid Input");
  }
  try {
    await db.user.update({
      where: {
        id: doctorId,
      },
      data: {
        verificationStatus: status,
      },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.log("failed to updaye the doctor status", error);
    throw new Error(`failed to updaye the doctor status ${error}`);
  }
}

export async function updateDoctorActiveStatus({doctorId,suspend}){
  console.log(doctorId,suspend)
     const isAdmin = await verifyAdmin();
     if (!isAdmin) {
       throw new Error("Unauthorized");
     }
   
      if(!doctorId){
          throw new Error("Invalid Input")
      }

      try {
        const status=suspend?"PENDING":"VERIFIED"

        await db.user.update({
          where: {
            id: doctorId,
          },
          data: {
            verificationStatus: status,
          },
        });
        revalidatePath("/admin");
        return { success: true };
      } catch (error) {
        console.log("failed to updaye the doctor status", error);
        throw new Error(`failed to updaye the doctor status ${error}`);
      }
}