# n8n-nodes-apivault-tiktok-shadowban

An [n8n](https://n8n.io) community node for the **TikTok Shadow Ban Checker** — check whether TikTok videos are being suppressed (shadow-banned) using multi-signal detection, with a health score, engagement rate, viral potential and actionable recommendations per video.

No TikTok API key. Pay-as-you-go, no monthly subscription. The detection (residential proxy rotation, multiple fetch strategies, embedded-JSON parsing, signal aggregation) runs server-side on [Apify](https://apify.com); this node is a thin connector you drive with your own Apify API token.

Built by **[apivault_labs](https://apify.com/apivault_labs)** — see [all our actors](https://apify.com/apivault_labs).

## What you get per video

- **`shadowbanned`** verdict + the individual signals behind it
- **Health score** and **engagement rate**
- **Viral potential** estimate
- **`recommendations`** — specific advice based on detected signals (e.g. re-enable comments, change posting pattern)
- Optional **batch summary** across all checked videos

## Installation

In your n8n instance:

1. Go to **Settings → Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-apivault-tiktok-shadowban`
4. Confirm and install

## Credentials

This node uses an **Apify API token**:

1. Create a free account at [apify.com](https://apify.com)
2. Go to **Apify Console → Settings → Integrations** and copy your **API token**
3. In n8n, create new **Apify API** credentials and paste the token

A free Apify account includes monthly usage credits.

## Usage

- **Video URLs** — one or more TikTok video URLs (full or `vm.tiktok.com` short links), separated by commas or new lines
- **Proxy Country** — ISO 2-letter code for the residential proxy (default `US`)
- **Include Recommendations** — add per-video advice
- **Include Batch Summary** — append a summary record across all videos
- **Max Retries** — per-URL retry attempts with a fresh proxy IP

Each video produces one output item.

## Pricing

Billed per check through Apify (pay-per-event): **$10 / 1,000 videos** ($0.01 each). You only pay for videos actually checked.

## Use cases

- **Creator self-audit** — confirm whether a flat video is suppressed
- **Agency reporting** — batch-check a client's recent posts
- **Brand safety** — verify partner content is discoverable before paying
- **Posting-strategy tuning** — act on the recommendations per video

## Resources

- [TikTok Shadow Ban Checker actor on Apify](https://apify.com/apivault_labs/tiktok-shadow-ban-checker)
- [All actors by apivault_labs](https://apify.com/apivault_labs)
- Prefer Python? Use the [Python SDK](https://github.com/apivault-labs/tiktok-shadow-ban-checker-python)
- [n8n community nodes docs](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE)

## Keywords

`tiktok` `tiktok-shadow-ban` `tiktok-shadowban-checker` `shadow-ban-detection` `tiktok-fyp-checker` `creator-analytics` `tiktok-video-health` `engagement-rate` `brand-safety` `n8n` `apify`
