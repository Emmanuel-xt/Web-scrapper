'use client'

import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";

const heroImages = [
  { imgUrl: "/assets/images/hero-1.svg", alt: "smart watch" },
  { imgUrl: "/assets/images/hero-2.svg", alt: "smart bag" },
  { imgUrl: "/assets/images/hero-3.svg", alt: "smart lamp" },
  { imgUrl: "/assets/images/hero-4.svg", alt: "smart watch" },
  { imgUrl: "/assets/images/hero-5.svg", alt: "smart watch" },
];

const HeroCarosel = () => {
  return (
    <div>
      {" "}
      <Carousel
      showThumbs={false}
      autoPlay
      infiniteLoop
      interval={2000}
      showArrows={false}
      showStatus={false}

      >
        {
            heroImages.map((image) => (
                <Image 
                src={image.imgUrl}
                alt={image.alt}
                width={484}
                height={484}
                className="object-contain"
                key={image.alt}
                />
            ))
        }
      </Carousel>
    </div>
  );
};

export default HeroCarosel;
