"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  User,
} from "lucide-react";
import { toast } from "sonner";

export default function VideoCall({ sessionId, token }) {
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const sessionRef = useRef(null);
  const publisherRef = useRef(null);
  const isCleaningUpRef = useRef(false);

  const router = useRouter();

  const appId = process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID;

  // Handle script load
  const handleScriptLoad = () => {
    setScriptLoaded(true);
    if (!window.OT) {
      toast.error("Failed to load Vonage Video API");
      setIsLoading(false);
      return;
    }
    initializeSession();
  };

  // Complete cleanup function
  const cleanupSession = async () => {
    if (isCleaningUpRef.current) return;
    isCleaningUpRef.current = true;

    console.log("Starting cleanup...");

    try {
      // Stop publisher first
      if (publisherRef.current) {
        console.log("Destroying publisher...");
        // Stop publishing before destroying
        if (sessionRef.current) {
          sessionRef.current.unpublish(publisherRef.current);
        }
        publisherRef.current.destroy();
        publisherRef.current = null;
      }

      // Disconnect and destroy session
      if (sessionRef.current) {
        console.log("Disconnecting session...");

        // Remove all event listeners to prevent memory leaks
        sessionRef.current.off();

        // Force disconnect if still connected
        if (sessionRef.current.connection) {
          sessionRef.current.forceDisconnect();
        } else {
          sessionRef.current.disconnect();
        }

        sessionRef.current = null;
      }

      // Reset states
      setIsConnected(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error during cleanup:", error);
    } finally {
      isCleaningUpRef.current = false;
    }
  };

  // Initialize video session
  const initializeSession = () => {
    if (!appId || !sessionId || !token) {
      toast.error("Missing required video call parameters");
      router.push("/appointments");
      return;
    }

    console.log("Initializing session...", { appId, sessionId, token });

    try {
      // Initialize the session
      sessionRef.current = window.OT.initSession(appId, sessionId);

      // Subscribe to new streams
      sessionRef.current.on("streamCreated", (event) => {
        console.log("New stream created:", event);

        const subscriber = sessionRef.current.subscribe(
          event.stream,
          "subscriber",
          {
            insertMode: "replace",
            width: "100%",
            height: "100%",
          },
          (error) => {
            if (error) {
              console.error("Subscriber error:", error);
              toast.error("Error connecting to other participant's stream");
            } else {
              console.log("Successfully subscribed to remote stream");
            }
          }
        );
      });

      // Handle stream destroyed
      sessionRef.current.on("streamDestroyed", (event) => {
        console.log("Stream destroyed:", event);
      });

      // Handle session events
      sessionRef.current.on("sessionConnected", (event) => {
        console.log("Session connected:", event);
        setIsConnected(true);
        setIsLoading(false);

        // Initialize publisher AFTER session connects
        publisherRef.current = window.OT.initPublisher(
          "publisher",
          {
            insertMode: "replace",
            width: "100%",
            height: "100%",
            publishAudio: isAudioEnabled,
            publishVideo: isVideoEnabled,
          },
          (error) => {
            if (error) {
              console.error("Publisher error:", error);
              toast.error("Error initializing your camera and microphone");
            } else {
              console.log("Publisher initialized successfully");

              // Publish the stream
              sessionRef.current.publish(
                publisherRef.current,
                (publishError) => {
                  if (publishError) {
                    console.error("Error publishing stream:", publishError);
                    toast.error("Error publishing your stream");
                  } else {
                    console.log("Stream published successfully");
                  }
                }
              );
            }
          }
        );
      });

      sessionRef.current.on("sessionDisconnected", (event) => {
        console.log("Session disconnected:", event);
        setIsConnected(false);

        // Clean up references when session disconnects
        if (publisherRef.current) {
          publisherRef.current.destroy();
          publisherRef.current = null;
        }
      });

      // Handle connection errors
      sessionRef.current.on("connectionCreated", (event) => {
        console.log("Connection created:", event);
      });

      sessionRef.current.on("connectionDestroyed", (event) => {
        console.log("Connection destroyed:", event);
      });

      // Connect to the session
      sessionRef.current.connect(token, (error) => {
        if (error) {
          console.error("Session connection error:", error);
          toast.error(`Error connecting to video session: ${error.message}`);
          setIsLoading(false);
        } else {
          console.log("Successfully connected to session");
        }
      });
    } catch (error) {
      console.error("Failed to initialize video call:", error);
      toast.error("Failed to initialize video call");
      setIsLoading(false);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (publisherRef.current) {
      publisherRef.current.publishVideo(!isVideoEnabled);
      setIsVideoEnabled((prev) => !prev);
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (publisherRef.current) {
      publisherRef.current.publishAudio(!isAudioEnabled);
      setIsAudioEnabled((prev) => !prev);
    }
  };

  // End call with proper cleanup
  const endCall = async () => {
    console.log("Ending call...");

    // Disable buttons to prevent multiple clicks
    setIsLoading(true);

    try {
      await cleanupSession();

      // Small delay to ensure cleanup is complete
      setTimeout(() => {
        router.push("/appointments");
      }, 500);
    } catch (error) {
      console.error("Error ending call:", error);
      router.push("/appointments");
    }
  };

  // Cleanup on unmount with proper async handling
  useEffect(() => {
    return () => {
      console.log("Component unmounting, cleaning up...");
      cleanupSession();
    };
  }, []);

  // Reset cleanup flag when sessionId changes (for rejoining)
  useEffect(() => {
    isCleaningUpRef.current = false;
    setIsLoading(true);
    setIsConnected(false);
  }, [sessionId, token]);

  if (!sessionId || !token || !appId) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Invalid Video Call
        </h1>
        <p className="text-muted-foreground mb-6">
          Missing required parameters for the video call.
        </p>
        <Button
          onClick={() => router.push("/appointments")}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Back to Appointments
        </Button>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://unpkg.com/@vonage/client-sdk-video@latest/dist/js/opentok.js"
        onLoad={handleScriptLoad}
        onError={() => {
          toast.error("Failed to load video call script");
          setIsLoading(false);
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Video Consultation
          </h1>
          <p className="text-muted-foreground">
            {isConnected
              ? "Connected"
              : isLoading
              ? "Connecting..."
              : "Connection failed"}
          </p>
        </div>

        {isLoading && !scriptLoaded ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-emerald-400 animate-spin mb-4" />
            <p className="text-white text-lg">
              Loading video call components...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Publisher (Your video) */}
              <div className="border border-emerald-900/20 rounded-lg overflow-hidden">
                <div className="bg-emerald-900/10 px-3 py-2 text-emerald-400 text-sm font-medium">
                  You
                </div>
                <div
                  id="publisher"
                  className="w-full h-[300px] md:h-[400px] bg-muted/30"
                >
                  {!scriptLoaded && (
                    <div className="flex items-center justify-center h-full">
                      <div className="bg-muted/20 rounded-full p-8">
                        <User className="h-12 w-12 text-emerald-400" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Subscriber (Other person's video) */}
              <div className="border border-emerald-900/20 rounded-lg overflow-hidden">
                <div className="bg-emerald-900/10 px-3 py-2 text-emerald-400 text-sm font-medium">
                  Other Participant
                </div>
                <div
                  id="subscriber"
                  className="w-full h-[300px] md:h-[400px] bg-muted/30"
                >
                  {(!isConnected || !scriptLoaded) && (
                    <div className="flex items-center justify-center h-full">
                      <div className="bg-muted/20 rounded-full p-8">
                        <User className="h-12 w-12 text-emerald-400" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Video controls */}
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                size="lg"
                onClick={toggleVideo}
                className={`rounded-full p-4 h-14 w-14 ${
                  isVideoEnabled
                    ? "border-emerald-900/30"
                    : "bg-red-900/20 border-red-900/30 text-red-400"
                }`}
                disabled={!publisherRef.current || isLoading}
              >
                {isVideoEnabled ? <Video /> : <VideoOff />}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={toggleAudio}
                className={`rounded-full p-4 h-14 w-14 ${
                  isAudioEnabled
                    ? "border-emerald-900/30"
                    : "bg-red-900/20 border-red-900/30 text-red-400"
                }`}
                disabled={!publisherRef.current || isLoading}
              >
                {isAudioEnabled ? <Mic /> : <MicOff />}
              </Button>

              <Button
                variant="destructive"
                size="lg"
                onClick={endCall}
                className="rounded-full p-4 h-14 w-14 bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <PhoneOff />
                )}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                {isVideoEnabled ? "Camera on" : "Camera off"} •
                {isAudioEnabled ? " Microphone on" : " Microphone off"}
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                When you're finished with your consultation, click the red
                button to end the call
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
