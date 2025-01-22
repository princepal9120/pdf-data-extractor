# PDF Data Extraction

This project allows users to upload a PDF file, extract specific information (such as name, address, phone, email, and role) from the text, and display it on the frontend.

## How It Works ⚙️

1. **Upload PDF**: Users can upload a PDF file using the file input on the frontend.
2. **Convert to Base64**: The PDF file is converted to a Base64 string using `FileReader`.
3. **Send to Backend**: The Base64 string is sent to the backend server using `Axios`.
4. **Extract Text**: The backend server decodes the Base64 string and extracts text from the PDF using `pdf-lib`.
5. **Extract Information**: The backend server extracts specific information (name, address, phone, email, role) from the text using regular expressions.
6. **Display Information**: The extracted information is sent back to the frontend and displayed to the user.

## Features

- PDF file upload interface
- Text extraction from PDFs
- NLP-based name and address detection
- Regex-based phone/email extraction
- Clean responsive UI
- Error handling and loading states

## Tech Stack

**Frontend:**  
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

**Backend:**  
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)

**Libraries:**  
![PDF Parse](https://img.shields.io/badge/PDF_Parse-FF6C37)
![Compromise.js](https://img.shields.io/badge/Compromise.js-000000)

## Setup Instructions

### 1. Prerequisites

- Node.js v16+
- npm v8+

### 2. Clone Repository

```bash
git clone https://github.com/your-username/pdf-data-extractor.git
cd pdf-data-extractor
```

## 3. Backend Setup

```bash
cd backend
npm install
node server.js
```

## 4. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

# Api Reference

Post/extract

```bash
Request Body:
{
  "file": "base64_encoded_pdf"
}

Response:
{
  "Name": "John Doe",
  "Phone": "+1-234-567-8901",
  "Address": "123 Main St, City",
  "Email": "john@example.com",
  "Role": "Software Engineer"
}

```
