"use client";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react";
export default function DoctorSuggestor() {
  const [symptoms, setSymptoms] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  async function handleSuggest() {
    const res = await fetch("/api/suggest-doctor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms }),
    });
    const data = await res.json();
    setSuggestions(data.suggestions);
    setShowSuggestions(true);
  }

  return (
    <div className="max-w-2xl mx-auto text-center py-12 px-6 relative">
      {/* Hero Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Find the Right Doctor for Your Symptoms
      </h1>
      <p className="text-gray-600 mb-8">
        Describe your symptoms and let our AI assistant suggest the right
        specialist.
      </p>

      {/* Input + Button */}
      <div className="bg-white shadow-lg rounded-2xl p-2 border border-gray-100">
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="E.g. chest pain, frequent headaches, skin rash..."
              className="w-full h-12 pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>
          <Button
  onClick={handleSuggest}
  size="lg"
  className="bg-emerald-600 text-black hover:bg-emerald-700 mt-1"
>
  Suggest Doctor <Stethoscope className="ml-2 h-4 w-4" />
</Button>
        </div>
      </div>

      {/* Floating Suggestions Card with Animation */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl relative"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSuggestions(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                <X size={20} />
              </button>

              <h2 className="font-semibold text-xl text-gray-800 mb-3">
                Top 3 Suggestions, according to our AI:
              </h2>
              <pre className="text-gray-700 whitespace-pre-wrap">
                {suggestions}
              </pre>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
