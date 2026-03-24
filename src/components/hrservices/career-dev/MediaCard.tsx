"use client";

import Image from "next/image";

const MediaCard = ({
  title,
  blurb,
  href,
  image,
}: {
  title: string;
  blurb: string;
  href?: string;
  image?: { src: string; alt: string };
}) => {
  const CardInner = (
    <div className="group flex h-full flex-col rounded-lg border border-base-300 bg-base-100 shadow-sm hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-lg bg-base-200">
        {image?.src ? (
          <Image src={image.src} alt={image.alt} className="h-full w-full object-cover" fill />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <div className="text-sm font-medium text-base-content group-hover:underline">{title}</div>
        <p className="mt-1 line-clamp-3 text-sm text-base-content/70">{blurb}</p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} className="block h-full">
      {CardInner}
    </a>
  ) : (
    CardInner
  );
};

export default MediaCard;
