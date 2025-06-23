import { getCurrentUser } from "@/actions/onBoardng";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = {
  title: "Doctors - QuickDoc",
  description: "View the doctors on specialty",
};

const DoctorsLayout = async ({ children }) => {
  const user = await getCurrentUser();

  if (user) {
    if (user.role === "PATIENT") {
     
    } else if (user.role === "DOCTOR") {
      if (user.verificationStatus === "VERIFIED") {
        redirect("/doctor");
      } else {
        redirect("/doctor/verification");
      }
    } else if (user.role === "ADMIN") {
      redirect("/admin");
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">{children}</div>
    </div>
  );
};

export default DoctorsLayout;
