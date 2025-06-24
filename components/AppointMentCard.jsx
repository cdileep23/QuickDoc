"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  User,
  Video,
  Stethoscope,
  X,
  Edit,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  cancelAppointments,
  AddNotesAppointmens,
  markAppointmentCompleted,
  cancelAppointment,
} from "@/actions/doctor";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { generateVideoToken } from "@/actions/appointment";

export default function AppointmentCard({
  appointment,
  userRole,
  refetchAppointments,
}) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [notes, setNotes] = useState(appointment.notes || "");
  const router = useRouter();

  const {
    loading: cancelLoading,
    fn: submitCancel,
    data: cancelData,
  } = useFetch(cancelAppointment);
  const {
    loading: notesLoading,
    fn: submitNotes,
    data: notesData,
  } = useFetch(AddNotesAppointmens);
  const {
    loading: tokenLoading,
    fn: submitTokenRequest,
    data: tokenData,
  } = useFetch(generateVideoToken);
  const {
    loading: completeLoading,
    fn: submitMarkCompleted,
    data: completeData,
  } = useFetch(markAppointmentCompleted);

  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
    } catch {
      return "Invalid date";
    }
  };

  const formatTime = (dateString) => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch {
      return "Invalid time";
    }
  };

  const canMarkCompleted = () => {
    if (userRole !== "DOCTOR" || appointment.status !== "SCHEDULED")
      return false;
    return new Date() >= new Date(appointment.endTime);
  };

  const handleCancelAppointment = async () => {
    if (cancelLoading) return;
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      const formData = new FormData();
      formData.append("appointmentId", appointment.id);
      await submitCancel(formData);
    }
  };

  const handleMarkCompleted = async () => {
    if (completeLoading) return;
    if (new Date() < new Date(appointment.endTime)) {
      alert("Cannot mark appointment as completed before the end time.");
      return;
    }
    if (window.confirm("Mark appointment as completed?")) {
      const formData = new FormData();
      formData.append("appointmentId", appointment.id);
      await submitMarkCompleted(formData);
    }
  };

  const handleSaveNotes = async () => {
    if (notesLoading || userRole !== "DOCTOR") return;
    const formData = new FormData();
    formData.append("appointmentId", appointment.id);
    formData.append("notes", notes);
    await submitNotes(formData);
  };

  const handleJoinVideoCall = async () => {
    if (tokenLoading) return;
    setAction("video");
    const formData = new FormData();
    formData.append("appointmentId", appointment.id);
    await submitTokenRequest(formData);
  };

  useEffect(() => {

    if (cancelData?.success || completeData?.success || notesData?.success) {
      toast.success("Action completed successfully");
      setOpen(false);
      setAction(null);
      refetchAppointments?.();
      router.refresh();
    }
  }, [cancelData, completeData, notesData, refetchAppointments, router]);

  useEffect(() => {
    if (tokenData?.success) {
      console.log("token to joinvideo call")
      console.log(tokenData)
      router.push(
        `/video-call?sessionId=${tokenData.videoSessionId}&token=${tokenData.token}&appointmentId=${appointment.id}`
      );
    } else if (tokenData?.error) {
      setAction(null);
    }
  }, [tokenData, appointment.id, router]);

  const isAppointmentActive = () => {
    const now = new Date();
    const start = new Date(appointment.startTime);
    const end = new Date(appointment.endTime);
    return (
      (start.getTime() - now.getTime() <= 30 * 60 * 1000 && now < start) ||
      (now >= start && now <= end)
    );
  };

  const otherParty =
    userRole === "DOCTOR" ? appointment.patient : appointment.doctor;
  const otherPartyLabel = userRole === "DOCTOR" ? "Patient" : "Doctor";
  const otherPartyIcon =
    userRole === "DOCTOR" ? (
      <User className="text-blue-500" />
    ) : (
      <Stethoscope className="text-blue-500" />
    );

  return (
    <>
      <Card className="border-blue-500/30 bg-white hover:border-blue-500/50 transition-all">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-2 mt-1">
                {otherPartyIcon}
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">
                  {userRole === "DOCTOR"
                    ? otherParty.name
                    : `Dr. ${otherParty.name}`}
                </h3>
                <p className="text-sm text-blue-700">
                  {userRole === "DOCTOR"
                    ? otherParty.email
                    : otherParty.specialty}
                </p>
                <div className="flex items-center mt-2 text-sm text-blue-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDateTime(appointment.startTime)}</span>
                </div>
                <div className="flex items-center mt-1 text-sm text-blue-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    {formatTime(appointment.startTime)} -{" "}
                    {formatTime(appointment.endTime)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 self-end md:self-start">
              <Badge
                variant="outline"
                className={
                  appointment.status === "COMPLETED"
                    ? "bg-blue-100 border-blue-300 text-blue-600"
                    : appointment.status === "CANCELLED"
                    ? "bg-red-100 border-red-300 text-red-600"
                    : "bg-yellow-100 border-yellow-300 text-yellow-600"
                }
              >
                {appointment.status}
              </Badge>
              <div className="flex gap-2 mt-2 flex-wrap">
                {canMarkCompleted() && (
                  <Button
                    size="sm"
                    onClick={handleMarkCompleted}
                    disabled={completeLoading}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {completeLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
                      </>
                    )}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-300 text-blue-700"
                  onClick={() => setOpen(true)}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl bg-white text-gray-900 shadow-xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Appointment Details
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              {appointment.status === "SCHEDULED"
                ? "Manage your upcoming appointment"
                : "View appointment information"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Other Party Info */}
            <section>
              <h4 className="text-sm text-gray-600 font-medium">
                {otherPartyLabel}
              </h4>
              <div className="flex items-center mt-1">
                <div className="h-5 w-5 text-emerald-600 mr-2">
                  {otherPartyIcon}
                </div>
                <div>
                  <p className="font-semibold">
                    {userRole === "DOCTOR"
                      ? otherParty.name
                      : `Dr. ${otherParty.name}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {userRole === "DOCTOR"
                      ? otherParty.email
                      : otherParty.specialty}
                  </p>
                </div>
              </div>
            </section>

            {/* Time Info */}
            <section>
              <h4 className="text-sm text-gray-600 font-medium">
                Scheduled Time
              </h4>
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-5 w-5 text-emerald-600 mr-2" />
                  {formatDateTime(appointment.startTime)}
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="h-5 w-5 text-emerald-600 mr-2" />
                  {formatTime(appointment.startTime)} -{" "}
                  {formatTime(appointment.endTime)}
                </div>
              </div>
            </section>

            {/* Status */}
            <section>
              <h4 className="text-sm text-gray-600 font-medium">Status</h4>
              <Badge
                variant="outline"
                className={
                  appointment.status === "COMPLETED"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                    : appointment.status === "CANCELLED"
                    ? "bg-red-100 text-red-600 border-red-300"
                    : "bg-yellow-100 text-yellow-600 border-yellow-300"
                }
              >
                {appointment.status}
              </Badge>
            </section>

            {/* Patient Description */}
            {appointment.patientDescription && (
              <section>
                <h4 className="text-sm text-gray-600 font-medium">
                  {userRole === "DOCTOR"
                    ? "Patient Description"
                    : "Your Description"}
                </h4>
                <div className="p-3 rounded-lg bg-gray-100 border border-gray-200 text-gray-700">
                  <p className="whitespace-pre-line">
                    {appointment.patientDescription}
                  </p>
                </div>
              </section>
            )}

            {/* Video Call */}
            {appointment.status === "SCHEDULED" && (
              <section>
                <h4 className="text-sm text-gray-600 font-medium">
                  Video Consultation
                </h4>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={
                    !isAppointmentActive() || action === "video" || tokenLoading
                  }
                  onClick={handleJoinVideoCall}
                >
                  {tokenLoading || action === "video" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Preparing Video Call...
                    </>
                  ) : (
                    <>
                      <Video className="h-4 w-4 mr-2" />
                      {isAppointmentActive()
                        ? "Join Video Call"
                        : "Video call available 30 mins before appointment"}
                    </>
                  )}
                </Button>
              </section>
            )}

            {/* Doctor Notes */}
            <section>
              <div className="flex justify-between items-center">
                <h4 className="text-sm text-gray-600 font-medium">
                  Doctor Notes
                </h4>
                {userRole === "DOCTOR" &&
                  action !== "notes" &&
                  appointment.status !== "CANCELLED" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAction("notes")}
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      {appointment.notes ? "Edit" : "Add"}
                    </Button>
                  )}
              </div>

              {userRole === "DOCTOR" && action === "notes" ? (
                <div className="space-y-3">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter your clinical notes here..."
                    className="border border-emerald-300 min-h-[100px]"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAction(null);
                        setNotes(appointment.notes || "");
                      }}
                      disabled={notesLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveNotes}
                      disabled={notesLoading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {notesLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Notes"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-gray-100 text-gray-700 min-h-[80px]">
                  {appointment.notes ? (
                    <p className="whitespace-pre-line">{appointment.notes}</p>
                  ) : (
                    <p className="italic text-gray-400">No notes added yet</p>
                  )}
                </div>
              )}
            </section>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row justify-between">
            <div className="flex gap-2">
              {canMarkCompleted() && (
                <Button
                  onClick={handleMarkCompleted}
                  disabled={completeLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {completeLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Completing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark Complete
                    </>
                  )}
                </Button>
              )}

              {appointment.status === "SCHEDULED" && (
                <Button
                  variant="outline"
                  onClick={handleCancelAppointment}
                  disabled={cancelLoading}
                  className="border-red-500 text-red-600 hover:bg-red-100"
                >
                  {cancelLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      Cancel Appointment
                    </>
                  )}
                </Button>
              )}
            </div>

            <Button
              onClick={() => setOpen(false)}
              className="bg-gray-800 hover:bg-gray-900 text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
