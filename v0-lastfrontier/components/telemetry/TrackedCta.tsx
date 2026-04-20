"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  trackAlaskaCorridorEvent,
  type AlaskaCorridorEventName,
  type AlaskaCorridorEventProps,
} from "@/lib/telemetry/alaskaCorridor";

type TrackedCtaProps = {
  href: string;
  className: string;
  children: ReactNode;
  eventName?: AlaskaCorridorEventName;
  additionalEvents?: AlaskaCorridorEventName[];
  eventProps?: AlaskaCorridorEventProps;
  target?: string;
  rel?: string;
};

export default function TrackedCta({
  href,
  className,
  children,
  eventName,
  additionalEvents,
  eventProps,
  target,
  rel,
}: TrackedCtaProps) {
  const isExternal = /^https?:\/\//i.test(href);

  function handleClick() {
    if (!eventName || !eventProps) return;
    trackAlaskaCorridorEvent(eventName, eventProps);
    for (const nextEvent of additionalEvents || []) {
      trackAlaskaCorridorEvent(nextEvent, eventProps);
    }
  }

  if (isExternal) {
    return (
      <a href={href} target={target} rel={rel} className={className} onClick={handleClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
