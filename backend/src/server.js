import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import mammoth from "mammoth";
import analyze from "./analyzer.js";

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

/* ---------- extract resume text ---------- */

async function extractText(filePath,fileName){

const ext = path.extname(fileName).toLowerCase();
const buffer = fs.readFileSync(filePath);

if(ext === ".pdf"){

const data = await pdf(buffer);
return data.text || "";

}

if(ext === ".docx"){

const result = await mammoth.extractRawText({buffer});
return result.value || "";

}

return buffer.toString();

}

/* ---------- health check ---------- */

app.get("/health",(req,res)=>{
res.json({status:"ok"});
});

/* ---------- analyze route ---------- */

app.post("/analyze",upload.single("resume"),async(req,res)=>{

try{

const jd = req.body.jobDescription;

if(!jd)
return res.status(400).json({error:"Job description required"});

if(!req.file)
return res.status(400).json({error:"Resume file required"});

const resumeText = await extractText(
req.file.path,
req.file.originalname
);

fs.unlink(req.file.path,()=>{});

/* run analyzer */

const result = analyze(resumeText,jd);

const matched = result.matchedKeywords;
const missing = result.missingKeywords;
const score = result.score;

/* suggestions */

const suggestions=[];

if(missing.length){

suggestions.push(
"Consider adding these keywords: " +
missing.slice(0,8).join(", ")
);

}

suggestions.push(
"Add measurable achievements (numbers or percentages)."
);

suggestions.push(
"Include a dedicated technical skills section."
);

/* response */

res.json({

score,
matchedKeywords:matched.slice(0,15),
missingKeywords:missing.slice(0,15),
suggestions

});

}catch(error){

res.status(500).json({
error:"Server error",
detail:String(error)
});

}

});

/* ---------- start server ---------- */

const PORT=5000;

app.listen(PORT,()=>{
console.log(`Backend running on http://localhost:${PORT}`);
});