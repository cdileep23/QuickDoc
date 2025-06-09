import { getCurrentUser } from "@/actions/onBoardng";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCheck, UserSearch, X, Clock, AlertCircle } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

const VerificationPage = async () => {
  const user = await getCurrentUser();

  if (user?.verificationStatus === "VERIFIED") {
    redirect("/doctor");
  }

  const status = user?.verificationStatus || "PENDING";
  const isRejected = status === "REJECTED";

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              {status === "REJECTED" ? (
                <X className="h-16 w-16 text-red-600" strokeWidth={1.5} />
              ) : status === "PENDING" ? (
                <Clock
                  className="h-16 w-16 text-yellow-500"
                  strokeWidth={1.5}
                />
              ) : (
                <UserSearch
                  className="h-16 w-16 text-blue-500"
                  strokeWidth={1.5}
                />
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              {status === "REJECTED"
                ? "Verification Rejected"
                : "Account Verification"}
            </h1>
          </CardHeader>

          <CardContent className="space-y-4">
            {status === "REJECTED" ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Verification Failed</AlertTitle>
                <AlertDescription>
                  Your doctor verification has been rejected. Please check your
                  submitted documents and try again.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertTitle>Verification in Progress</AlertTitle>
                <AlertDescription>
                  Your account is currently under review. This process typically
                  takes 24-48 hours. We'll notify you once completed.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2 text-sm text-muted-foreground text-left">
              {status === "REJECTED" ? (
                <>
                  <p>Common reasons for rejection:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Blurry or unreadable documents</li>
                    <li>Expired license or certification</li>
                    <li>Information mismatch</li>
                  </ul>
                </>
              ) : (
                <p>
                  For faster verification, ensure all submitted documents are
                  clear and valid. You'll receive an email notification once
                  your verification is complete.
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            {status === "REJECTED" && (
              <Button asChild variant="destructive">
                <Link href="/onboarding">Resubmit Documents</Link>
              </Button>
            )}
          </CardFooter>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <Link href='/'>
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
