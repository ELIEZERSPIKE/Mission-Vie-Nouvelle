import React from "react";
import Hero from "@/components/home/Hero";
import Intro from "@/components/home/Intro";
import Ecosystem from "@/components/home/Ecosystem";
import ImpactStats from "@/components/home/ImpactStats";
import NewsEvents from "@/components/home/NewsEvents";
import Testimonials from "@/components/home/Testimonials";
// import MediaGallery from "@/components/home/MediaGallery";
import SupportCTA from "@/components/home/SupportCTA";
import Timeline from "@/components/home/Timeline";
import InternationalPresence from "@/components/home/InternationalPresence";


export default function Home() {
  return (
    <>
      <Hero />
      <Ecosystem />
      <Intro />
      <InternationalPresence />
      <ImpactStats />
      <Testimonials />
    </>
  );
}