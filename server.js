// server.js
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.static(".")); // serves button2.html + json

const JOURNEY_PATH = path.resolve("./elyx_journey_json.json");
let JOURNEY = JSON.parse(fs.readFileSync(JOURNEY_PATH, "utf8"));
let DOCS = [];
let VECTORS = []; // embeddings

// --- Build docs from JSON ---
function buildDocs() {
  DOCS = [];
  DOCS.push({
    id: "stats",
    text: `Summary Stats:
Total messages: ${JOURNEY.summary_stats.total_messages}
Doctor hours: ${JOURNEY.summary_stats.doctor_hours}
Coach hours: ${JOURNEY.summary_stats.coach_hours}
Avg adherence: ${JOURNEY.summary_stats.average_adherence}
Weight change: ${JOURNEY.summary_stats.total_weight_loss}
Final HbA1c: ${JOURNEY.summary_stats.final_hba1c}
Weeks tracked: ${JOURNEY.summary_stats.weeks_tracked}
Final BP: ${JOURNEY.summary_stats.final_bp}`
  });

  const weeks = JOURNEY.conversations_by_week || {};
  for (const wk in weeks) {
    const w = weeks[wk];
    (w.messages || []).forEach((m, i) => {
      DOCS.push({
        id: `${wk}-${i}`,
        text: `Week: ${wk} | Phase: ${w.phase} | Date: ${m.date} ${m.time} | ${m.sender}: ${m.message}`
      });
    });
  }
}
buildDocs();

// --- Ollama helpers ---
async function ollamaEmbed(texts){
  const res = await fetch("http://localhost:11434/api/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "nomic-embed-text", input: texts })
  });
  const j = await res.json();
  return j.embeddings; // array of arrays
}
async function ollamaChat(system, messages){
  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.1:8b-instruct",
      options: { temperature: 0.2 },
      messages: [{role:"system",content:system}, ...messages]
    })
  });
  const j = await res.json();
  return j?.message?.content || "…";
}
function cosSim(a,b){
  let s=0,na=0,nb=0;
  for(let i=0;i<a.length;i++){ s+=a[i]*b[i]; na+=a[i]*a[i]; nb+=b[i]*b[i]; }
  return s / (Math.sqrt(na)*Math.sqrt(nb) + 1e-9);
}

// --- Precompute embeddings (once) ---
async function ensureEmbeddings(){
  if (VECTORS.length === DOCS.length) return;
  const batchSize = 64;
  VECTORS = [];
  for (let i=0;i<DOCS.length;i+=batchSize){
    const chunk = DOCS.slice(i, i+batchSize).map(d=>d.text);
    const embs = await ollamaEmbed(chunk);
    VECTORS.push(...embs);
  }
}
await ensureEmbeddings();

// --- RAG endpoint ---
app.post("/ask", async (req,res) => {
  try{
    const question = (req.body?.question || "").slice(0, 2000);
    if (!question) return res.json({ answer: "Please ask a question." });

    // Retrieve top-k by cosine similarity
    const qVec = (await ollamaEmbed([question]))[0];
    const scored = DOCS.map((d, i) => ({ i, s: cosSim(qVec, VECTORS[i]) }))
                       .sort((a,b)=>b.s-a.s)
                       .slice(0, 12);

    const context = scored.map((x,idx)=>`[${idx+1}] ${DOCS[x.i].text}`).join("\n");

    const system = `You answer ONLY from the provided context about Rohan's 8-month Elyx journey.
If unknown, say "I don't know based on the provided data."
Cite bracket indices like [2],[5] for facts. Be accurate and concise.`;

    const answer = await ollamaChat(system, [
      { role: "user", content: `Context:\n${context}\n\nQuestion: ${question}\nAnswer:`}
    ]);

    res.json({ answer });
  }catch(e){
    console.error(e);
    res.status(500).json({ answer: "Error computing answer." });
  }
});

const PORT = 3000;
app.listen(PORT, ()=> console.log(`Local RAG server on http://localhost:${PORT}`));
