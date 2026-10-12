import os
from google import genai
from dotenv import load_dotenv

# 1. تحميل متغيرات البيئة من ملف .env المحلي
load_dotenv()

# 2. قراءة مفتاح الـ API ونموذج الذكاء الاصطناعي المحدد في ملف البيئة
api_key = os.environ.get("GEMINI_API_KEY")
model_name = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")

if not api_key:
    raise ValueError("خطأ: مفتاح GEMINI_API_KEY غير موجود في ملف .env!")

# 3. تهيئة عميل الاتصال مع Google AI Studio
client = genai.Client(api_key=api_key)

def run_code_audit():
    """
    دالة فحص وتدقيق الأكواد البرمجية للبدء في ربط النظام 
    بقاعدة البيانات وجداول البيانات سحابياً.
    """
    try:
        # عينة كود برمجية لاختبار التدقيق المبدئي
        sample_code = """
        def calculate_total(price, tax):
            return price + (price * tax)
        """
        
        prompt = f"قم بمراجعة هذه الدالة المحاسبية واقترح تحسينات برمجية دقيقة:\n{sample_code}"

        # إرسال الطلب لنموذج Gemini
        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
        )

        print("--- نجح الاتصال واستلام نتيجة التدقيق البرمجي ---")
        print(f"النموذج المستخدم: {model_name}")
        print("نتيجة المراجعة:")
        print(response.text)

    except Exception as e:
        print(f"حدث خطأ أثناء الاتصال: {str(e)}")

if __name__ == "__main__":
    run_code_audit()