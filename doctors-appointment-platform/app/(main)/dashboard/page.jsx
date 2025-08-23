"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users } from "lucide-react";

export default function EventsDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error loading events:", err);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">All Events</h1>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <p className="text-gray-500">No events yet.</p>
        ) : (
          events.map((event) => (
            <Card
              key={event.id}
              className="rounded-2xl shadow-md hover:shadow-lg transition border border-gray-200"
            >
              <CardContent className="p-5 space-y-3">
                {/* Title + Status */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {event.title}
                  </h2>
                  <Badge
                    className={
                      event.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {event.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-gray-600">{event.description}</p>

                {/* Details */}
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    {event.location || "No location"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    {event.startsAt
                      ? new Date(event.startsAt).toLocaleString()
                      : "TBD"}{" "}
                    -{" "}
                    {event.endsAt
                      ? new Date(event.endsAt).toLocaleString()
                      : "TBD"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    Capacity: {event.capacity ?? "Unlimited"}
                  </div>
                </div>

                {/* Organizer */}
                <p className="text-xs text-gray-400 pt-2">
                  Organizer: {event.organizer?.name || "Unknown"}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
