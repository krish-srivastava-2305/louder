"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Search, Calendar, MapPin, Clock, ExternalLink, Loader2 } from "lucide-react";

type SelectedEvent = {
  id: number;
  title: string;
  date: string;
  link: string;
};

export default function Home() {
  const [city, setCity] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const fetchEvents = async (cityName: string) => {
    if (!cityName) {
      toast.error("Please enter a city name");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://louder-1.onrender.com/api/v1/fetch-events/${cityName}`);
      const data = await response.json();
      setEvents(data.events || []);
      toast.success(`Found ${data.events?.length || 0} events in ${cityName}`);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events. Please try again.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const saveUserAndRedirect = async () => {
    if (!userName || !userEmail) {
      toast.error("Please enter your name and email");
      return;
    }

    if (!validateEmail(userEmail)) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      const response = await fetch("https://louder-1.onrender.com/api/v1/save-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          eventTitle: selectedEvent?.title || "",
        }),
      });

      if (response.ok) {
        toast.success("Registration successful!");
        window.open(selectedEvent?.link, "_blank");
        setSelectedEvent(null);
        setUserName("");
        setUserEmail("");
      } else {
        toast.error("Failed to save user information");
      }
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Example cities for suggestions
  const popularCities = ["Lucknow", "Mumbai", "Bengaluru", "Delhi", "Chennai", "Kolkata"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <motion.h1
            className="text-2xl font-bold text-indigo-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            City Events Hub
          </motion.h1>
          <motion.div
            className="flex items-center bg-white rounded-full shadow-md p-2 w-full max-w-md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Search className="w-5 h-5 text-gray-400 mx-2" />
            <input
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-grow outline-none text-gray-700 px-2"
              onKeyDown={(e) => e.key === "Enter" && fetchEvents(city)}
            />
            <motion.button
              className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchEvents(city)}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
            </motion.button>
          </motion.div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Popular cities chips */}
        <motion.div
          className="mb-8 flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span className="text-sm font-medium text-gray-500">Popular cities:</span>
          {popularCities.map((cityName) => (
            <motion.button
              key={cityName}
              className="bg-white px-3 py-1 rounded-full text-sm text-indigo-600 border border-indigo-200 shadow-sm"
              whileHover={{ scale: 1.05, backgroundColor: "#EEF2FF" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setCity(cityName);
                fetchEvents(cityName);
              }}
            >
              {cityName}
            </motion.button>
          ))}
        </motion.div>

        {/* Events grid */}
        {events.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <AnimatePresence>
              {events.map((event: SelectedEvent, index) => (
                <motion.div
                  key={event.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{event.title}</h3>
                      <Calendar className="w-5 h-5 text-indigo-500 flex-shrink-0 ml-2" />
                    </div>
                    <div className="mt-3 flex items-center text-gray-500 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{event.date}</span>
                    </div>
                    <div className="mt-2 flex items-center text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{city || "Location"}</span>
                    </div>
                    <motion.button
                      className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium"
                      whileHover={{ scale: 1.02, backgroundColor: "#4F46E5" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedEvent(event)}
                    >
                      Register for Event
                      <ExternalLink className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : loading ? (
          <div className="flex justify-center items-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-12 h-12 text-indigo-500" />
            </motion.div>
          </div>
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <MapPin className="w-16 h-16 text-indigo-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700">No events found</h3>
            <p className="text-gray-500 mt-2">Search for a city to discover events</p>
          </motion.div>
        )}
      </main>

      {/* Registration Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Register for Event</h3>
              <p className="text-gray-600 mb-6">{selectedEvent.title}</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <motion.button
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg text-sm font-medium"
                  whileHover={{ backgroundColor: "#e5e7eb" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedEvent(null)}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium"
                  whileHover={{ backgroundColor: "#4F46E5" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={saveUserAndRedirect}
                >
                  Register & Continue
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-24 bg-white py-6 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          © 2025 City Events Hub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}