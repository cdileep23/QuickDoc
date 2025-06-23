import { ArrowLeft } from "lucide-react";
import React from "react";
import { SPECIALTIES } from "@/lib/data";
import Link from "next/link";
import { Card } from "@/components/ui/card";

const Page = () => {
  console.log("spppppppppppppppppppppppppppp")
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-3 mb-4">
        <h1 className="font-bold text-xl">Find Your Doctor</h1>
        <p>Browse by specialty or view all available healthcare providers</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
        {SPECIALTIES.map((e) => (
          <Link href={`/doctors/${e.name}`} key={e.name}>
            <Card className="flex flex-col items-center p-4 hover:shadow-md cursor-pointer">
              <span className="text-blue-500 ">{e.icon}</span>
              <h1 className="mt-1 font-medium">{e.name}</h1>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
