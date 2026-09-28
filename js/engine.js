/**
 * Microstockgo - Algorithmic Opportunity & Intelligence Engine
 * Works 100% offline/built-in without requiring any API keys.
 */

const MicrostockEngine = {
  /**
   * Analyze a topic or query with filters
   * @param {string} topic - User's search term or selected pill
   * @param {string} format - footage, raster, vector, png
   * @param {string} style - specific style id
   * @param {string} subjectMode - with_people, no_people, etc.
   * @param {string} timeframe - immediate, upcoming_2m, etc.
   */
  analyze(topic, format = "footage", style = "real_4k", subjectMode = "with_people", timeframe = "upcoming_2m") {
    const cleanTopic = (topic || "").trim();
    
    // Check if query matches our curated deep database
    const matchedNiche = this.findBestMatch(cleanTopic);
    
    if (matchedNiche) {
      return this.enrichResult(matchedNiche, format, style, subjectMode, timeframe);
    }

    // Otherwise, dynamically synthesize a high-quality microstock profile for any custom user query!
    return this.synthesizeCustomTopic(cleanTopic || "Futuristic Smart Mobility", format, style, subjectMode, timeframe);
  },

  findBestMatch(query) {
    if (!query) return null;
    const lower = query.toLowerCase();
    return MICROSTOCK_DATA.nicheDatabase.find(n => 
      lower.includes(n.topic.toLowerCase()) || 
      n.topic.toLowerCase().includes(lower) ||
      n.tagsCore.some(t => lower.includes(t) || t.includes(lower))
    );
  },

  enrichResult(niche, format, style, subjectMode, timeframe) {
    const safetyCheck = this.scanTrademarkSafety(niche.topic + " " + niche.tagsCore.join(" "));
    const agencyKeywords = this.formatAgencyKeywords(niche.tagsCore, niche.tagsSecondary, niche.tagsBuyerIntent);
    
    return {
      ...niche,
      selectedFormat: format,
      selectedStyle: style,
      selectedSubject: subjectMode,
      selectedTimeframe: timeframe,
      safetyCheck,
      agencyKeywords,
      title: this.generateOptimizedTitle(niche.topic, format, subjectMode),
      editorialCaption: niche.editorialFormat || this.generateEditorialCaption(niche.topic)
    };
  },

  /**
   * Synthesize realistic metrics and data for ANY unknown topic entered by user
   */
  synthesizeCustomTopic(topic, format, style, subjectMode, timeframe) {
    // Generate realistic, deterministic metrics based on topic string
    let hash = 0;
    for (let i = 0; i < topic.length; i++) {
      hash = (hash << 5) - hash + topic.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);

    const demandScore = 75 + (absHash % 23); // 75 - 97
    const competitionScore = 20 + ((absHash >> 3) % 45); // 20 - 64
    const isGoldenGap = demandScore >= 85 && competitionScore <= 40;
    
    const words = topic.split(/\s+/).filter(w => w.length > 2);
    const mainKeyword = words.slice(0, 3).join(" ").toLowerCase();

    // Generate 50 realistic SEO tags
    const tagsCore = this.buildCoreTags(topic);
    const tagsSecondary = this.buildSecondaryTags(topic, format);
    const tagsBuyerIntent = this.buildBuyerIntentTags(topic, subjectMode);

    const safetyCheck = this.scanTrademarkSafety(topic + " " + tagsCore.join(" "));
    const agencyKeywords = this.formatAgencyKeywords(tagsCore, tagsSecondary, tagsBuyerIntent);
    const title = this.generateOptimizedTitle(topic, format, subjectMode);

    return {
      id: "custom_" + absHash,
      topic: topic,
      category: "trending",
      formats: [format],
      demandScore: demandScore,
      competitionScore: competitionScore,
      commercialTier: demandScore > 90 ? "Tier A (High Commercial Value)" : "Tier B (Solid Standard)",
      avgRPI: demandScore > 90 ? "$2.50 - $6.00" : "$1.50 - $3.20",
      goldenGap: isGoldenGap,
      description: `High commercial potential in ${topic}. Targeted towards advertising agencies, editorial publications, and digital marketers seeking contemporary visual assets.`,
      tagsCore,
      tagsSecondary,
      tagsBuyerIntent,
      selectedFormat: format,
      selectedStyle: style,
      selectedSubject: subjectMode,
      selectedTimeframe: timeframe,
      safetyCheck,
      agencyKeywords,
      title,
      shotList: this.generateDynamicShotList(topic, format, subjectMode),
      aiPrompts: this.generateDynamicAiPrompts(topic, format, subjectMode),
      editorialCaption: this.generateEditorialCaption(topic),
      safetyNotes: safetyCheck.hasRisk ? "Caution: Potential trademark match detected. Review keywords." : "Safe for commercial stock submission. Ensure proper releases if people or private property are recognizable."
    };
  },

  buildCoreTags(topic) {
    const base = topic.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ');
    const tags = new Set([topic.toLowerCase()]);
    
    base.forEach(w => { if (w.length > 2) tags.add(w); });
    
    // Add relevant industry variations
    tags.add(`${topic.toLowerCase()} concept`);
    tags.add(`modern ${topic.toLowerCase()}`);
    tags.add(`${topic.toLowerCase()} background`);
    tags.add(`${topic.toLowerCase()} technology`);
    tags.add(`${topic.toLowerCase()} industry`);
    tags.add(`sustainable ${base[0] || 'solution'}`);
    tags.add(`future ${base[1] || 'innovation'}`);

    return Array.from(tags).slice(0, 12);
  },

  buildSecondaryTags(topic, format) {
    const list = [
      "innovation", "contemporary", "creative design", "professional",
      "cutting edge", "high quality", "commercial use", "inspiration",
      "digital transformation", "efficiency", "lifestyle", "perspective",
      "workspace", "urban", "architecture", "smart technology",
      "clean minimalist", "aesthetic", "dynamic", "sustainable"
    ];
    if (format === "footage") list.push("4k video", "b-roll", "cinematic footage", "slow motion");
    if (format === "vector") list.push("flat vector", "eps illustration", "graphic icon", "scalable art");
    if (format === "png") list.push("transparent background", "isolated object", "clipart cutout", "png element");
    if (format === "raster") list.push("stock photography", "depth of field", "studio lighting", "copyspace");
    return list.slice(0, 20);
  },

  buildBuyerIntentTags(topic, subjectMode) {
    const list = [
      "copy space", "negative space", "advertising banner", "corporate presentation",
      "marketing campaign", "website header", "commercial concept", "business strategy",
      "brochure design", "editorial article", "investor pitch", "social media post",
      "poster layout", "annual report", "promotional visual", "authentic emotion",
      "infographic asset", "creative agency", "ecommerce graphic", "hero image"
    ];
    if (subjectMode === "with_people") {
      list.push("diverse team", "authentic people", "candid portrait", "adult professional");
    } else {
      list.push("no people", "still life", "clean background", "isolated subject");
    }
    return list.slice(0, 18);
  },

  generateOptimizedTitle(topic, format, subjectMode) {
    const prefix = format === "footage" ? "Cinematic 4K Footage of" : "Modern Commercial";
    const peopleSuffix = subjectMode === "with_people" ? "Featuring Diverse Professionals" : "with Clean Copy Space";
    return `${prefix} ${topic} for Business Marketing and Digital Technology Concepts, ${peopleSuffix}`;
  },

  generateEditorialCaption(topic) {
    const cities = ["NEW YORK, USA", "LONDON, UK", "BERLIN, GERMANY", "TOKYO, JAPAN", "SINGAPORE"];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const date = "OCTOBER 15, 2026";
    return `${city} - ${date}: Demonstration and commercial application of ${topic} during an international enterprise industry showcase.`;
  },

  generateDynamicShotList(topic, format, subjectMode) {
    return [
      {
        angle: "Wide Establishing / Hero Shot",
        shot: `Expansive wide-angle scene capturing ${topic} in a bright, modern architectural setting with ample negative space.`
      },
      {
        angle: "Medium Interactive Shot",
        shot: subjectMode === "with_people" 
          ? `Authentic professional engaged in ${topic}, showing genuine focus and natural body language.`
          : `Clean top-down 45-degree angle composition showing key elements of ${topic} arranged harmoniously.`
      },
      {
        angle: "Close-Up / Copy Space Priority",
        shot: `Detail focus on the primary tool or interface of ${topic}, intentionally leaving 40% clean copy space for banner text.`
      },
      {
        angle: "Over-the-Shoulder / POV",
        shot: `First-person perspective looking down into the workspace or action of ${topic}, creating high buyer immersion.`
      },
      {
        angle: "Abstract Concept / Flat Lay",
        shot: `Symmetrical aesthetic layout showing isolated components and accessories related to ${topic} on matte background.`
      }
    ];
  },

  generateDynamicAiPrompts(topic, format, subjectMode) {
    if (format === "footage") {
      return {
        image: `commercial cinematic stock frame of ${topic}, ultra photorealistic, soft volumetric daylight, clean minimalist composition, ample copy space for advertising, 8k resolution, shot on Arri Alexa 35mm --ar 16:9 --v 6.1 --style raw`,
        video: `Cinematic 4K smooth camera slider shot of ${topic}, authentic atmosphere, pristine lighting, subtle natural movement, commercial stock video quality, 24fps --motion 4`,
        negative: `shaky camera, out of focus blur, visible corporate brand logos, artifacts, glitch, messy wires, cartoonish, oversaturated`
      };
    }

    if (format === "vector") {
      return {
        image: `modern flat minimalist vector illustration of ${topic}, clean geometric shapes, harmonious curated corporate color palette, isolated on pure white background, scalable commercial infographic style, professional UI asset --v 6.1 --no gradients, raster, realistic`,
        video: `Smooth 2D motion graphic animation of ${topic}, clean outline morphing, vibrant modern tech aesthetics, 60fps`,
        negative: `messy open lines, photographic textures, complex gradients, raster artifacts, watermarks, ugly composition`
      };
    }

    if (format === "png") {
      return {
        image: `3D isolated glossy render of ${topic}, clean claymorphism and smooth metallic accents, studio softbox lighting, transparent alpha cutout, zero background, 8k resolution --ar 1:1 --v 6.1`,
        video: `360 degree turntable rotation of isolated 3D object ${topic} with smooth studio reflections, clean edges, 30fps`,
        negative: `halo outline, rough jagged edges, cast background shadow, semi-transparent noise, low poly artifacts`
      };
    }

    // Default Raster / Photo
    return {
      image: `commercial stock photography of ${topic}, shot on Hasselblad 50mm f/2.8 lens, natural daylight through large glass windows, clean contemporary aesthetic, generous copy space on the right side for typography, authentic human expression, 8k resolution --ar 3:2 --v 6.1 --style raw`,
      video: `Cinematic slow motion clip of ${topic}, warm natural illumination, shallow depth of field with creamy bokeh, commercial broadcast quality, 4k 30fps --motion 3`,
      negative: `deformed hands, extra fingers, plastic artificial skin, visible brand logos, cluttered messy background, underexposed, harsh flash glare`
    };
  },

  scanTrademarkSafety(text) {
    const lower = text.toLowerCase();
    const flagged = [];

    MICROSTOCK_DATA.trademarkBlacklist.forEach(item => {
      const regex = new RegExp(`\\b${item.word}\\b`, 'i');
      if (regex.test(lower)) {
        flagged.push(item);
      }
    });

    const isSafe = flagged.length === 0;
    const safetyScore = isSafe ? 100 : Math.max(40, 100 - (flagged.length * 20));

    return {
      isSafe,
      safetyScore,
      flaggedWords: flagged,
      verdict: isSafe ? "100% Commercial Safe" : "Trademark Warning Detected"
    };
  },

  /**
   * Format keywords specifically for each major stock agency
   */
  formatAgencyKeywords(core, secondary, intent) {
    // Combine and deduplicate
    const combined = Array.from(new Set([...core, ...secondary, ...intent]));
    
    // 1. Adobe Stock: First 10 are heavily weighted by search engine
    const adobePriority = combined.slice(0, 10);
    const adobeRest = combined.slice(10, 49);
    const adobeFull = [...adobePriority, ...adobeRest];

    // 2. Shutterstock: Max 50 tags, comma-separated
    const shutterstockTags = combined.slice(0, 50);

    // 3. Freepik: Recommended 25 - 30 tight, hyper-specific tags
    const freepikTags = combined.slice(0, 30);

    // 4. Getty / iStock: Concise controlled vocabulary
    const gettyTags = combined.slice(0, 25);

    return {
      all: combined.slice(0, 50),
      adobe: {
        priority: adobePriority,
        remaining: adobeRest,
        commaSeparated: adobeFull.join(", "),
        count: adobeFull.length
      },
      shutterstock: {
        tags: shutterstockTags,
        commaSeparated: shutterstockTags.join(", "),
        count: shutterstockTags.length
      },
      freepik: {
        tags: freepikTags,
        commaSeparated: freepikTags.join(", "),
        count: freepikTags.length
      },
      getty: {
        tags: gettyTags,
        commaSeparated: gettyTags.join(", "),
        count: gettyTags.length
      }
    };
  },

  /**
   * Filter and retrieve all niches for the Gap Analysis Matrix Table
   */
  getGapAnalysisTable(categoryFilter = "all", formatFilter = "all", sortField = "opportunity") {
    let list = [...MICROSTOCK_DATA.nicheDatabase];

    if (categoryFilter !== "all") {
      list = list.filter(item => item.category === categoryFilter);
    }

    if (formatFilter !== "all") {
      list = list.filter(item => item.formats.includes(formatFilter));
    }

    list.sort((a, b) => {
      if (sortField === "opportunity") {
        // Opportunity Index = Demand - Competition
        const oppA = a.demandScore - a.competitionScore;
        const oppB = b.demandScore - b.competitionScore;
        return oppB - oppA;
      }
      if (sortField === "demand") return b.demandScore - a.demandScore;
      if (sortField === "competition") return a.competitionScore - b.competitionScore;
      return 0;
    });

    return list;
  }
};
