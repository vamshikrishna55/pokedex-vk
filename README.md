# 🧭 Pokedex — React + TypeScript + Vite

[![CI](https://img.shields.io/badge/build-passing-22c55e)](#)
[![Vercel](https://img.shields.io/badge/hosted%20on-Vercel-000000)](#)
[![License](https://img.shields.io/badge/license-MIT-64748b)](LICENSE)

A clean, fast Pokedex with day/night UI, grouped type filters, base-form browsing, and hover GIFs (when available). Fully responsive (mobile + desktop).

---

## 🔗 Live Demo

**URL:** [https://your-vercel-domain.vercel.app](https://pokedex-vk.vercel.app/)  
**Video/GIF Preview:**

> Replace the file below with your own capture (see “How to add images/GIFs”).
>
> ![Pokedex Demo](./public/preview/pokedex-demo.gif)

---

## 🖼️ Screenshots

> Put your screenshots in `public/preview/` and update the paths.

<p align="center">
  <img src="./public/preview/home-dark.png" alt="Home (Dark)" width="48%" />
  <img src="./public/preview/home-light.png" alt="Home (Light)" width="48%" />
</p>

<p align="center">
  <img src="./public/preview/details-modal.png" alt="Details Modal" width="48%" />
  <img src="./public/preview/filters.png" alt="Type Filters" width="48%" />
</p>

---

## ✨ Features

- 🌗 **Day/Night toggle** with tasteful gradients
- 🔎 **Search** by base name; typing an evolved name smart-resolves its base form
- 🧩 **Type group filters** (e.g., *Water → (Water, Ice)*, *Psychic/Dark → (Psychic, Ghost, Dark)*)
- 🖼️ **Consistent card sizing** + hover scale
- 🌀 **Animated sprites on hover** (Gen V BW GIFs, with graceful fallback)
- 📱 **Responsive** (mobile & desktop)
- 🧰 Zero external UI frameworks—just small inline primitives

---

## 🧠 Tech Stack

- **React + TypeScript + Vite**
- **TailwindCSS** (utility classes)
- **PokeAPI** for data

---

## 🚀 Local Development

```bash
# 1) Install deps
npm install

# 2) Start dev server
npm run dev
# open the printed http://localhost:5173/

## 🧾 License

This project is licensed under the **MIT License**.  
See the full text in [`LICENSE`](./LICENSE).
