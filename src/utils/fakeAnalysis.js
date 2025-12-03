export async function simulateAnalysis(text) {
  // Simulate realistic pipeline delay
  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  const stages = [
    "Extracting text...",
    "Checking writing patterns...",
    "Running AI-authorship classifier...",
    "Analyzing coherence & structure...",
    "Evaluating grammar...",
    "Scanning for plagiarism...",
    "Checking factual reliability...",
    "Generating final report..."
  ];

  let progress = 0;

  // Fake progress generator
  async function* runPipeline() {
    for (let i = 0; i < stages.length; i++) {
      progress = Math.round(((i + 1) / stages.length) * 100);
      yield { stage: stages[i], progress };
      await wait(600 + Math.random() * 400); // 0.6–1 sec each stage
    }
  }

  // Fake output scores
  const results = {
    aiScore: Math.floor(20 + Math.random() * 50),         // 20–70
    plagiarism: Math.floor(5 + Math.random() * 15),       // 5–20
    coherence: Math.floor(70 + Math.random() * 20),       // 70–90
    grammar: Math.floor(80 + Math.random() * 15),         // 80–95
    readability: Math.floor(65 + Math.random() * 20),     // 65–85
    reliability: Math.floor(60 + Math.random() * 25),     // 60–85
    summary:
      Math.random() > 0.5
        ? "Mostly human-written with natural variation in style."
        : "Shows moderate AI-like patterns but still human-influenced."
  };

  return { runPipeline, results };
}
