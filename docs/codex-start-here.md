# Codex Start Here

## What This Repo Is

`dcc-argo` is Argo-specific support code and static site content.
Its first job is to declare whether it is active production infrastructure, supporting code, or an old experiment.

## Role In The System

- role: `argo-support`
- current live proof-corridor execution runs through `destinations-cc -> Shuttleya -> /checkout`
- do not assume this repo is the live execution authority

## Booking Impact

- `potentially conflicting`
- if this repo is treated as live booking entry, it can compete with the Shuttleya-owned Argo corridor

## Do Not Touch Until Classified

- booking entrypoints
- reservation calls or forms
- Argo handoff contracts
- any runtime that conflicts with Shuttleya-owned execution authority

## Read These Next

1. `README.md`
2. `argo/index.html`
3. `argo/booking.html`
4. `argo/pricing.html`
5. `argo/vercel.json`

## Practical Rule

Do not let this repo silently compete with the current Argo execution corridor.
