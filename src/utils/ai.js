export const fetchCredibilityResult = async (articleText) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const prompt = `
You are a world-class misinformation analyst AI. Evaluate the following article or text and determine whether it's credible or likely to be false or misleading.

Instructions:
1. Search across all available reputable and official sources on the internet.
2. Check for the following:
   - Verifiable citations and sources.
   - Evidence of bias or emotional manipulation.
   - Alignment with known expert consensus.
   - Contradictions of factual historical or scientific data.
3. Give a credibility score between 0–100.
4. If score is below 90, mark as: ❌ Potentially Fake or Misleading
   If score is 90 and above, mark as: ✅ Trusted
5. Provide a short summary of your analysis and the reasons for the score.
6. Use clear structured formatting for response.

Now analyze this text:
"""
${articleText}
"""`;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No result";
    return textOutput;
  } catch (error) {
    console.error("AI Fetch Error:", error);
    return "Error analyzing article. Please try again later.";
  }
};
