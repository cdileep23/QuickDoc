import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

const PageHeader = ({
  icon,
  title,
  subtitle,
  backLink = "/",
  backLabel = "Back to Home",
  variant = "default", // "default", "minimal", "gradient"
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "minimal":
        return {
          container: "border-b border-gray-200 dark:border-gray-800 pb-6",
          title: "text-gray-900 dark:text-gray-100",
          icon: "text-gray-600 dark:text-gray-400",
        };
      case "gradient":
        return {
          container:
            "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 rounded-2xl",
          title:
            "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent",
          icon: "text-blue-500",
        };
      default:
        return {
          container: "",
          title: "text-gray-900 dark:text-gray-100",
          icon: "text-blue-500",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`flex flex-col gap-6 sm:gap-8 mb-8 sm:mb-12 ${styles.container}`}
    >
      {/* Back Button */}
      <div className="flex items-center">
        <Link href={backLink} className="group">
          <Button
            variant="outline"
            size="sm"
            className="
              transition-all duration-200 
              hover:bg-gray-50 dark:hover:bg-gray-800 
              hover:border-gray-300 dark:hover:border-gray-600
              hover:shadow-sm
              group-hover:translate-x-[-2px]
              border-gray-200 dark:border-gray-700
            "
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:translate-x-[-1px]" />
            <span className="text-sm font-medium">{backLabel}</span>
          </Button>
        </Link>
      </div>

      {/* Header Content */}
      <div className="flex flex-row items-end gap-4 sm:gap-6">
        {/* Icon */}
        {icon && (
          <div
            className={`
            flex-shrink-0 
            ${styles.icon}
            transition-transform duration-200 hover:scale-105
          `}
          >
            {React.cloneElement(icon, {
              className: "h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16",
            })}
          </div>
        )}

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h1
            className={`
            text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 
            font-bold tracking-tight leading-tight
            ${styles.title}
            transition-colors duration-200
          `}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              className="
              mt-2 sm:mt-3 
              text-base sm:text-lg lg:text-xl 
              text-gray-600 dark:text-gray-400 
              leading-relaxed
              max-w-3xl
            "
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
