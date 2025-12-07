from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def calculate_score(question, answer):
    """
    Menghitung skor jawaban berdasarkan:
    1. Relevance (Cosine Similarity antara Pertanyaan & Jawaban)
    2. Clarity (Panjang jawaban yang memadai)
    """
    
    # 1. Hitung Relevance (Cosine Similarity)
    # Logika: Apakah user mengulang kata kunci dari pertanyaan? (Indikator nyambung basic)
    try:
        documents = [question, answer]
        tfidf_vectorizer = TfidfVectorizer()
        tfidf_matrix = tfidf_vectorizer.fit_transform(documents)
        
        # Hitung kemiripan (0.0 sampai 1.0)
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        relevance_score = round(similarity * 100, 2)
    except:
        relevance_score = 0

    # 2. Hitung Clarity (Berdasarkan Panjang Kata)
    # Asumsi: Jawaban yang baik minimal 10 kata, maksimal poin di 50 kata
    word_count = len(answer.split())
    if word_count < 5:
        clarity_score = 20
    elif word_count < 10:
        clarity_score = 50
    elif word_count < 30:
        clarity_score = 80
    else:
        clarity_score = 100

    # 3. Hitung Total Score (Bobot: 60% Relevansi + 40% Kejelasan)
    # Kita boost relevansi karena similarity teks pendek biasanya rendah
    boosted_relevance = min(relevance_score * 2, 100) 
    
    total_score = (boosted_relevance * 0.6) + (clarity_score * 0.4)

    return {
        "relevance": boosted_relevance,
        "clarity": clarity_score,
        "total": round(total_score, 2)
    }