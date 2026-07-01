# Provenance

## Visual Background Layer

- Selected background: `generated/tanlong-hero-mill.png`
- Source image: `/Users/RenChengyuan/Desktop/Ebooks/tanlong-environment-website/assets/site/hero/hero-01-mill.png`
- Role: visual background only.
- Original Poten generated background is retained as `generated/background-poten-water-tech.png` for comparison, but is not used in the Tanlong composite.

## Deterministic Layers

- HTML/CSS composite: `composite.html`
- Tanlong brand lockup is rendered deterministically in HTML/CSS as `坦隆环境 / TANLONG ENVIRONMENT`.
- Final exact text, navigation, credibility label, CTA, metrics, and technology names are rendered by HTML/CSS, not by the image model.
- Poten version backup: `composite-poten.html` and `final/poten-home-hero-redesign-1920x1080.png`.

## Image Generation Runner Note

Creative Production `codex_exec_image_batch.py` was attempted first. The worker invoked native image generation, but the worker process did not receive a saveable image path and wrote failure JSON. The generated image files were later located under `.codex/generated_images/`, copied into this run directory, and used as the background layer.
