from flask import Flask, request, jsonify
from supabase import create_client, Client

app = Flask(__name__)

# Supabase project info
SUPABASE_URL = 'https://umblwntwmhxwempxdrfm.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtYmx3bnR3bWh4d2VtcHhkcmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4NzU5NDgsImV4cCI6MjA1NTQ1MTk0OH0.SNhe6JMa7n0zm3gUjTVtST76CYp_Zl9oI868IHJtvJ4'
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


if __name__ == "__main__":
    app.run(debug=True)
