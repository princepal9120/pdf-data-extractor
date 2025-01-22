# PDF Data Extractor 📝

## Overview
**PDF Data Extractor** is a Flask-based web application designed to automatically extract important details from PDF files, including Name, Address, Phone Number, Email, and Job Role. It uses the power of **spaCy** NLP for named entity recognition and **pdfplumber** for efficient text extraction from PDFs.

The app provides a simple API for users to upload PDF files and retrieve the extracted data in a structured format. Whether you need to process resumes, business cards, or any other document containing personal information, this tool has got you covered! 🚀

## Features ✨
- **PDF File Upload**: Upload PDF files for processing.
- **Text Extraction**: Efficient text extraction from PDFs using **pdfplumber**.
- **NLP-Powered Data Extraction**: Leverages **spaCy** to extract structured data like name, address, phone, email, and role.
- **Error Handling**: Graceful error messages for missing or invalid files.
- **Cross-Origin Resource Sharing (CORS)**: Supports client-side applications with CORS.

## Tech Stack 🛠️
- **Backend**: Flask
- **NLP**: spaCy (en_core_web_sm model)
- **PDF Extraction**: pdfplumber
- **Deployment**: Render for cloud hosting
- **Other Tools**: Regular expressions for phone and email extraction

## Setup 🏁

### Prerequisites 📋
Before getting started, ensure you have **Python 3.x** installed on your system.

### Installation 🔧

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <project-directory>
