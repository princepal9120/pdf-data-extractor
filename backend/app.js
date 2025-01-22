const express = require("express");
const cors = require("cors");
const pdf = require("pdf-parse");
const natural = require("natural");
const compromise = require("compromise");
const path = require('path')

const app = express();
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    })
);
const _dirname = path.resolve();

app.use(express.json({ limit: "10mb" }));

// Helper function to extract text from PDF
async function extractTextFromPDF(pdfBuffer) {
    try {
        const data = await pdf(pdfBuffer);
        return data.text;
    } catch (error) {
        console.error("Error extracting text from PDF:", error);
        throw new Error("Failed to extract text from PDF");
    }
}

// Extract name and address using NLP
function extractNameAndAddress(text) {
    const doc = compromise(text);
    let name = "Name Not Found";
    let address = "Address Not Found";

    const people = doc.people().out("array");
    if (people.length > 0) {
        name = people[0];
    }

    const addressKeywords = ["street", "road", "avenue", "lane", "blvd", "city", "district"];
    const sentences = text.split(". ");
    for (const sentence of sentences) {
        if (addressKeywords.some((keyword) => sentence.toLowerCase().includes(keyword))) {
            address = sentence;
            break;
        }
    }

    return { name, address };
}

// Extract phone number using regex
function extractPhone(text) {
    const phonePattern = /(\(?\+?\d{1,2}\)?[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}|\d{10})/;
    const phoneMatch = text.match(phonePattern);
    return phoneMatch ? phoneMatch[0] : "Phone Not Found";
}

// Extract email using regex
function extractEmail(text) {
    const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    const emailMatch = text.match(emailPattern);
    return emailMatch ? emailMatch[0] : "Email Not Found";
}

// Extract role using NLP
function extractRole(text) {
    const possibleRoles = [
        "Software Developer",
        "Engineer",
        "Manager",
        "Consultant",
        "Analyst",
        "Designer",
        "Developer",
        "Specialist",
        "Leader",
        "Coordinator",
    ];

    const doc = compromise(text);
    for (const role of possibleRoles) {
        if (text.toLowerCase().includes(role.toLowerCase())) {
            return role;
        }
    }

    return "Role Not Found";
}

// API endpoint to extract information from uploaded PDF
app.post("/extract", async (req, res) => {
    if (!req.body.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const pdfBuffer = Buffer.from(req.body.file, "base64");
        const extractedText = await extractTextFromPDF(pdfBuffer);

        if (!extractedText) {
            return res.status(400).json({ error: "No text extracted from the file" });
        }

        // Extract name, address, phone, email, and role
        const { name, address } = extractNameAndAddress(extractedText);
        const phone = extractPhone(extractedText);
        const email = extractEmail(extractedText);
        const role = extractRole(extractedText);


        const data = {
            Name: name,
            Address: address,
            Phone: phone,
            Email: email,
            Role: role,
        };

        // Log the extracted information
        console.log("Extracted Data:", data);

        return res.json(data);
    } catch (error) {
        console.error("Error during extraction:", error);
        return res.status(500).json({ error: `Error during extraction: ${error.message}` });
    }
});

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"))
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});