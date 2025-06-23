import { User, Star, Calendar, MapPin, Clock, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function DoctorCard({
  doctor,
  variant = "default", // "default", "compact", "premium"
  showLocation = true,
  showAvailability = true,
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case "compact":
        return {
          card: "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700",
          avatar: "w-10 h-10 bg-gray-100 dark:bg-gray-800",
          button:
            "bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900",
        };
      case "premium":
        return {
          card: "border-purple-200/50 dark:border-purple-800/50 hover:border-purple-300/70 dark:hover:border-purple-700/70 bg-gradient-to-br from-purple-50/30 to-pink-50/30 dark:from-purple-950/20 dark:to-pink-950/20",
          avatar:
            "w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50",
          button:
            "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
        };
      default:
        return {
          card: "border-blue-200/50 dark:border-blue-800/50 hover:border-blue-300/70 dark:hover:border-blue-700/70",
          avatar: "w-12 h-12 bg-blue-100 dark:bg-blue-900/30",
          button:
            "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Card
      className={`
      ${styles.card}
      transition-all duration-300 ease-in-out
      hover:shadow-lg hover:shadow-blue-500/10
      hover:translate-y-[-2px]
      group
      relative
      overflow-hidden
    `}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/20 dark:to-blue-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardContent className="p-4 sm:p-6 relative">
        <div className="flex items-start gap-4 sm:gap-6">
          {/* Avatar */}
          <div
            className={`
            ${styles.avatar} 
            rounded-full flex items-center justify-center flex-shrink-0
            transition-transform duration-300 group-hover:scale-105
            relative overflow-hidden
            ring-2 ring-blue-100 dark:ring-blue-900/50
          `}
          >
            {doctor.imageUrl ? (
              <img
                src={doctor.imageUrl}
                alt={doctor.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
            )}

            {/* Online indicator */}
            {doctor.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg sm:text-xl text-gray-900 dark:text-gray-100 leading-tight group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                  {doctor.name}
                </h3>
                <p className="text-sm sm:text-base text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                  {doctor.specialty}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge
                  variant="outline"
                  className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs"
                >
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Verified
                </Badge>

                {doctor.rating && (
                  <Badge
                    variant="secondary"
                    className="bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs"
                  >
                    ★ {doctor.rating}
                  </Badge>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  <span>{doctor.experience} years</span>
                </div>

                {showLocation && doctor.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{doctor.location}</span>
                  </div>
                )}
              </div>

              {showAvailability && doctor.nextAvailable && (
                <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                  <Clock className="h-4 w-4" />
                  <span>Next available: {doctor.nextAvailable}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {doctor.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">
                {doctor.description}
              </p>
            )}

            {/* Specializations */}
            {doctor.specializations && doctor.specializations.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {doctor.specializations.slice(0, 3).map((spec, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0"
                  >
                    {spec}
                  </Badge>
                ))}
                {doctor.specializations.length > 3 && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0"
                  >
                    +{doctor.specializations.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            {/* Action Button */}
            <Button
              asChild
              className={`
                w-full ${styles.button}
                transition-all duration-200
                hover:shadow-md
                group/button
                text-white
              `}
            >
              <Link href={`/doctors/${doctor.specialty}/${doctor.id}`}>
                <Calendar className="h-4 w-4 mr-2 transition-transform group-hover/button:scale-110" />
                <span className="font-medium">View Profile & Book</span>
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
