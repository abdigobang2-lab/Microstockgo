/**
 * Microstockgo - Secure Gemini API Client & Admin Vault
 * 
 * Security Architecture:
 * - API Key is NEVER hardcoded in source files.
 * - Protected by Master Admin PIN (default: 1234).
 * - Stored only in user's local browser storage (localStorage).
 * - Automatic graceful fallback to MicrostockEngine if no key or offline.
 */

const GeminiVault = {
  STORAGE_KEY_API: "microstockgo_vault_gemini_key",
  STORAGE_KEY_PIN: "microstockgo_vault_admin_pin",
  DEFAULT_PIN: "1234",

  getPin() {
    return localStorage.getItem(this.STORAGE_KEY_PIN) || this.DEFAULT_PIN;
  },

  verifyPin(inputPin) {
    return (inputPin || "").trim() === this.getPin();
  },

  setPin(newPin) {
    if (!newPin || newPin.trim().length < 4) {
      throw new Error("PIN minimal harus 4 karakter/angka.");
    }
    localStorage.setItem(this.STORAGE_KEY_PIN, newPin.trim());
    return true;
  },

  hasKey() {
    const key = localStorage.getItem(this.STORAGE_KEY_API);
    return !!key && key.trim().length > 10;
  },

  getKey() {
    return localStorage.getItem(this.STORAGE_KEY_API) || "";
  },

  saveKey(apiKey) {
    if (!apiKey) {
      localStorage.removeItem(this.STORAGE_KEY_API);
      return true;
    }
    localStorage.setItem(this.STORAGE_KEY_API, apiKey.trim());
    return true;
  },

  clearKey() {
    localStorage.removeItem(this.STORAGE_KEY_API);
  },

  /**
   * Analyze topic with Gemini 1.5 Flash or Fallback
   */
  async analyzeWithGemini(topic, format, style, subjectMode, timeframe) {
    const apiKey = this.getKey();

    // If no API key configured, use built-in smart engine directly
    if (!apiKey) {
      console.log("[Microstockgo] Running in Built-in Offline Engine Mode");
      return MicrostockEngine.analyze(topic, format, style, subjectMode, timeframe);
    }

    try {
      console.log("[Microstockgo] Calling Google Gemini API...");
      const systemInstruction = `You are Microstockgo Pro, the world's leading microstock market intelligence analyst and stock SEO specialist. 
Your job is to analyze topics and generate commercial stock photography/video/vector production briefs.
Always return response in strict valid JSON format matching this schema:
{
  "topic": "${topic}",
  "demandScore": 92,
  "competitionScore": 30,
  "commercialTier": "Tier A (High Value)",
  "avgRPI": "$2.50 - $6.00",
  "goldenGap": true,
  "description": "Brief market explanation",
  "tagsCore": ["tag1", "tag2", ... 10 tags],
  "tagsSecondary": ["tag11", "tag12", ... 20 tags],
  "tagsBuyerIntent": ["tag31", ... 20 tags],
  "title": "Optimized stock title under 180 chars",
  "shotList": [
    {"angle": "Wide Establishing", "shot": "..."},
    {"angle": "Medium Interactive", "shot": "..."},
    {"angle": "Close-Up Copy Space", "shot": "..."},
    {"angle": "Over-the-Shoulder POV", "shot": "..."},
    {"angle": "Flat Lay / Isolated", "shot": "..."}
  ],
  "aiPrompts": {
    "image": "Midjourney v6 prompt with --ar and parameters",
    "video": "Kling / Runway 4K video prompt",
    "negative": "stock negative anti-defect prompt"
  },
  "editorialCaption": "Official editorial caption with CITY, COUNTRY - DATE: description",
  "safetyNotes": "IP and brand safety guidance"
}`;

      const userPrompt = `Analyze the microstock opportunity for:
Topic: "${topic}"
Target Asset Format: "${format}"
Style: "${style}"
Subject Mode: "${subjectMode}"
Seasonal Timeframe: "${timeframe}"

Provide commercial viability scores, 50 high-ranking SEO tags, 5 production shot variations, stock-ready Midjourney/Runway prompts, and commercial release guidance.`;

      // Call Gemini 1.5 Flash endpoint
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: {
            temperature: 0.4,
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!rawText) throw new Error("Empty response from Gemini");

      const parsed = JSON.parse(rawText);

      // Format agency keywords using engine helper
      parsed.selectedFormat = format;
      parsed.selectedStyle = style;
      parsed.selectedSubject = subjectMode;
      parsed.selectedTimeframe = timeframe;
      parsed.agencyKeywords = MicrostockEngine.formatAgencyKeywords(
        parsed.tagsCore || [],
        parsed.tagsSecondary || [],
        parsed.tagsBuyerIntent || []
      );
      parsed.safetyCheck = MicrostockEngine.scanTrademarkSafety(
        (parsed.topic || "") + " " + (parsed.tagsCore || []).join(" ")
      );

      return parsed;
    } catch (err) {
      console.warn("[Microstockgo] Gemini API failed or rate-limited. Falling back to Built-in Engine:", err.message);
      const fallbackResult = MicrostockEngine.analyze(topic, format, style, subjectMode, timeframe);
      fallbackResult._geminiNotice = `Gemini Notice: ${err.message}. Digantikan otomatis oleh Smart Built-in Engine.`;
      return fallbackResult;
    }
  }
};
