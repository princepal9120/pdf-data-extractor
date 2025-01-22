from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import spacy
import re
import logging

app = Flask(__name__)
CORS(app)

# Set up logging
logging.basicConfig(level=logging.INFO)

# Load spaCy NLP model
nlp = spacy.load("en_core_web_sm")

def extract_text_from_pdf(pdf_file):
    """Extracts text from a PDF file."""
    text = ""
    with pdfplumber.open(pdf_file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            text += page_text
    return text.strip()

def extract_name_and_address(text):
    """Extracts name and address from the text."""
    doc = nlp(text)
    name = None
    address = None

    # Extract named entities for PERSON (name) and GPE/LOC (address)
    for ent in doc.ents:
        if ent.label_ == "PERSON" and not name:
            name = ent.text
        elif ent.label_ in ["GPE", "LOC"] and not address:
            address = ent.text

    if not name:
        name = "Name Not Found"
    if not address:
        address = "Address Not Found"
    
    # Further refine address extraction by looking for common address keywords
    address_keywords = ["street", "road", "avenue", "lane", "blvd", "city", "district"]
    if not address or all(keyword.lower() not in address.lower() for keyword in address_keywords):
        address = "Address Not Found or Incomplete"

    return name, address

def extract_phone(text):
    """Extracts phone number from the text."""
    phone = None
    phone_pattern = r"(\(?\+?\d{1,2}\)?[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}|\d{10})"
    phone_match = re.search(phone_pattern, text)
    if phone_match:
        phone = phone_match.group(1)
    if not phone:
        phone = "Phone Not Found"
    return phone

def extract_email(text):
    """Extracts email address from the text."""
    email = None
    email_pattern = r"([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zAZ]{2,})"
    email_match = re.search(email_pattern, text)
    if email_match:
        email = email_match.group(1)
    if not email:
        email = "Email Not Found"
    return email

def extract_role(text):
    """Extracts the job role from the text using noun chunks and context."""
    doc = nlp(text)
    roles_found = []

    # Define a list of potential roles based on common job titles
    possible_roles = ["Software Developer", "Engineer", "Manager", "Consultant", "Analyst", "Designer", "Developer", "Specialist", "Leader", "Coordinator"]

    # Search for noun chunks that could represent a job title
    for chunk in doc.noun_chunks:
        chunk_text = chunk.text.lower()
        for role in possible_roles:
            if role.lower() in chunk_text:
                roles_found.append(role)

    # If roles were found, return the first match, else return "Role Not Found"
    if roles_found:
        return roles_found[0]
    else:
        return "Role Not Found"

@app.route("/extract", methods=["POST"])
def extract():
    """API endpoint to extract information from uploaded PDF."""
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    try:
        extracted_text = extract_text_from_pdf(file)
        if not extracted_text:
            return jsonify({"error": "No text extracted from the file"}), 400
        
        # Extract name, address, phone, and role
        name, address = extract_name_and_address(extracted_text)
        phone = extract_phone(extracted_text)
        email = extract_email(extracted_text)
        role = extract_role(extracted_text)

        # Prepare response data
        data = {
            "Name": name,
            "Address": address,
            "Phone": phone,
            "Email": email,
            "Role": role
        }

        # Log the extracted information
        logging.info(f"Extracted Data: {data}")

        return jsonify(data)
    
    except Exception as e:
        logging.error(f"Error during extraction: {str(e)}")
        return jsonify({"error": f"Error during extraction: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
