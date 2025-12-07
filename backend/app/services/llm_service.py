import google.generativeai as genai
import os
import json
import re

# Konfigurasi API Key
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

def generate_dynamic_questions(role, level, cv_text, skills_list):
    """
    Menggunakan Google Gemini 2.0 Flash Pro untuk generate pertanyaan.
    """
    
    # Cek jika API Key belum ada
    if not api_key:
        print("!!! ERROR FATAL: GEMINI_API_KEY belum di-set di .env !!!")
        return get_fallback_questions(role)

    try:
        # 1. Konfigurasi Model (Tuning untuk Gemini 2.0 Flash)
        # temperature 0.9 = Sangat kreatif (Pertanyaan akan sangat variatif/random)
        # top_p 0.95 = Fokus pada diksi yang natural
        generation_config = genai.GenerationConfig(
            temperature=0.9, 
            top_p=0.95,
            top_k=40,
            max_output_tokens=2000,
            response_mime_type="application/json", # Fitur JSON Mode native Gemini
        )

        # 2. Inisialisasi Model Pilihan
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=generation_config
        )

        # 3. Susun Prompt (Contextual)
        skills_str = ', '.join(skills_list) if skills_list else "Umum"
        cv_snippet = cv_text[:2000] # Gemini 2.0 punya context window besar, kita bisa kirim lebih banyak teks

        prompt = f"""
        Anda adalah Senior Technical Recruiter yang ahli. 
        Tugas Anda: Buat daftar pertanyaan wawancara unik untuk kandidat ini.

        PROFIL KANDIDAT:
        - Posisi Dilamar: {role}
        - Level: {level}
        - Skill Utama: {skills_str}
        - Ringkasan CV: {cv_snippet}

        INSTRUKSI KHUSUS:
        1. Buat pertanyaan yang MENGUJI VALIDITAS skill di CV (Contoh: Jika ada skill SQL, tanya kasus query spesifik).
        2. Gunakan metode STAR (Situation, Task, Action, Result) untuk pertanyaan perilaku.
        3. Sesuaikan kesulitan: 
           - Junior: Fokus fundamental & konsep dasar.
           - Senior: Fokus system design, problem solving kompleks, & manajemen.
        4. JANGAN GUNAKAN pertanyaan klise seperti "Apa kabar?". Langsung ke inti teknis/behavioral.
        5. BERIKAN VARIASI BARU setiap kali prompt ini dijalankan.

        JUMLAH SOAL:
        - Junior: 10 Soal
        - Senior: 15 Soal

        FORMAT OUTPUT:
        Hanya kembalikan Array JSON berisi string pertanyaan. 
        Contoh: ["Pertanyaan 1", "Pertanyaan 2", "Pertanyaan 3"]
        """

        # 4. Eksekusi Request
        print(f"Sedang menghubungi Gemini 2.0 Flash untuk role {role}...")
        response = model.generate_content(prompt)
        
        # 5. Parsing Hasil
        # Membersihkan markdown json jika masih ada (meski JSON Mode sudah aktif)
        text_response = response.text.strip()
        text_response = re.sub(r"```json|```", "", text_response).strip()
        
        questions_list = json.loads(text_response)
        
        print("✅ Sukses generate pertanyaan dinamis dengan Gemini 2.0!")
        return questions_list

    except Exception as e:
        print(f"\n❌ GEMINI ERROR: {str(e)}")
        print("⚠️ Menggunakan pertanyaan cadangan (Fallback)...\n")
        return get_fallback_questions(role)

def get_fallback_questions(role):
    """
    Bank soal cadangan yang lengkap (20 Soal) jika AI mati/error.
    """
    return [
        # --- BEHAVIORAL (5 Soal) ---
        f"Mengapa Anda tertarik melamar posisi {role} di perusahaan kami?",
        "Ceritakan tentang pencapaian terbesar dalam karir atau studi Anda.",
        "Bagaimana cara Anda menangani konflik dengan rekan kerja?",
        "Sebutkan kelebihan dan kekurangan terbesar Anda.",
        "Ceritakan situasi di mana Anda harus bekerja di bawah tekanan ketat.",
        
        # --- TEKNIS UMUM (5 Soal) ---
        "Bagaimana cara Anda menjaga kualitas kode (Clean Code)?",
        "Jelaskan alur kerja Git yang biasa Anda gunakan.",
        "Apa tantangan teknis tersulit yang pernah Anda hadapi dan solusinya?",
        "Bagaimana cara Anda belajar teknologi baru dengan cepat?",
        "Jelaskan konsep OOP (Object Oriented Programming) dengan bahasa Anda sendiri.",
        
        # --- TEKNIS SPESIFIK DATA/IT (10 Soal) ---
        "Apa perbedaan antara SQL dan NoSQL? Kapan menggunakan masing-masing?",
        "Jelaskan apa itu REST API dan bagaimana cara kerjanya.",
        "Bagaimana langkah Anda melakukan debugging jika program error?",
        "Apa itu Docker dan mengapa kita membutuhkannya?",
        "Jelaskan konsep CI/CD dalam pengembangan software.",
        "Bagaimana cara Anda menangani data yang kotor (Data Cleaning)?",
        "Jelaskan algoritma Machine Learning favorit Anda dan cara kerjanya.",
        "Apa itu Normalisasi Database dan mengapa itu penting?",
        "Bagaimana Anda mengoptimalkan query database yang lambat?",
        "Ceritakan proyek analisis data terakhir yang Anda kerjakan."
    ]