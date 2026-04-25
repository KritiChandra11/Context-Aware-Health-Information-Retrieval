# Context-Aware-Health-Information-Retrieval

Since you’ve built a sophisticated **Multimodal RAG (Retrieval-Augmented Generation) Healthcare System**, your README needs to look professional to impress anyone visiting your profile. 

A great README tells a story: **What** is it? **How** does it work? and **Why** did you build it?

Here is a proper, high-quality template you can paste into your `README.md` file.

---

# 🩺 MediScan AI: Multimodal Health Analysis & RAG Assistant

**MediScan AI** is a next-generation healthcare dashboard that leverages **Generative AI** and **Semantic Search** to bridge the gap between complex medical reports and patient understanding. By combining computer vision with a specialized knowledge base, the system provides accurate interpretations, multi-language support, and technical system analytics.



## 🌟 Key Features

* **Multimodal Report Analysis:** Upload X-rays, blood reports, or scans. The system uses **Gemini 2.5 Flash Vision** to extract diagnostic data directly from images.
* **Semantic RAG (Retrieval-Augmented Generation):** A custom vector-based search engine that compares user queries against verified medical documents using **Cosine Similarity**.
* **Administrative Analytics:** Real-time monitoring of API latency, compute overhead, and semantic confidence thresholds.
* **Interactive Chatbot:** A patient-centric assistant that provides educational context and suggests follow-up questions for doctors.
* **Global Accessibility:** Instant translation of complex summaries into Hindi, Tamil, Spanish, and French.
* **One-Click Export:** Generate professional PDF summaries of AI interpretations.

---

## 🏗️ Technical Architecture

The system is built on a modern **Full-Stack JavaScript** stack designed for low latency and high reliability.



* **Frontend:** React.js, Tailwind CSS (for glassmorphic UI), Lucide Icons, and Recharts.
* **Backend:** Node.js & Express.
* **AI Engine:** Google Gemini 2.5 Flash (Multimodal & NLP).
* **Knowledge Base:** In-memory Vector Store with 1536-dimensional embeddings.
* **Middleware:** Custom retry logic and error-handling for API resilience.

---

## 📊 System Engineering Dashboard

We prioritize transparency. The **Admin Cockpit** provides deep-level insights into how the AI is performing:
* **Semantic Threshold:** Set at `0.45` to ensure high-precision document retrieval.
* **Performance Metrics:** Breakdown of API vs. Network latency to ensure a responsive user experience.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mediscan-ai.git
   cd mediscan-ai
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Create a .env file and add your GEMINI_API_KEY
   node index.js
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 🛡️ Disclaimer
*This project is for educational purposes and uses AI to interpret data. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider.*

---

