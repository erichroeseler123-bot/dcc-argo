# dcc-argo

## What This Repo Is

`dcc-argo` is a thin Argo-specific microsite repo.
It currently looks like a static promotional and booking-adjacent site, not the live owned execution corridor.

## Role In The System

- role: `argo-support`
- runtime shape: static site files under `argo/` with Vercel config
- related to Argo branding and discovery, but not the current Shuttleya-owned execution authority

## Booking Impact

- booking impact: `potentially conflicting`
- this repo can create confusion if treated like the active Argo execution surface
- the live owned Argo proof corridor now runs through `destinations-cc -> Shuttleya -> /checkout`

## Read These First

1. `argo/index.html`
2. `argo/booking.html`
3. `argo/pricing.html`
4. `argo/vercel.json`
5. `argo/robots.txt`

## Do Not Assume

- do not assume this repo is the live Argo execution authority
- do not let this repo silently compete with the current Shuttleya Argo execution lane
- do not route new production bookings here unless the platform model is explicitly changed

## Practical Rule

This repo does not own booking execution unless explicitly stated.
Classify every Argo-facing change against the current Shuttleya execution corridor before shipping it.
