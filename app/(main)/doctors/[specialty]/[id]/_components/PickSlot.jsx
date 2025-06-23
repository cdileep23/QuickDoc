import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ChevronRight, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
const PickSlot = ({ days, onSelectedSlot }) => {
  const [selectSlot, setSelectedSlot] = useState(null);
  const firstDayWithSlots =
    days.find((day) => day.slots.length > 0)?.date || days[0]?.date;
  const [activeTab, setActiveTab] = useState(firstDayWithSlots);
  const handleSlotSelection = (slot) => {
    setSelectedSlot(slot);
  };
  const confirSelection = () => {
    if (selectSlot) {
      onSelectedSlot(selectSlot);
    }
  };
  console.log(days);
  return (
    <div>
      <Tabs defaultValue={firstDayWithSlots} className="w-full">
        <TabsList className="w-full flex justify-start overflow-x-auto whitespace-nowrap no-scrollbar gap-2">
          {days.map((day) => (
            <TabsTrigger
              key={day.date}
              value={day.date}
              disabled={day.slots.length === 0}
              className={`shrink-0 px-4 py-2 rounded-md border ${
                day.slots.length === 0
                  ? "opacity-50 cursor-not-allowed bg-gray-100"
                  : "hover:bg-blue-100 border-blue-200"
              }`}
            >
              <div className="flex gap-2 text-sm">
                <div className="opacity-80">
                  {format(new Date(day.date), "MMM d")}
                </div>
                <div>({format(new Date(day.date), "EEE")})</div>
              </div>
              {day.slots.length > 0 && (
                <div className="ml-2 bg-blue-700 text-white text-xs px-2 py-1 rounded">
                  {day.slots.length}
                </div>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {days.map((day) => (
          <TabsContent value={day.date} key={day.date} className="pt-4">
            {day.slots.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No slots available for this day
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-lg font-medium mb-2">{day.displayDate}</h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {day.slots.map((slot) => (
                    <Card
                      key={slot.startTime}
                      className={`border-blue-300/30 cursor-pointer transition-all rounded-lg ${
                        selectSlot?.startTime === slot.startTime
                          ? "bg-blue-100 border-blue-600"
                          : "hover:border-blue-400"
                      }`}
                      onClick={() => handleSlotSelection(slot)}
                    >
                      <CardContent className="p-3 flex items-center">
                        <Clock
                          className={`h-4 w-4 mr-2 ${
                            selectSlot?.startTime === slot.startTime
                              ? "text-blue-600"
                              : "text-blue-400"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            selectSlot?.startTime === slot.startTime
                              ? "text-blue-900"
                              : "text-muted-foreground"
                          }`}
                        >
                          {format(new Date(slot.startTime), "h:mm a")}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      <div className="flex justify-end">
        <Button
          onClick={confirSelection}
          disabled={!selectSlot}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PickSlot