# Email Origin Reveal 🕵️‍♂️📧

**Email Origin Reveal** is a sophisticated forensic visualization tool designed to unearth the true history of forwarded email threads. 

Powered by the [**email-origin-chain**](https://github.com/yodjii/email-origin-chain) engine, this Next.js application reconstructs the complete lifecycle of a conversation, allowing you to visualize the path from the **Deep Source** (origin) down to the **Most Recent Message** (entry point).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/built%20with-Next.js%2015-black)
![Tailwind](https://img.shields.io/badge/styled%20with-Tailwind%20v4-38bdf8)

---

## ✨ Key Features

- **🔎 Forensic Reconstruction**: Automatically detects nested forwarded messages using a hybrid engine (MIME structure analysis + heuristic text parsing).
- **⚖️ Confidence Scoring**: Analyzes email density, sender consistency, and quote levels to provide a reliability index (0-100%).
- **⚠️ Security Alerts**: High-visibility warnings for low-confidence results (< 50%) with detailed explanation tooltips.
- **⏳ Chronological Visualization**: Displays the email chain in a logical flow from the original sender ("The Deep Source") to the final recipient ("Most Recent Message").
- **🛠️ Expert Debug Console**: A dedicated suite for developers including:
    - **JSON Viewer**: Access to the raw extraction data.
    - **Scoring Dashboard**: Visual reliability gauge and breakdown of triggered signals (bonuses/penalties).
    - **Audit Trail**: Step-by-step sequential transcription of the conversation hops.
    - **Source View**: Access to decoded MIME bodies and cleaned text.
- **📎 Asset Encapsulation**: Identifies and lists attachments present at each stage of the conversation history.
- **🛡️ Security Flags**: Highlights verification status (e.g., "Verified Meta" for MIME headers vs "Text Scan" for inline detection).
- **🎨 Premium UI**: A modern, responsive interface built with Tailwind CSS v4, featuring glassmorphism, micro-interactions, and dark mode support.
- **⚡ Local Processing**: All analysis happens server-side within the application API, ensuring fast and secure processing.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yodjii/email-origin-chain-frontend.git
   cd email-origin-reveal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. **Important**: This project currently relies on the `email-origin-chain` library. Ensure it is correctly linked or installed.
   *(In development mode, it may look for a local sibling directory).*

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Directory)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Lucide React (Icons)
- **Core Engine**: [email-origin-chain](https://github.com/yodjii/email-origin-chain)
- **Parsing**: `mailparser`, `email-forward-parser`

## 📸 Usage

1. **Paste Source**: Copy the raw content of an email (including headers ideally, or just the body) into the analyzer input.
2. **Analyze**: Click "Run Deep Trace".
3. **Review**: 
   - Scroll through the timeline starting from the **Deep Source**.
   - Inspect individual "Hops" to see intermediate senders and comments.
   - Check the **Most Recent Message** for the final context.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---
*Built with ❤️ by [Flo (yodjii)](https://github.com/yodjii)*
