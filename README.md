# 🚀 AI Mock Interview System (AI-MIS)

![Status](https://img.shields.io/badge/Status-Active_Development-success?style=flat&logo=git)
![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat&logo=postgresql&logoColor=white)
![Gemini](https://img.shields.io/badge/AI-Google_Gemini-8E75B2?style=flat&logo=google&logoColor=white)

> **Sistem Simulasi Wawancara Kerja Cerdas Berbasis Large Language Model (LLM) dan Natural Language Processing (NLP).**

---

## Tentang Proyek

**AI Mock Interview System** adalah platform simulasi wawancara kerja yang dirancang untuk membantu mahasiswa dan pencari kerja melatih kesiapan karir mereka. Tidak seperti simulasi konvensional, sistem ini bersifat **adaptif** dan **personal**.

Sistem membaca CV pengguna, memahami skill yang dimiliki, lalu bertindak sebagai HRD virtual yang memberikan pertanyaan dinamis (tidak statis/template) menggunakan kekuatan **Google Gemini**. Simulasi dilakukan secara interaktif menggunakan suara (*Voice-to-Voice*), memberikan pengalaman yang mendekati wawancara nyata.

---

##  Fitur Unggulan

### 1. Intelligent CV Analysis (NLP)
Sistem tidak hanya menyimpan CV, tetapi "membacanya".
* **Parsing:** Ekstraksi teks otomatis dari format PDF menggunakan `PyMuPDF`.
* **Entity Recognition:** Menggunakan model **IndoBERT** untuk mendeteksi *Hard Skill* spesifik (misal: Python, Tableau, SQL) dari teks CV.

### 2. Dynamic Interviewer (Generative AI)
Didukung oleh **Google Gemini 1.5 Flash**, sistem mampu:
* Menghasilkan pertanyaan yang 100% unik setiap sesi.
* Menyesuaikan pertanyaan dengan **Role** (Posisi) dan **Level** (Junior/Senior).
* Melakukan validasi mendalam terhadap klaim skill di CV.

### 3. Voice Interaction Experience
Interaksi bebas genggam (*Hands-free*) layaknya berbicara dengan manusia:
* **Text-to-Speech (TTS):** Pertanyaan dibacakan oleh browser.
* **Speech-to-Text (STT):** Pengguna menjawab menggunakan suara yang langsung ditranskripsi menjadi teks secara *real-time*.

### 4. Automated Scoring & Feedback
Penilaian instan tanpa campur tangan manusia:
* **Relevansi Jawaban:** Menggunakan algoritma *Cosine Similarity* (TF-IDF).
* **Analisis STAR:** Mengevaluasi struktur jawaban (Situation, Task, Action, Result).
* **Visualisasi Data:** Grafik perkembangan skill dan riwayat skor.

---

## Arsitektur Sistem

Berikut adalah alur kerja data dari pengguna hingga pemrosesan AI:

```mermaid
graph TD
    User([User / Candidate]) -->|Upload CV| Frontend
    User -->|Voice Answer| Frontend
    
    subgraph Frontend [React + Vite]
        UI[User Interface]
        STT[Speech Recognition]
        TTS[Text to Speech]
    end
    
    Frontend -->|API Request| Backend
    
    subgraph Backend [Flask API]
        Controller[Route Handlers]
        Auth[JWT Authentication]
        
        subgraph Services
            Parser[PDF Parser]
            NLP[IndoBERT NER]
            Scoring[Scikit-Learn Evaluation]
            LLM_Svc[Gemini Service]
        end
        
        Controller --> Services
    end
    
    subgraph External_AI [AI Models]
        Gemini[Google Gemini API]
        HuggingFace[IndoBERT Model]
    end
    
    subgraph Database
        Postgres[(PostgreSQL)]
    end
    
    LLM_Svc <--> Gemini
    NLP <--> HuggingFace
    Backend <--> Postgres
