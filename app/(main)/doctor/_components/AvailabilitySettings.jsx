"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Plus, Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { setAvailabilitySlots } from "@/actions/doctor";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";

const AvailabilitySettings = ({ slots }) => {
  const [showForm, setShowForm] = useState(false);
  const { loading, data, fn: SubmitSlots } = useFetch(setAvailabilitySlots);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    defaultValues: {
      startTime: "",
      endTime: "",
    },
  });

  useEffect(() => {
    if (data && data.success) {
      console.log(data);
      toast.success("Slot Created Successfully");
      setShowForm(false);
    }
  }, [data]);

  // Simple format function for IST display
  const formatISTTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "HH:mm"); // 24-hour format
    } catch (e) {
      return "Invalid time";
    }
  };

  const formatISTDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd MMM yyyy, HH:mm");
    } catch (e) {
      return "Invalid date";
    }
  };

  const onSubmit = async (formData) => {
    if (loading) return;

    try {
      // Create FormData for backend
      const data = new FormData();

      // Get the datetime-local values (these are in local timezone)
      const startTime = formData.startTime;
      const endTime = formData.endTime;

      console.log("Form input:", startTime, endTime);

      // Send as-is to backend (backend will handle IST conversion)
      data.append("startTime", startTime);
      data.append("endTime", endTime);

      const result = await SubmitSlots(data);

      if (result?.success) {
        toast.success("Availability slots set successfully");
        reset();
        setShowForm(false);
      }
    } catch (error) {
      console.log(error);
      if (error.message.includes("Start Time must be before End Time")) {
        setError("endTime", {
          type: "manual",
          message: "End time must be after start time",
        });
      } else {
        toast.error(error.message || "Failed to set availability slots");
      }
    }
  };

  const hasSlots = slots && slots.length > 0;

  return (
    <div className="w-full">
      <Card className="border-blue-400/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-400" />
            Availability Settings (IST)
          </CardTitle>
          <CardDescription>
            Set your availability for patient appointments. All times in IST
            (24-hour format).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showForm ? (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">
                  Current Availability (IST)
                </h3>

                {!hasSlots ? (
                  <p className="text-muted-foreground">
                    No availability slots set. Add your availability to start
                    accepting appointments.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {slots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center p-3 rounded-md bg-muted/20 border border-blue-400/20"
                      >
                        <div className="bg-blue-400/20 p-2 rounded-full mr-3">
                          <Clock className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {formatISTTime(slot.startTime)} -{" "}
                            {formatISTTime(slot.endTime)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {slot.appointment ? "Booked" : "Available"} •{" "}
                            {formatISTDateTime(slot.startTime)} IST
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={() => setShowForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                {hasSlots ? "Add More Availability" : "Set Availability"}
              </Button>
            </>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 border border-blue-400/20 rounded-md p-4"
            >
              <h3 className="text-lg font-medium mb-2">
                Set Availability (IST)
              </h3>

              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  Enter your available times in IST. Use 24-hour format (HH:MM).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time (IST)</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    {...register("startTime", {
                      required: "Start time is required",
                      validate: (value) => {
                        const inputDate = new Date(value);
                        const now = new Date();

                        if (inputDate < now) {
                          return "Start time cannot be in the past";
                        }
                        return true;
                      },
                    })}
                    className="bg-background border-blue-400/20"
                  />
                  {errors.startTime && (
                    <p className="text-sm font-medium text-red-500">
                      {errors.startTime.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time (IST)</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    {...register("endTime", {
                      required: "End time is required",
                      validate: (value, formValues) => {
                        if (new Date(value) <= new Date(formValues.startTime)) {
                          return "End time must be after start time";
                        }
                        return true;
                      },
                    })}
                    className="bg-background border-blue-400/20"
                  />
                  {errors.endTime && (
                    <p className="text-sm font-medium text-red-500">
                      {errors.endTime.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset();
                    setShowForm(false);
                  }}
                  disabled={loading}
                  className="border-blue-400/30"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Availability"
                  )}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 p-4 bg-muted/10 border border-blue-400/10 rounded-md">
            <h4 className="font-medium mb-2 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-blue-400" />
              Time Zone Info
            </h4>
            <p className="text-muted-foreground text-sm">
              All times are stored and displayed in Indian Standard Time (IST)
              using 24-hour format.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilitySettings;
