import { useState } from "react";

const API = "http://localhost:5000";

function ProgressRing({value}){

const radius = 44;
const circumference = 2 * Math.PI * radius;
const offset = circumference * (1 - value/100);

return(

<svg width="120" height="120">

<circle
cx="60"
cy="60"
r={radius}
stroke="#e5e7eb"
strokeWidth="10"
fill="none"
/>

<circle
cx="60"
cy="60"
r={radius}
stroke="#2563eb"
strokeWidth="10"
fill="none"
strokeDasharray={circumference}
strokeDashoffset={offset}
strokeLinecap="round"
/>

<text
x="60"
y="66"
textAnchor="middle"
fontSize="20"
fontWeight="700"
>
{value}%
</text>

</svg>

);

}

function Badge({text,type}){

const bg = type==="match" ? "#d1fae5" : "#fee2e2";
const color = type==="match" ? "#065f46" : "#991b1b";

return(

<span style={{
background:bg,
color:color,
padding:"6px 12px",
borderRadius:20,
margin:4,
fontSize:13
}}>
{text}
</span>

);

}

export default function App(){

const [file,setFile] = useState(null);
const [jd,setJd] = useState("");
const [result,setResult] = useState(null);
const [loading,setLoading] = useState(false);

async function analyze(){

setLoading(true);

const form = new FormData();
form.append("resume",file);
form.append("jobDescription",jd);

const res = await fetch(`${API}/analyze`,{
method:"POST",
body:form
});

const data = await res.json();

setResult(data);
setLoading(false);

}

return(

<div style={{
minHeight:"100vh",
padding:"60px",
fontFamily:"Segoe UI",
background:"linear-gradient(135deg,#e0f2fe,#f8fafc)"
}}>

<h1 style={{
fontWeight:900,
fontSize:40,
textTransform:"uppercase",
marginBottom:10
}}>
AI Resume Analyzer
</h1>

<p style={{color:"#555"}}>
Compare your resume against a job description.
</p>

<div style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:30,
marginTop:30
}}>

{/* input */}

<div style={{
background:"white",
padding:30,
borderRadius:16,
boxShadow:"0 20px 40px rgba(0,0,0,0.08)"
}}>

<h3>Upload Resume</h3>

<input
type="file"
onChange={e=>setFile(e.target.files[0])}
/>

<h3 style={{marginTop:20}}>Job Description</h3>

<textarea
rows="10"
value={jd}
onChange={e=>setJd(e.target.value)}
style={{
width:"100%",
padding:10,
borderRadius:8,
border:"1px solid #ddd"
}}
/>

<button
onClick={analyze}
style={{
marginTop:15,
width:"100%",
padding:12,
borderRadius:8,
border:"none",
background:"#111",
color:"white",
fontWeight:600
}}
>
{loading ? "Analyzing..." : "Analyze Resume"}
</button>

</div>

{/* results */}

<div style={{
background:"white",
padding:30,
borderRadius:16,
boxShadow:"0 20px 40px rgba(0,0,0,0.08)"
}}>

<h3>Results</h3>

{!result && <p style={{color:"#777"}}>Run analysis to see results.</p>}

{result && (

<>

<div style={{display:"flex",gap:20}}>
<ProgressRing value={result.score}/>
</div>

<h4 style={{marginTop:20}}>Matched Keywords</h4>

<div>
{result.matchedKeywords.map(k=>
<Badge key={k} text={k} type="match"/>
)}
</div>

<h4 style={{marginTop:20}}>Missing Keywords</h4>

<div>
{result.missingKeywords.map(k=>
<Badge key={k} text={k} type="missing"/>
)}
</div>

<h4 style={{marginTop:20}}>Suggestions</h4>

<ul>
{result.suggestions.map((s,i)=>
<li key={i}>{s}</li>
)}
</ul>

</>

)}

</div>

</div>

</div>

);

}