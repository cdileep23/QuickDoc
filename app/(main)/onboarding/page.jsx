"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, StethoscopeIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { setUserRole } from "@/actions/onBoardng";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HeartPulse,
  Stethoscope,
  Bone,
  Eye,
  Baby,
  Brain,
  Flower2,
  Target,
  Milestone,
  Microscope,
  Timer,
  Thermometer,
  Activity,
  CircleDot,
} from "lucide-react";
import {z} from 'zod'
const SPECIALTIES = [
  {
    name: "General Medicine",
    icon: <Stethoscope className="h-5 w-5" />,
  },
  {
    name: "Cardiology",
    icon: <HeartPulse className="h-5 w-5" />,
  },
  {
    name: "Dermatology",
    icon: <CircleDot className="h-5 w-5" />,
  },
  {
    name: "Endocrinology",
    icon: <Timer className="h-5 w-5" />,
  },
  {
    name: "Gastroenterology",
    icon: <Thermometer className="h-5 w-5" />,
  },
  {
    name: "Neurology",
    icon: <Brain className="h-5 w-5" />,
  },
  {
    name: "Obstetrics & Gynecology",
    icon: <Flower2 className="h-5 w-5" />,
  },
  {
    name: "Oncology",
    icon: <Target className="h-5 w-5" />,
  },
  {
    name: "Ophthalmology",
    icon: <Eye className="h-5 w-5" />,
  },
  {
    name: "Orthopedics",
    icon: <Bone className="h-5 w-5" />,
  },
  {
    name: "Pediatrics",
    icon: <Baby className="h-5 w-5" />,
  },
  {
    name: "Psychiatry",
    icon: <Brain className="h-5 w-5" />,
  },
  {
    name: "Pulmonology",
    icon: <Activity className="h-5 w-5" />,
  },
  {
    name: "Radiology",
    icon: <CircleDot className="h-5 w-5" />,
  },
  {
    name: "Urology",
    icon: <Milestone className="h-5 w-5" />,
  },
  {
    name: "Other",
    icon: <Microscope className="h-5 w-5" />,
  },
];

const doctorFormSchema = z.object({
  specialty: z.string().min(1, "Speciality is required"),
  experience: z
    .string()
    .min(1, "Experience Must be At least 1 Year")
    .max(40, "Experience must be less than 40 years"),
  credentialUrl: z
    .string()
    .url("Please Enter Valid URL")
    .min(1, "Credential Url is required"),
  description: z
    .string()
    .min(20, "Describe about your experience & speciality in at least 20 words")
    .max(100, "Maximum 100 words allowed for description"),
});

const Page = () => {
  const router = useRouter();
  const [step, setStep] = useState("choose-role");
  const { data, error, loading, fn: submitUserRole } = useFetch(setUserRole);

  const form = useForm({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      specialty: "",
      experience: "",
      credentialUrl: "",
      description: "",
    },
  });

  const handlePatientSubmission = async () => {
    if (loading) return;
    const formData = new FormData();
    formData.append("role", "PATIENT");
    await submitUserRole(formData);
  };

  const handleDoctorSubmission = async (values) => {
    if (loading) return;
    const formData = new FormData();
    formData.append("role", "DOCTOR");
    formData.append("specialty", values.specialty);
    formData.append("experience", values.experience);
    formData.append("credentialUrl", values.credentialUrl);
    formData.append("description", values.description);
    await submitUserRole(formData);
  };

  useEffect(() => {
    if (data && data?.success) {
      toast.success("Role Selected");
      router.push(data.redirect);
    }
  }, [data]);

  if (step === "choose-role") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 max-w-6xl mx-auto">
        {/* Patient Card */}
        <Card
          onClick={() => {
            !loading && handlePatientSubmission();
          }}
          className="flex flex-col items-center text-center p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100 cursor-pointer"
        >
          <CardHeader className="flex flex-col items-center">
            <div className="p-4 bg-blue-100 rounded-full mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-800 mb-2">
              Join as Patient
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow mb-6">
            <p className="text-gray-600 text-lg">
              Book appointments, consult with doctors, and manage your
              healthcare journey
            </p>
          </CardContent>
          <Button
            disabled={loading}
            className="w-full max-w-xs py-6 text-lg bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Continue as Patient"
            )}
          </Button>
        </Card>

        {/* Doctor Card */}
        <Card
          onClick={() => !loading && setStep("doctor-form")}
          className="flex flex-col items-center text-center p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100 cursor-pointer"
        >
          <CardHeader className="flex flex-col items-center">
            <div className="p-4 bg-green-100 rounded-full mb-4">
              <StethoscopeIcon className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-800 mb-2">
              Join as Doctor
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow mb-6">
            <p className="text-gray-600 text-lg">
              Connect with patients, manage your schedule, and provide
              healthcare services
            </p>
          </CardContent>
          <Button className="w-full max-w-xs py-6 text-lg bg-green-600 hover:bg-green-700">
            Continue as Doctor
          </Button>
        </Card>
      </div>
    );
  }

  if (step === "doctor-form") {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card className="p-6">
          <CardHeader className="text-center">
           
            <CardTitle className="text-2xl font-semibold text-gray-800 mb-2">
              Complete Your Doctor Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleDoctorSubmission)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialty</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your medical speciality" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Medical Specialties</SelectLabel>
                            {SPECIALTIES.map((specialty) => (
                              <SelectItem
                                key={specialty.name}
                                value={specialty.name}
                              >
                                <div className="flex items-center gap-3">
                                  {specialty.icon}
                                  {specialty.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 5"
                          min="1"
                          max="40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="credentialUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credential URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/credentials"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your experience, specializations, and approach to patient care (20-100 words)"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("choose-role")}
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }
};

export default Page;
