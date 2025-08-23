"use client";
import React from "react";
import { Circle, PhoneCall, PhoneOff, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import jsPDF from "jspdf"; // ✅ PDF library
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Stethoscope } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
export default function AiAssistantPage() {
  const [startCall, setStartCall] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [currentRole, setCurrentRole] = React.useState("");
  const [liveTranscript, setLiveTranscript] = React.useState("");
  const [fullTranscript, setFullTranscript] = React.useState([]); 
  const [lastReport, setLastReport] = React.useState(null); // ✅ Store last report

  const vapi = React.useMemo(
    () => new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY),
    []
  );

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  React.useEffect(() => {
    let timer;
    if (startCall) {
      timer = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsed(0);
    }
    return () => clearInterval(timer);
  }, [startCall]);

  const generatePDFReport = (report) => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text("📄 Call Report", 10, y);
    y += 15;

    doc.setFontSize(12);
    doc.text(`Duration: ${report.duration}`, 10, y);
    y += 10;
    doc.text(`Ended At: ${report.endedAt}`, 10, y);
    y += 15;

    doc.setFontSize(14);
    doc.text("Summary:", 10, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(doc.splitTextToSize(report.summary, 180), 10, y);
    y += 20;

    doc.setFontSize(14);
    doc.text("Transcript:", 10, y);
    y += 10;
    doc.setFontSize(11);

    report.transcript.forEach((t) => {
      const line = `${t.role}: ${t.text}`;
      const splitLines = doc.splitTextToSize(line, 180);
      if (y + splitLines.length * 7 > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(splitLines, 10, y);
      y += splitLines.length * 7;
    });

    doc.save(`call-report-${Date.now()}.pdf`);
  };

  const prepareReport = () => {
    const report = {
      duration: formatTime(elapsed),
      transcript: fullTranscript,
      summary: `Call lasted ${formatTime(elapsed)} with ${
        fullTranscript.length
      } interactions.`,
      endedAt: new Date().toLocaleString(),
    };

    setLastReport(report); // ✅ store for later re-download
    generatePDFReport(report); // auto-download after call ends
  };

  const StartCall = () => {
    vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);

    vapi.on("call-start", () => {
      setStartCall(true);
      setFullTranscript([]);
      setLastReport(null); // clear old report
    });

    vapi.on("call-end", () => {
      setStartCall(false);
      prepareReport(); // ✅ Auto-generate PDF + save in state
    });

    vapi.on("speech-start", () => {
      setCurrentRole("assistant");
    });

    vapi.on("speech-end", () => {
      setCurrentRole("user");
    });

    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        if (message.transcriptType === "partial") {
          setLiveTranscript(message.transcript);
          setCurrentRole(message.role);
        } else if (message.transcriptType === "final") {
          setFullTranscript((prev) => [
            ...prev,
            { role: message.role, text: message.transcript },
          ]);
        }
      }
    });
  };

return (
  <div className="p-4">
    {/* Transcript Section */}
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Transcript</CardTitle>
        <CardDescription>Live conversation</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px] overflow-y-auto bg-gray-100 rounded-lg p-4">
        {fullTranscript.length === 0 ? (
          <p className="text-gray-400 italic text-center">
            {liveTranscript || "No live transcript yet"}
          </p>
        ) : (
          <>
            {fullTranscript.map((t, i) => (
              <div
                key={i}
                className={`flex mb-3 ${
                  t.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Assistant bubble */}
                {t.role !== "user" && (
                  <Avatar className="mr-2">
                    <AvatarFallback className="bg-gray-200">
                      <Stethoscope className="h-4 w-4 text-gray-700" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`px-3 py-2 rounded-lg max-w-xs shadow-sm ${
                    t.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white border text-gray-800"
                  }`}
                >
                  <p className="text-sm">{t.text}</p>
                </div>

                {/* User bubble */}
                {t.role === "user" && (
                  <Avatar className="ml-2">
                    <AvatarFallback className="bg-blue-200">
                      <User className="h-4 w-4 text-blue-700" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {/* Live transcript bubble */}
            {liveTranscript && (
              <div
                className={`flex mb-3 ${
                  currentRole === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {currentRole !== "user" && (
                  <Avatar className="mr-2">
                    <AvatarFallback className="bg-gray-200">
                      <Stethoscope className="h-4 w-4 text-gray-700" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`italic px-3 py-2 rounded-lg max-w-xs ${
                    currentRole === "user"
                      ? "bg-blue-300 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {liveTranscript}
                </div>
                {currentRole === "user" && (
                  <Avatar className="ml-2">
                    <AvatarFallback className="bg-blue-200">
                      <User className="h-4 w-4 text-blue-700" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>

    {/* Call Controls */}
    <div className="flex flex-col items-center justify-center mt-6 space-y-4">
      {!startCall ? (
      <Button onClick={StartCall} className="flex items-center gap-2">
        <PhoneCall /> Start Call
      </Button>
      ) : (
      <Button
        variant="destructive"
        className="flex items-center gap-2"
        onClick={() => vapi.stop()}
      >
      <PhoneOff /> Disconnect
    </Button>
  )}

  {lastReport && !startCall && (
    <Button
      onClick={() => generatePDFReport(lastReport)}
      className="flex items-center gap-2"
    >
      <FileDown /> Download Report Again
    </Button>
  )}
    </div>
  </div>
);

}




