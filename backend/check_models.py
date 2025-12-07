import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load API Key
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ ERROR: API Key tidak ditemukan di .env!")
else:
    print(f"✅ API Key ditemukan: {api_key[:5]}...*****")
    
    try:
        genai.configure(api_key=api_key)
        print("\n🔍 Mencari model yang tersedia...")
        
        # List semua model
        found = False
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
                found = True
        
        if not found:
            print("⚠️ Tidak ada model generateContent yang ditemukan. Cek kuota/API Key.")
            
    except Exception as e:
        print(f"❌ Koneksi Gagal: {e}")