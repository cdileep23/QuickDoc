import ButtonsMain from "@/components/main/ButtonsMain";
import Pricing from "@/components/Pricing";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { creditBenefits, features } from "@/lib/data";
import { Stethoscope } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center px-4 bg-white py-20 md:pt-32 md:pb-0">
      {/* Hero Section */}
      <section className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center mx-auto">
        <div className="space-y-6">
          <Badge className="text-sm px-3 py-1 bg-blue-100 text-blue-600 w-fit">
            Digitalize HealthCare
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Book & Connect with Trusted Doctors Instantly
          </h1>

          <p className="text-gray-600 text-lg">
            QuickDoc makes healthcare access simple, fast, and reliable. Skip
            the wait — consult online.
          </p>

          <ButtonsMain />
        </div>

        <div className="flex justify-center">
          <Image
            src="https://res.cloudinary.com/dzb0rtckl/image/upload/v1748885127/ChatGPT_Image_Jun_2_2025_10_55_15_PM_pghwsd.png"
            alt="Doctor Illustration"
            width={500}
            height={500}
            className="rounded-xl shadow-md"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-10 w-full bg-white">
        <div className="max-w-7xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            QuickDoc is designed to streamline your health journey. Here’s how
            you can get started in just a few steps.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm text-center">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    
      
    </div>
  );
}
