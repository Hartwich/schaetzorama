# Open Party Lab: Schaetzorama

Schaetzorama is an optional Open Party Lab game package. Players estimate numbers, sort rankings, assign terms, and use copy jokers before the reveal.

## Local Development

```bash
npm install
npm run typecheck
npm run build
```

For local Platform integration, run this in the Party Platform repo:

```bash
cd ../..
npm run games:sync-local
npm run dev:all
```

The Platform links only game repos that exist locally. If this repo is not present, Schaetzorama is skipped.

## Public Entrypoints

```text
@open-party-lab/game-schaetzorama/manifest
@open-party-lab/game-schaetzorama/protocol
@open-party-lab/game-schaetzorama/server
@open-party-lab/game-schaetzorama/host
@open-party-lab/game-schaetzorama/controller
```

