# Service simulasi pertanyaan
def generate_interview_questions(role, level):
    """
    Menghasilkan daftar pertanyaan berdasarkan Role dan Level.
    Junior = 10 Soal
    Senior = 20 Soal
    """
    
    # 1. Definisi Soal Dasar (Umum untuk semua role)
    base_questions = [
        "Jelaskan secara singkat tentang diri Anda?",
        f"Mengapa Anda tertarik melamar sebagai {role}?",
        "Apa kelebihan dan kekurangan terbesar Anda?",
        "Ceritakan pengalaman Anda dalam menyelesaikan masalah teknis yang sulit.",
        "Bagaimana cara Anda belajar teknologi baru?",
        "Apa pencapaian terbesar Anda sejauh ini?",
        "Bagaimana Anda menangani tekanan deadline?",
        "Apakah Anda lebih suka bekerja sendiri atau dalam tim?",
        "Apa motivasi Anda bekerja di perusahaan ini?",
        "Apakah ada pertanyaan yang ingin Anda ajukan kepada kami?"
    ]

    # 2. Definisi Soal Teknis (Spesifik IT)
    technical_questions = [
        "Jelaskan perbedaan antara SQL dan NoSQL.",
        "Apa itu REST API dan bagaimana cara kerjanya?",
        "Bagaimana cara Anda menangani data yang hilang (missing values)?",
        "Jelaskan konsep OOP (Object Oriented Programming).",
        "Apa yang Anda ketahui tentang Git dan Version Control?",
        "Jelaskan siklus hidup pengembangan software (SDLC).",
        "Bagaimana Anda memastikan kode Anda bersih dan mudah dipelihara?",
        "Sebutkan tools atau framework favorit Anda dan alasannya.",
        "Bagaimana cara Anda melakukan debugging jika terjadi error?",
        "Apa itu Containerization (Docker) dan kegunaannya?"
    ]

    # 3. Gabungkan Semua Soal
    all_questions = base_questions + technical_questions

    # 4. Tentukan Limit berdasarkan Level
    # Junior = 10 soal pertama (base_questions)
    # Senior = 20 soal (semuanya)
    limit = 10 if level == 'Junior' else 20
    
    # Kembalikan hasil potongan list
    return all_questions[:limit]