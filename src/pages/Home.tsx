import React from "react";
import Hero from "@/components/home/Hero";
import Intro from "@/components/home/Intro";
import Ecosystem from "@/components/home/Ecosystem";
import Departements from "@/components/home/Departements";
import ImpactStats from "@/components/home/ImpactStats";
import NewsEvents from "@/components/home/NewsEvents";
import Testimonials from "@/components/home/Testimonials";
// import MediaGallery from "@/components/home/MediaGallery";
import SupportCTA from "@/components/home/SupportCTA";
import Timeline from "@/components/home/Timeline";
import { MediaGallery } from "@/components/media-gallery";


export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Ecosystem />
      <Departements />
      <ImpactStats />
      <Timeline />
      <Testimonials />
    <MediaGallery />
    </>
  );
}