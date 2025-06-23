'use client'
import { updateDoctorStatus } from '@/actions/admin'
import useFetch from '@/hooks/useFetch'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { ExternalLink, FileText, Medal, User } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { format } from 'date-fns'
import { Separator } from '../ui/separator'
import { toast } from 'sonner'

const PendingDoctors = ({ doctors }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const {
    loading,
    data,
    fn: submitStatusUpdate,
  } = useFetch(updateDoctorStatus);
const HandleViewDetails = (doctor) => {
  setSelectedDoctor(doctor);
};
const HandleCloseDialog=()=>{
  setSelectedDoctor(null)
}
useEffect(()=>{
if(data &&data?.success){
  toast.success("Verified Successfully")
  HandleCloseDialog()
}
},[data])

  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Doctor Verification</CardTitle>
        <CardDescription>Review and Approve doctor Application</CardDescription>
      </CardHeader>
      <CardContent>
        {doctors.length === 0 ? (
          <div className="w-full">
            {" "}
            No Pending Verification requests at this time
          </div>
        ) : (
          <div className="space-y-4">
            {doctors.map((doctor) => (
              <div key={doctor.id}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="shrink-0">
                        <User className="w-8 h-8 text-gray-600" />
                      </div>
                      <div className="flex flex-col sm:flex-1">
                        <h3 className="text-base font-semibold text-gray-900">
                          {doctor.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {doctor.specialty} · {doctor.experience} Years of
                          Experience
                        </p>
                      </div>
                      <div className="flex gap-2 sm:ml-auto sm:flex-row flex-col">
                        <Badge className="text-amber-500 bg-amber-100 w-fit self-start sm:self-center">
                          Pending
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={() => HandleViewDetails(doctor)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {selectedDoctor && (
                  <Dialog
                    open={!!selectedDoctor}
                    onOpenChange={HandleCloseDialog}
                  >
                    <DialogContent className="max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto p-0">
                      <div className="p-4 sm:p-6">
                        <DialogHeader className="space-y-2 sm:space-y-3">
                          <DialogTitle className="text-lg sm:text-xl font-bold">
                            Doctor Verification Details
                          </DialogTitle>
                          <DialogDescription className="text-sm sm:text-base">
                            Review the doctor's information carefully before
                            making a decision.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 sm:space-y-6 py-4">
                          {/* Basic Info */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            <div className="space-y-1">
                              <h4 className="text-xs sm:text-sm font-medium text-muted-foreground">
                                Full Name
                              </h4>
                              <p className="text-sm sm:text-base font-semibold break-words">
                                {selectedDoctor.name}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-xs sm:text-sm font-medium text-muted-foreground">
                                Email
                              </h4>
                              <p className="text-sm sm:text-base font-semibold break-all">
                                {selectedDoctor.email}
                              </p>
                            </div>
                            <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                              <h4 className="text-xs sm:text-sm font-medium text-muted-foreground">
                                Application Date
                              </h4>
                              <p className="text-sm sm:text-base font-semibold">
                                {format(
                                  new Date(selectedDoctor.createdAt),
                                  "PPP"
                                )}
                              </p>
                            </div>
                          </div>

                          <Separator />

                          {/* Professional Details */}
                          <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center gap-2">
                              <Medal className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0" />
                              <h3 className="text-sm sm:text-base font-semibold">
                                Professional Information
                              </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                              <div className="space-y-1">
                                <h4 className="text-xs sm:text-sm font-medium text-muted-foreground">
                                  Specialty
                                </h4>
                                <p className="text-sm sm:text-base break-words">
                                  {selectedDoctor.specialty}
                                </p>
                              </div>

                              <div className="space-y-1">
                                <h4 className="text-xs sm:text-sm font-medium text-muted-foreground">
                                  Experience
                                </h4>
                                <p className="text-sm sm:text-base">
                                  {selectedDoctor.experience} years
                                </p>
                              </div>

                              <div className="space-y-1 sm:col-span-2">
                                <h4 className="text-xs sm:text-sm font-medium text-muted-foreground">
                                  Credentials
                                </h4>
                                <a
                                  href={selectedDoctor.credentialUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-600 hover:underline inline-flex items-center gap-1 text-sm sm:text-base break-all"
                                >
                                  View Credentials{" "}
                                  <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                </a>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Description */}
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0" />
                              <h3 className="text-sm sm:text-base font-semibold">
                                Service Description
                              </h3>
                            </div>
                            <div className="max-h-32 sm:max-h-40 overflow-y-auto">
                              <p className="whitespace-pre-line text-muted-foreground text-sm sm:text-base leading-relaxed">
                                {selectedDoctor.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t">
                          <Button
                            variant="destructive"
                            onClick={() =>
                              submitStatusUpdate({
                                doctorId: selectedDoctor.id,
                                status: "REJECTED",
                              })
                            }
                            disabled={loading}
                            className="w-full sm:w-auto px-6 py-2 text-sm sm:text-base"
                          >
                            Reject
                          </Button>
                          <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto px-6 py-2 text-sm sm:text-base"
                            onClick={() =>
                              submitStatusUpdate({
                                doctorId: selectedDoctor.id,
                                status: "VERIFIED",
                              })
                            }
                            disabled={loading}
                          >
                            Approve
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingDoctors