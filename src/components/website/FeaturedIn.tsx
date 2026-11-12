"use client";
import Image from "next/image";

const LOGOS = [
  { src: "/assets/logos/logoipsum-265.svg", alt: "Partner logo" },
  { src: "/assets/logos/logoipsum-287.svg", alt: "Partner logo" },
  { src: "/assets/logos/logoipsum-317.svg", alt: "Partner logo" },
  { src: "/assets/logos/logoipsum-325.svg", alt: "Partner logo" },
];

const FeaturedIn = () => {
  return (
    <section className="border-y border-zinc-200/60 dark:border-white/10 bg-zinc-50 dark:bg-[#0a0a0c] py-10 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-5 md:px-10 lg:px-16">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-12">
          <p className="shrink-0 text-xs font-heading font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Powered by
          </p>
          <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800 hidden md:block" />
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14">
            {LOGOS.map((logo, i) => (
              <Image
                key={i}
                src={logo.src}
                alt={logo.alt}
                width={100}
                height={40}
                className="h-8 w-auto opacity-50 dark:opacity-40 dark:invert grayscale transition-all hover:opacity-80 dark:hover:opacity-90 hover:grayscale-0"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedIn;
