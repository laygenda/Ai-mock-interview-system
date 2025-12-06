import re
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from collections import Counter

# Library "Berat" untuk Deep Learning
from transformers import pipeline
import torch

# --- 1. INISIALISASI MODEL ---
print("Sedang memuat model NLP... Mohon tunggu sebentar.")

# A. Sastrawi (Stemming Indonesia)
factory = StemmerFactory()
stemmer = factory.create_stemmer()

# B. NLTK (Stopwords)
try:
    stop_words = set(stopwords.words('indonesian') + stopwords.words('english'))
except LookupError:
    import nltk
    nltk.download('stopwords')
    nltk.download('punkt')
    stop_words = set(stopwords.words('indonesian') + stopwords.words('english'))

# C. IndoBERT untuk NER
ner_pipeline = pipeline(
    "token-classification", 
    model="cahya/bert-base-indonesian-NER", 
    tokenizer="cahya/bert-base-indonesian-NER",
    aggregation_strategy="simple"
)

# --- 2. FUNGSI UTAMA ---

def preprocess_text(text):
    """Cleaning, Tokenization, Stemming"""
    if not text:
        return "", []

    text = text.lower()
    text = re.sub(r'[^a-z\+\#\s]', ' ', text)
    tokens = word_tokenize(text)
    filtered_tokens = [word for word in tokens if word not in stop_words]

    stemmed_tokens = []
    for i, word in enumerate(filtered_tokens):
        if i < 50: # Batasi stemming agar cepat
            stemmed_tokens.append(stemmer.stem(word))
        else:
            stemmed_tokens.append(word)

    clean_text = " ".join(stemmed_tokens)
    return clean_text, stemmed_tokens

def extract_skills_with_bert(raw_text):
    """NER menggunakan IndoBERT"""
    text_sample = raw_text[:1000] # Batasi input
    entities = ner_pipeline(text_sample)
    
    detected_skills = []
    
    # 1. Ambil dari AI
    for entity in entities:
        if entity['entity_group'] in ['ORG', 'PRO', 'PPL']: 
            detected_skills.append(entity['word'])
            
    # 2. Hybrid Keyword Matching
    tech_keywords = [
        "python", "java", "sql", "html", "css", "javascript", "react", "flask",
        "aws", "docker", "kubernetes", "git", "scikit-learn", "tensorflow",
        "tableau", "excel", "powerbi", "machine learning", "data analysis",
        "postgre", "mysql", "api"
    ]
    
    lower_text = raw_text.lower()
    for tech in tech_keywords:
        if tech in lower_text:
            detected_skills.append(tech)
            
    unique_skills = list(set([s.lower() for s in detected_skills]))
    return unique_skills

def extract_top_keywords(tokens):
    """Keyword Extraction Sederhana"""
    counter = Counter(tokens)
    most_common = counter.most_common(10)
    keywords = [word for word, count in most_common]
    return keywords