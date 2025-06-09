import { verifyAdmin } from "@/actions/admin";
import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ShieldCheck, Stethoscope } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = {
  title: "Admin Settings - Quickdoc",
  description: "Manage doctors, patients and platform settings",
};

const AdminLayout = async ({ children }) => {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    redirect("/onboarding");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <PageHeader title="Admin DashBoard" icon={<ShieldCheck />} />

    
      <Tabs
        defaultValue="pendingverification"
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6"
      >
     
        <div className="bg-muted  shadow-sm md:py-3 md:h-fit col-span-1">
          <TabsList className="flex flex-row md:flex-col gap-2 w-full  justify-items-start">
            <TabsTrigger
              value="pendingverification"
              className="flex rounded-0 items-center gap-2 justify-start w-full p-1"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Pending Verification</span>
            </TabsTrigger>
            <TabsTrigger
              value="doctors"
              className="flex items-center gap-2 justify-start w-full p-1"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Verified Doctors</span>
            </TabsTrigger>
          </TabsList>
        </div>

      
        <div className="md:col-span-3">{children}</div>
      </Tabs>
    </div>
  );
};

export default AdminLayout;
