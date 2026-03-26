const SKILLS = [
"ai","ml","machinelearning","deeplearning",
"datascience","bigdata","analytics",
"cloud","aws","azure","gcp",
"devops","docker","kubernetes","jenkins","terraform",
"python","java","c","c++","javascript","typescript",
"react","angular","vue","node","express",
"spring","springboot","django","flask",
"mysql","postgresql","mongodb","redis","oracle",
"linux","git","github","gitlab",
"html","css","bootstrap","tailwind",
"pandas","numpy","tensorflow","pytorch","scikit",
"tableau","powerbi",
"graphql","rest","api",
"microservices","kafka","spark","hadoop",
"cybersecurity","networksecurity","cryptography",
"penetrationtesting","ethicalhacking"
];

/* synonyms */

const SYNONYMS = {
javascript:["js"],
machinelearning:["ml"],
datascience:["data science"],
bigdata:["big data"],
node:["nodejs"],
react:["reactjs"],
ai:["artificial intelligence"],
};

/* normalize */

function normalize(text){

return text
.toLowerCase()
.replace(/machine learning/g,"machinelearning")
.replace(/deep learning/g,"deeplearning")
.replace(/data science/g,"datascience")
.replace(/big data/g,"bigdata")
.replace(/artificial intelligence/g,"ai")
.replace(/node\.js/g,"node")
.replace(/react\.js/g,"react")
}

/* detect skills */

function detectSkills(text){

const cleaned = normalize(text);

const found = new Set();

SKILLS.forEach(skill=>{
if(cleaned.includes(skill))
found.add(skill);
});

/* synonym detection */

Object.entries(SYNONYMS).forEach(([skill,alts])=>{
alts.forEach(a=>{
if(cleaned.includes(a))
found.add(skill);
});
});

return [...found];

}

export default function analyze(resumeText,jdText){

const resumeSkills = detectSkills(resumeText);
const jdSkills = detectSkills(jdText);

const resumeSet = new Set(resumeSkills);

const matched=[];
const missing=[];

jdSkills.forEach(skill=>{
if(resumeSet.has(skill))
matched.push(skill);
else
missing.push(skill);
});

/* weighted score */

let score = Math.round(
(matched.length / Math.max(jdSkills.length,1)) * 100
);

/* small bonus if resume has many tech skills */

score += Math.min(resumeSkills.length * 2,20);

if(score>100) score=100;

return{
score,
matchedKeywords:matched,
missingKeywords:missing
};

}