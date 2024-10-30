import React from "react";

import { useState } from "react";
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogTitle,
} from "@headlessui/react";
import { BsRssFill, BsApple, BsGoogle, BsMicrosoft } from "react-icons/bs";
import { CiCalendarDate } from "react-icons/ci";

const AddToCalendar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const calendarURL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/calendar`;
  console.log("🚀 ~ AddToCalendar ~ calendarURL:", calendarURL);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-700"
      >
        <span className="flex items-center">
          <BsRssFill className="w-4 h-4 mr-2" />
          Subscribe To Events
        </span>
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          {/* The backdrop, rendered as a fixed sibling to the panel container */}
          <DialogBackdrop
            className="fixed inset-0 bg-black/80"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md mx-auto p-6">
            <CiCalendarDate className="w-12 h-12 text-gray-500 dark:text-gray-400 mb-2" />
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Add iCal Subscription
            </DialogTitle>
            <Description className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Add the event feed to your calendar app to keep up with new events
              and updates.
            </Description>

            <div className="mt-4">
              <a
                href={`https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(calendarURL)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-3 mt-2 text-sm font-bold text-white bg-blue-500 rounded-md hover:bg-blue-700"
              >
                <BsGoogle className="w-4 h-4 mr-2" />
                Google Calendar
              </a>
              <a
                href={`https://outlook.live.com/calendar/0/addcalendar?url=${encodeURIComponent("webcal://" + calendarURL)}`}
                className="flex items-center px-4 py-3 mt-2 text-sm font-bold text-white bg-blue-600 rounded-md hover:bg-blue-800"
              >
                <BsMicrosoft className="w-4 h-4 mr-2" />
                Outlook Calendar
              </a>
              <a
                href={`webcal://${encodeURIComponent(calendarURL)}`}
                className="flex items-center px-4 py-3 mt-2 text-sm font-bold text-white bg-gray-900 rounded-md hover:bg-gray-700"
              >
                <BsApple className="w-4 h-4 mr-2" />
                Apple Calendar
              </a>
              <a
                href={calendarURL}
                download="calendar.ics"
                className="text-center block px-4 py-2 mt-2 text-sm font-medium text-gray-500 hover:text-gray-300"
              >
                If the links above didn&apos;t work, click here to download .ics
                file and add it manually to your calendar app.
              </a>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AddToCalendar;