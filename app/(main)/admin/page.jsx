import { getPendingDoctors, getVerifiedDoctors } from "@/actions/admin";
import PendingDoctors from "@/components/admin/PendingDoctors";
import VerifiedDoctors from "@/components/admin/VerifiedDoctors";
import { TabsContent } from "@/components/ui/tabs";
import React from "react";

const page = async() => {
 const[pendingDoctorsData,verifiedDoctorsData]= await Promise.all([
    getPendingDoctors(),
    getVerifiedDoctors()
  ])
  
  return (
    <>
      <TabsContent value="pendingverification" className="border-none p-0">
        <PendingDoctors doctors={pendingDoctorsData.doctors || []} />
      </TabsContent>
      <TabsContent value="doctors">
        <VerifiedDoctors doctors={verifiedDoctorsData.doctors || []} />
      </TabsContent>
    </>
  );
};

export default page;
