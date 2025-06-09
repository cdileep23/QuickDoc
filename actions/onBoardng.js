
"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { VerificationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";


export async function setUserRole(formData){
    const{userId}=await auth()
    if(!userId){
        throw new error('unautgorized')

    }

    const user=await db.user.findUnique({
        where:{
            clerkUserId:userId
        }
    })

    if(!user){
        throw new Error("User not Found in database")
    }

    const role=formData.get('role')
    if(!role||!["PATIENT", "DOCTOR"].includes(role)){
        throw new Error("Invalid role Selection")
    }

    try {
        if(role==="PATIENT"){
            await db.user.update({
                where:{
                    clerkUserId:userId
                },
                data:{
                    role
                }
            })
            revalidatePath('/')
            return {success:true, redirect:"/doctors"}
        }

        if(role==="DOCTOR"){
   let specialty = formData.get("specialty");
    specialty = specialty.replace(/[^a-zA-Z]/g, "");
   console.log(specialty);

    const experience=parseInt(formData.get("experience"),10);
    const credentialUrl = formData.get("credentialUrl");
    const description=formData.get("description")
    if(! specialty ||!experience ||!credentialUrl ||!description){
        throw new Error("All Fields are required")

    }
    await db.user.update({
      where: {
        clerkUserId: userId,
      },
      data: {
        role: "DOCTOR",
        experience,
        credentialUrl,
        specialty,
        description,
        verificationStatus: "PENDING",
      },
    });

    
      revalidatePath("/");
      return { success: true, redirect: "/doctor/verification" };
        }
    } catch (error) {
       console.error(
         "Failed to check subscription and allocate credits:",
         error.message
       );
       return null;
    }
}

export async function getCurrentUser(){
    const{userId}=await auth()
    if(!userId){
        throw new error('unautgorized')

    }

    try {
     const user = await db.user.findUnique({
       where: {
         clerkUserId: userId,
       },
     });
return user;
    } catch (error) {
        console.error(
          "Failed to check subscription and allocate credits:",
          error.message
        );
        return null;
    }
}