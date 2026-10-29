import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from .env file
load_dotenv()

SUPABASE_URL: str = os.getenv("SUPABASE_URL", "").strip()
SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "").strip()

if not SUPABASE_URL or not SUPABASE_KEY:
    print("\n" + "=" * 60)
    print("⚠️  MISSING SUPABASE CREDENTIALS in backend/.env")
    print("Please set SUPABASE_URL and SUPABASE_KEY to connect to your database.")
    print("=" * 60 + "\n")

# Initialize the Supabase Client
# If credentials are not yet set, we use dummy values to avoid crashing at startup
supabase: Client = create_client(
    SUPABASE_URL or "https://placeholder.supabase.co",
    SUPABASE_KEY or "placeholder-key"
)

