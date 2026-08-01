"use client";

import { CylinderCarousel } from "@/components/ui/cylinder-carousel";

const IMAGES = [
  { src: "https://images.unsplash.com/photo-1540968221243-29f5d70540bf?w=280", alt: "jellyfish" },
  { src: "https://images.unsplash.com/photo-1596135187959-562c650d98bc?w=280", alt: "jellyfish" },
  { src: "https://images.unsplash.com/photo-1628944682084-831f35256163?w=280", alt: "jellyfish" },
  { src: "https://images.unsplash.com/photo-1590013330451-3946e83e0392?w=280", alt: "jellyfish" },
  { src: "https://images.unsplash.com/photo-1590421959604-741d0eec0a2e?w=280", alt: "jellyfish" },
  { src: "https://images.unsplash.com/photo-1572613000712-eadc57acbecd?w=280", alt: "jellyfish" },
  { src: "https://images.unsplash.com/photo-1570097192570-4b49a6736f9f?w=280", alt: "jellyfish" },
  { src: "https://images.unsplash.com/photo-1620789550663-2b10e0080354?w=280", alt: "jellyfish" },
  { src: "https://images.unsplash.com/photo-1617775623669-20bff4ffaa5c?w=280", alt: "jellyfish" },
  { src: "https://images.unsplash.com/photo-1548600916-dc8492f8e845?w=280", alt: "jellyfish" },
  { src: "https://images.unsplash.com/photo-1573824969595-a76d4365a2e6?w=280", alt: "jellyfish" },
  { src: "https://images.unsplash.com/photo-1633936929709-59991b5fdd72?w=280", alt: "jellyfish" },
];

export function CylinderCarouselDemo() {
  return (
    <div className="w-full">
      <CylinderCarousel images={IMAGES} />
    </div>
  );
}
