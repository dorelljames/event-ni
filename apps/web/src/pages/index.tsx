/* eslint-disable @typescript-eslint/no-unused-vars */
import Head from "next/head";
import { createClient } from "@/utils/supabase/static-props";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { EventList } from "@/components/EventList";
import { EventGrid } from "@/components/EventGrid";
import { EventBentoGrid } from "@/components/EventBentoGrid";
import { FilterBar } from "@/components/FilterBar";
import { groupEventsByTime } from "@/utils/eventUtils";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "@/components/SEO";
import { AccountsFromDB, EventFromDB } from "@/types";

export default function Home({
  events,
  accounts,
}: {
  events: EventFromDB[];
  accounts: AccountsFromDB[];
}) {
  const router = useRouter();
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [view, setView] = useState<"card" | "list" | "bento">("card");

  useEffect(() => {
    setFilteredEvents(
      selectedAccount
        ? events.filter((event) => Number(event.account.id) === selectedAccount)
        : events
    );
  }, [selectedAccount, events]);

  const { upcomingEvents, recentEvents, pastEvents } =
    groupEventsByTime(filteredEvents);

  const seoProps = {
    title: "CebEvents - Discover Local Events",
    description:
      "Discover and explore exciting events in your area with CebEvents. Find upcoming concerts, workshops, and more!",
    url: "https://events.dorelljames.dev",
    imageUrl: "https://events.dorelljames.dev/og-image.jpg",
  };

  useEffect(() => {
    // Restore scroll position if returning from an event page
    if (router.asPath === router.route) {
      const scrollPosition = sessionStorage.getItem("scrollPosition");
      if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition, 10));
        sessionStorage.removeItem("scrollPosition");
      }
    }

    // Save scroll position before leaving the page
    const handleRouteChange = () => {
      sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <>
      <SEO {...seoProps} />

      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-screen bg-gray-100 dark:bg-gray-900"
      >
        <FilterBar
          accounts={accounts}
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
          view={view}
          setView={setView}
        />
        <AnimatePresence mode="wait">
          {view === "card" && (
            <motion.div
              key="card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EventGrid
                upcomingEvents={upcomingEvents}
                recentEvents={recentEvents}
                pastEvents={pastEvents}
              />
            </motion.div>
          )}
          {view === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EventList
                upcomingEvents={upcomingEvents}
                recentEvents={recentEvents}
                pastEvents={pastEvents}
              />
            </motion.div>
          )}
          {view === "bento" && (
            <motion.div
              key="bento"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EventBentoGrid
                upcomingEvents={upcomingEvents}
                recentEvents={recentEvents}
                pastEvents={pastEvents}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

export async function getStaticProps() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select(
      `
      *,
      account:account_id (
        id,
        name
      )
    `
    )
    .order("start_time", { ascending: false });

  if (error) {
    console.error(error);
    return { props: { events: [], accounts: [] } };
  }

  const accounts = Array.from(
    new Map(data?.map((event) => [event.account.id, event.account])).values()
  );

  return {
    props: { events: data, accounts },
    revalidate: 60, // Revalidate every 60 seconds for ISR
  };
}
