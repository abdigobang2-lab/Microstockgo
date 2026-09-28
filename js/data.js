/**
 * Microstockgo - Curated Microstock Market Intelligence Database
 */

const MICROSTOCK_DATA = {
  // Asset formats with specific guidance and settings
  formats: {
    footage: {
      name: "Footage",
      icon: "🎥",
      description: "Video clips & B-roll for commercials, broadcasts, and social ads",
      technicalSpecs: {
        resolution: "4K UHD (3840x2160) or 1080p Full HD",
        fps: "24fps (Cinematic), 30fps (Standard), 60fps (Smooth/Slow Motion)",
        codec: "ProRes 422 or H.264 / H.265 (High Bitrate, min 100Mbps)",
        duration: "10 to 30 seconds (ideal 15-20s)",
        audio: "Mute / No background noise unless clean authentic ambiance"
      },
      styles: [
        { id: "real_4k", name: "Real Footage (4K Cinematic B-Roll)" },
        { id: "drone_aerial", name: "Drone & Aerial View" },
        { id: "hyperlapse", name: "Hyperlapse & Motion Timelapse" },
        { id: "slowmo", name: "Super Slow Motion (60-120fps)" },
        { id: "pov_macro", name: "POV & Macro Detail" },
        { id: "ai_video", name: "AI Generated Video (Runway / Kling)" }
      ]
    },
    raster: {
      name: "Raster",
      icon: "📸",
      description: "Stock photos, 3D renders, and commercial AI-generated images",
      technicalSpecs: {
        resolution: "Minimum 4MP to 24MP+ (e.g. 6000x4000 px)",
        colorSpace: "sRGB or Adobe RGB (8-bit JPEG, maximum quality 10-12)",
        composition: "Clean copy space, rule of thirds, authentic candid expressions",
        aiDisclosure: "Mandatory 'Generative AI' label when submitting to Adobe/Shutterstock"
      },
      styles: [
        { id: "commercial_photo", name: "Commercial Authentic Photography" },
        { id: "isolated_white", name: "Isolated on Pure White (Clipping Path)" },
        { id: "flat_lay", name: "Flat Lay / Top-Down Desk Setup" },
        { id: "3d_render", name: "3D Hyper-Realistic Isometric Render" },
        { id: "lifestyle_candid", name: "Candid Lifestyle & Genuine Emotion" },
        { id: "ai_flux", name: "AI Photorealism (FLUX.1 / Midjourney v6)" }
      ]
    },
    vector: {
      name: "Vector",
      icon: "📐",
      description: "Scalable vector graphics, icon sets, illustrations, and UI templates",
      technicalSpecs: {
        format: "EPS 10 (compatible across Adobe Illustrator, Corel, Affinity)",
        colorMode: "RGB (recommended for digital stock), preview JPEG >= 5000px",
        layers: "Clean, unlocked, organized into labeled groups, text converted to outlines",
        elements: "No open paths, no locked hidden layers, no embedded raster bitmaps"
      },
      styles: [
        { id: "flat_modern", name: "Flat Minimalist Illustration" },
        { id: "isometric", name: "3D Isometric Infographic" },
        { id: "line_art", name: "Clean Monoline / Outline Vector" },
        { id: "gradient_mesh", name: "Vibrant Gradient / Glassmorphism Vector" },
        { id: "icon_pack", name: "Cohesive Icon Pack (20-50 icons)" },
        { id: "badge_logo", name: "Retro Badge / Vintage Emblem Template" }
      ]
    },
    png: {
      name: "PNG",
      icon: "✨",
      description: "Transparent cutout elements, 3D objects, stickers, and clipart",
      technicalSpecs: {
        format: "PNG-24 with Transparent Alpha Channel",
        resolution: "High resolution (minimum 3000x3000px at 300 DPI)",
        cutoutQuality: "Feather-free, clean crisp edges, zero halo fringe artifacts",
        useCases: "Canva drag-and-drop, sublimation, stickers, web design collage"
      },
      styles: [
        { id: "3d_isolated", name: "3D Glossy Clay / Glass Element" },
        { id: "water_ink", name: "Watercolor / Hand-painted Splash" },
        { id: "sticker_pack", name: "Die-cut Sticker with White Border" },
        { id: "real_cutout", name: "Real Object Cutout (Food/Plant/Tools)" },
        { id: "glow_effect", name: "Neon Glow / Light Flare Overlay" },
        { id: "paper_craft", name: "Paper Cutout / Origami 3D Element" }
      ]
    }
  },

  // Subject Modes
  subjectModes: [
    { id: "with_people", name: "With People (Diverse, Authentic)" },
    { id: "no_people", name: "No People (Objects, Still Life, Abstract)" },
    { id: "isolated_subject", name: "Isolated Subject with Copy Space" },
    { id: "workspace_hands", name: "Hands & Detail Interaction Only" },
    { id: "aerial_landscape", name: "Landscape & Architecture" }
  ],

  // Timeframes (Microstock Seasonal Golden Rule: 60-90 days in advance)
  timeframes: [
    { id: "immediate", name: "Evergreen / All Year Demand", leadDays: 0 },
    { id: "upcoming_1m", name: "Upcoming 1 Month (Urgent Finishing)", leadDays: 30 },
    { id: "upcoming_2m", name: "Upcoming 2 Months (Ideal Production Window)", leadDays: 60 },
    { id: "upcoming_3m", name: "Upcoming 3 Months (Early Trend Setter)", leadDays: 90 },
    { id: "q4_rush", name: "Q4 Mega Holiday Season (Halloween, Xmas, New Year)", leadDays: 120 }
  ],

  // Brainstorming Seed Categories
  brainstormPills: {
    trending: [
      "Sustainable Energy 2028", "Mental Health Awareness", "Smart Urban Living",
      "EV Charging Infrastructure", "Space Exploration Tech", "AI Agent Workflow",
      "Quantum Computing Lab", "Circular Bio-Economy", "Hydroponic Urban Farm",
      "Autonomous Delivery Robot", "Micro-Grid Solar Farm", "Zero Waste Packaging"
    ],
    business: [
      "Remote Team Collaboration", "Fintech Mobile Banking App", "Logistics & Global Cargo",
      "Diverse Corporate Leadership", "Modern Eco Co-Working", "Cybersecurity War Room",
      "Supply Chain Warehouse Automation", "Biometric ID Authentication", "Cloud Data Center Ops",
      "Venture Capital Pitch Deck", "Small Business Accounting", "Executive Decision Making"
    ],
    lifestyle: [
      "Telemedicine Home Care", "Urban Balcony Gardening", "Vanlife Off-Grid Travel",
      "Active Senior Citizen Fitness", "Solo Female Traveler", "Mindful Meditation & Yoga",
      "Glamping Nature Retreat", "Sustainable Vegan Cooking", "Artisan Coffee Barista",
      "Work-Life Hybrid Routine", "Parent Working From Home", "Pet Wellness & Care"
    ],
    concepts: [
      "Cybersecurity Data Shield", "Work-Life Harmonious Balance", "Green Carbon Neutral Economy",
      "Global Decentralized Network", "Decentralized Blockchain Ledger", "Digital Overload & Detox",
      "Resilient Mental Strength", "Generational Wealth Transfer", "Future of Education VR",
      "Human & AI Symbiosis", "Clean Ocean Water Purity", "Digital Identity Verification"
    ]
  },

  // Detailed Opportunity Data Bank for Deep Analysis
  nicheDatabase: [
    {
      id: "ev_charging_infra",
      topic: "EV Charging Infrastructure & Smart Fleet",
      category: "business",
      formats: ["footage", "raster", "vector"],
      demandScore: 94,
      competitionScore: 28,
      commercialTier: "Tier A (High Value B2B)",
      avgRPI: "$2.80 - $6.50",
      goldenGap: true,
      description: "High commercial demand from automotive manufacturers, green energy firms, and municipal infrastructure reports.",
      tagsCore: ["electric vehicle", "ev charging station", "smart grid", "clean energy", "charging cable", "sustainable transport", "electric car", "eco friendly", "green technology", "urban infrastructure"],
      tagsSecondary: ["fleet charging", "renewable power", "battery technology", "power socket", "charging port", "future mobility", "zero emission", "commercial vehicle", "charging point", "smart city"],
      tagsBuyerIntent: ["copy space", "modern design", "commercial concept", "technology background", "automotive industry", "transportation advertising", "energy transition", "power supply", "b2b business", "corporate presentation"],
      shotList: [
        { angle: "Macro / Detail", shot: "Hands plugging high-voltage fast charger into sleek vehicle with glowing LED status light." },
        { angle: "Wide Establishing", shot: "Modern solar-canopy charging station in clean urban center with electric SUV parked." },
        { angle: "Over-Shoulder POV", shot: "Driver tapping smartphone app to authorize contactless digital payment for charging." },
        { angle: "Side Profile with Copy Space", shot: "Silhouette of EV with ample clean negative space on the right for corporate banner text." },
        { angle: "Drone / Aerial", shot: "Bird's eye view of symmetrical 8-bay EV charging hub adjacent to green parkway." }
      ],
      aiPrompts: {
        image: "commercial stock photography of a futuristic sleek electric vehicle charging at an ultra-modern glowing minimalist charging station, dusk lighting, soft cinematic blue and amber hues, clean negative space on top right for text, shot on Hasselblad 50mm lens f/2.8, pristine composition, 8k resolution, authentic realism --ar 16:9 --v 6.1 --style raw",
        video: "Smooth cinematic 4K camera dolly-in shot of glowing EV charging cable being connected to luxury electric vehicle, indicator LEDs pulsing green, modern architectural backdrop, golden hour sunlight flare, 24fps --motion 4",
        negative: "blurry, messy background, distorted car logo, visible real brand emblems, bad anatomy, noisy artifacts, oversaturated chromatic aberration"
      },
      editorialFormat: "SAN FRANCISCO, USA - OCTOBER 12, 2026: A row of modern fast-charging electric vehicle stations operating in an eco-certified municipal park & ride hub.",
      safetyNotes: "Ensure no visible automaker badges (Tesla, Hyundai, etc.) are present for commercial release. Keep body lines generic."
    },
    {
      id: "telemedicine_senior",
      topic: "Telemedicine & Senior Care At Home",
      category: "lifestyle",
      formats: ["footage", "raster", "vector", "png"],
      demandScore: 92,
      competitionScore: 34,
      commercialTier: "Tier A (High Value B2B)",
      avgRPI: "$2.40 - $5.20",
      goldenGap: true,
      description: "Pharmaceutical, healthcare tech, and insurance companies constantly license this for ads targeting aging populations.",
      tagsCore: ["telemedicine", "senior healthcare", "doctor online", "video consultation", "elderly patient", "digital health", "telehealth", "medical app", "remote care", "home healthcare"],
      tagsSecondary: ["senior woman", "touchscreen tablet", "virtual medicine", "healthcare professional", "geriatric care", "caregiver", "wellness check", "healthy aging", "prescription online", "medical technology"],
      tagsBuyerIntent: ["authentic emotion", "warm natural lighting", "accessible healthcare", "copy space", "medical advertising", "insurance brochure", "clinic promotion", "patient support", "care concept", "hospital website"],
      shotList: [
        { angle: "Medium Shot", shot: "Smiling elderly grandmother speaking comfortably to caring doctor on tablet screen in sunlit living room." },
        { angle: "Over-the-Shoulder POV", shot: "Looking over senior's shoulder showing friendly physician in white coat explaining digital charts on tablet." },
        { angle: "Close-Up Detail", shot: "Elderly hands holding modern tablet device with clear copy space around edges." },
        { angle: "Two-Person Connection", shot: "Adult daughter gently sitting beside elderly mother helping with tablet telehealth session." },
        { angle: "Doctor's Perspective", shot: "Modern clinic office with physician wearing headset smiling warmly into camera as if talking to patient." }
      ],
      aiPrompts: {
        image: "genuine stock photo of a happy senior woman holding a tablet computer during a warm telemedicine video appointment with doctor, bright cozy living room with soft window daylight, authentic smile, depth of field, generous copy space on left side, shot on Canon 85mm f/1.8, high commercial quality --ar 3:2 --v 6.1",
        video: "Slow rack focus from senior woman's gentle hand holding a tablet to her joyful face as she chats with her doctor online, natural morning sunbeams, 4k 30fps smooth --motion 3",
        negative: "grotesque facial expressions, deformed fingers, extra limbs, clinical coldness, medical horror, artificial plastic skin"
      },
      editorialFormat: "Commercial with signed Model Release recommended. If real medical clinic is identifiable without permit, submit as Editorial.",
      safetyNotes: "Avoid visible medical brand equipment logos (e.g. Philips, Omron). UI on tablet must be generic."
    },
    {
      id: "cybersecurity_war_room",
      topic: "Cybersecurity Ops & AI Threat Defense",
      category: "business",
      formats: ["footage", "raster", "vector"],
      demandScore: 96,
      competitionScore: 42,
      commercialTier: "Tier A+ (Enterprise B2B)",
      avgRPI: "$3.50 - $8.00",
      goldenGap: true,
      description: "Enterprise software, cloud vendors, and defense contractors pay premium prices for moody, high-tech security imagery.",
      tagsCore: ["cybersecurity", "network security", "data protection", "threat intelligence", "security operations center", "digital shield", "server room", "hacker defense", "firewall", "cyber defense"],
      tagsSecondary: ["soc analyst", "data encryption", "cloud security", "cyber attack prevention", "information security", "big data monitoring", "security dashboard", "it infrastructure", "surveillance screen", "system administrator"],
      tagsBuyerIntent: ["corporate banner", "tech security header", "enterprise software", "b2b cloud ad", "safe data concept", "futuristic ui", "copy space dark mode", "dark aesthetic", "high tech background", "infosec agency"],
      shotList: [
        { angle: "Wide Cinematic", shot: "High-tech SOC (Security Operations Center) with multi-monitor video wall displaying global cybersecurity threat map." },
        { angle: "Side Angle Focus", shot: "Cyber analyst wearing professional headset evaluating anomalous network traffic graphs in dark moody room with cyan glow." },
        { angle: "Macro Detail", shot: "Hands typing rapidly on backlit ergonomic mechanical keyboard with biometric fingerprint sensor glowing blue." },
        { angle: "Abstract Concept", shot: "Translucent 3D digital security padlock hovering over glowing fiber optic circuit board network." },
        { angle: "Over-Shoulder", shot: "Looking at dual ultrawide monitor setup featuring glowing terminal code and automated firewall defenses." }
      ],
      aiPrompts: {
        image: "dramatic corporate stock photo of a futuristic cybersecurity command center, IT analyst working at ergonomic workstation surrounded by curved monitors showing abstract data stream graphs, deep navy and cyan glow, cinematic atmospheric haze, sleek glass architecture, 8k --ar 16:9 --v 6.1",
        video: "Slow cinematic panning shot across glowing dark server racks and fiber-optic cables in state-of-the-art enterprise data center, pulsing cyan server LEDs, smooth motion, 4k 60fps --motion 5",
        negative: "stereotypical ski-mask hacker in dark hoodie, skull graphics, messy wires, childish clipart, low resolution noise"
      },
      editorialFormat: "Ideal for Commercial stock if screens feature fictional custom telemetry UI.",
      safetyNotes: "Code on screen must not reveal real API keys, passwords, IP addresses, or proprietary company code."
    },
    {
      id: "sustainable_urban_farming",
      topic: "Smart Hydroponics & Vertical Urban Agriculture",
      category: "trending",
      formats: ["footage", "raster", "vector", "png"],
      demandScore: 89,
      competitionScore: 25,
      commercialTier: "Tier A (ESG & Green Business)",
      avgRPI: "$2.60 - $5.50",
      goldenGap: true,
      description: "Huge gap in modern indoor automated farming with IoT sensors. High interest from ESG investor publications.",
      tagsCore: ["vertical farming", "hydroponics", "urban agriculture", "indoor farm", "smart farming", "sustainable food", "agritech", "clean produce", "led grow lights", "future agriculture"],
      tagsSecondary: ["greenhouse automation", "fresh organic salad", "water conservation", "eco food production", "agricultural engineer", "nutrient film", "aeroponics", "sustainable city", "food security", "climate smart"],
      tagsBuyerIntent: ["esg report cover", "green technology advertising", "sustainability brochure", "clean eating brand", "agtech startup banner", "copy space", "nature technology harmony", "modern biology", "zero pesticide", "healthy nutrition"],
      shotList: [
        { angle: "Medium Shot", shot: "Female agricultural scientist in lab coat inspecting vibrant green vertical lettuce towers with digital tablet." },
        { angle: "Macro Food", shot: "Crisp water droplets glistening on organic hydroponic kale leaves illuminated under magenta and white LED spectrum." },
        { angle: "Wide Architectural", shot: "Vast warehouse converted into high-tech multi-tier vertical farm with glowing rows stretching into perspective." },
        { angle: "Hands-on Action", shot: "Farmer wearing clean gloves carefully harvesting pristine root-bound living butterhead lettuce." },
        { angle: "Low Angle Looking Up", shot: "Dynamic low angle view looking up towering hydroponic channels with automated nutrient irrigation pipes." }
      ],
      aiPrompts: {
        image: "commercial stock photograph of a female agronomist checking high-tech vertical indoor hydroponics farm, vibrant rows of crisp green lettuce under specialized pinkish-white LED grow lights, modern clean lab aesthetic, ample copy space on right, natural depth of field --ar 16:9 --v 6.1",
        video: "Cinematic motorized slider move through towering racks of lush green vertical lettuce in automated smart indoor farm, misting irrigation activating, 4K 24fps --motion 4",
        negative: "dirty soil, wilted yellow leaves, distorted hands, generic old barn, pesticide sprayer, plastic trash"
      },
      editorialFormat: "Commercial ready with generic worker uniforms and unbranded LED hardware.",
      safetyNotes: "Avoid visible agricultural trademark brands or corporate signage."
    },
    {
      id: "fintech_cashless_lifestyle",
      topic: "Contactless NFC & Biometric Micro-Payments",
      category: "business",
      formats: ["footage", "raster", "vector", "png"],
      demandScore: 95,
      competitionScore: 48,
      commercialTier: "Tier A (High Frequency Commercial)",
      avgRPI: "$2.20 - $4.80",
      goldenGap: false,
      description: "Evergreen commercial darling. Every bank, payment processor, and merchant app needs fresh, culturally diverse angles.",
      tagsCore: ["contactless payment", "nfc technology", "mobile banking", "cashless society", "digital wallet", "smart payment", "pos terminal", "tap to pay", "fintech", "credit card payment"],
      tagsSecondary: ["smartwatch pay", "smartphone payment", "retail shopping", "checkout counter", "electronic payment", "barista cafe", "convenient transaction", "digital money", "modern banking", "merchant services"],
      tagsBuyerIntent: ["commercial advertising", "bank app marketing", "retail banner", "small business finance", "secure transaction", "smooth payment concept", "copy space", "contemporary lifestyle", "fintech startup", "e-commerce graphic"],
      shotList: [
        { angle: "Close-Up Wrist", shot: "Trendy customer tapping sleek smartwatch onto minimalist wooden counter contactless payment terminal." },
        { angle: "Medium Retail Interaction", shot: "Young professional holding organic coffee cup smiling while tapping phone to pay at sunny artisan cafe." },
        { angle: "Top-Down Flat Lay", shot: "Modern matte black POS reader, ceramic coffee cup, and hands holding smartphone with clean graphic payment screen." },
        { angle: "Customer & Merchant", shot: "Friendly barista holding payment terminal forward with warm greeting in aesthetic bakery." },
        { angle: "Macro Terminal Screen", shot: "Clean glowing checkmark icon appearing on digital POS screen confirming successful instant transfer." }
      ],
      aiPrompts: {
        image: "commercial stock photography, close-up of young woman tapping smartphone against a modern matte black payment terminal on a clean light oak counter, warm morning cafe atmosphere, bokeh background, shallow depth of field, natural lighting, high end advertisement style --ar 3:2 --v 6.1",
        video: "Close up 4K video of a hand holding a smartphone making a quick contactless payment on a modern store terminal, terminal beeps with green checkmark confirmation, smooth motion 30fps --motion 3",
        negative: "visible Apple or Google logos, Visa / Mastercard emblems, dirty hands, cluttered counter, low resolution"
      },
      editorialFormat: "Commercial release. Crucial: All smartphone frames and card reader designs must be completely unbranded.",
      safetyNotes: "Blacklist: Apple Pay, Google Pay, Visa, Mastercard, Samsung Pay logos. Must be generic NFC waves."
    },
    {
      id: "mental_health_burnout",
      topic: "Digital Wellbeing, Burnout & Mindful Pause",
      category: "concepts",
      formats: ["footage", "raster", "vector"],
      demandScore: 91,
      competitionScore: 31,
      commercialTier: "Tier A (High Editorial & Commercial Demand)",
      avgRPI: "$2.50 - $5.00",
      goldenGap: true,
      description: "HR software, mental health apps (Calm, Headspace), and corporate wellness programs purchase vast volumes of this concept.",
      tagsCore: ["mental health", "burnout prevention", "mindfulness", "digital wellbeing", "stress relief", "work life balance", "meditation at desk", "workplace wellness", "emotional health", "taking a break"],
      tagsSecondary: ["peace of mind", "mental clarity", "deep breathing", "laptop closed", "unplugging concept", "calm office", "resilience", "psychological safety", "self care", "tranquil moment"],
      tagsBuyerIntent: ["wellness campaign", "hr policy banner", "employee benefit brochure", "mental health week", "counseling ad", "copy space calm", "peaceful concept", "editorial article", "psychology website", "corporate health"],
      shotList: [
        { angle: "Side Medium", shot: "Exhausted corporate worker gently closing laptop, leaning back in ergonomic chair, taking a peaceful deep breath with eyes closed." },
        { angle: "Still Life with Copy Space", shot: "Closed sleek notebook and steaming ceramic tea mug next to potted succulent bathed in soft morning light." },
        { angle: "Candid Portrait", shot: "Man sitting in sunny corner of modern office enjoying a mindful 5-minute break away from digital screens." },
        { angle: "Concept Silhouette", shot: "Person standing near large floor-to-ceiling window watching clouds float by, calm minimalist atmosphere." },
        { angle: "Hands Detail", shot: "Hands holding a warm herbal teacup with both palms, savoring the tactile warmth and quiet moment." }
      ],
      aiPrompts: {
        image: "authentic commercial stock photo of a diverse young professional man closing his laptop and pausing to take a mindful deep breath, serene warm sunlit office background with green houseplants, soft shadows, peaceful emotional expression, ample negative space on right --ar 16:9 --v 6.1",
        video: "Cinematic slow motion clip of an office worker leaning back, taking off glasses, closing eyes in peaceful relaxation as gentle sunlight washes over face, 4k 24fps --motion 2",
        negative: "cliché screaming in horror, holding head in violent agony, cartoonish tears, dramatic theatrical despair"
      },
      editorialFormat: "Commercial stock standard. Conveys subtle authenticity rather than overly dramatic theatrical acting.",
      safetyNotes: "Ensure model release covers commercial depiction of mental health & wellbeing topics."
    },
    {
      id: "ai_robot_logistics",
      topic: "Autonomous Warehouse Robotics & AMR Fleet",
      category: "business",
      formats: ["footage", "raster", "vector"],
      demandScore: 97,
      competitionScore: 36,
      commercialTier: "Tier A+ (Logistics & Supply Chain)",
      avgRPI: "$3.20 - $7.50",
      goldenGap: true,
      description: "Huge demand fueled by e-commerce expansion and autonomous AMR (Autonomous Mobile Robots) in global fulfillment centers.",
      tagsCore: ["warehouse automation", "autonomous mobile robot", "amr robot", "logistics robotics", "smart warehouse", "automated sorting", "supply chain tech", "automated guided vehicle", "ecommerce fulfillment", "robot fleet"],
      tagsSecondary: ["pallet robot", "robotic logistics", "storage facility", "industrial 4.0", "ai robotics", "sensor navigation", "automated distribution", "inventory management", "sorting system", "smart factory"],
      tagsBuyerIntent: ["logistics conference keynote", "supply chain report", "industrial automation ad", "b2b ecommerce", "investor presentation", "copy space industrial", "future of delivery", "tech magazine cover", "logistics website", "smart enterprise"],
      shotList: [
        { angle: "Low Angle Dynamic", shot: "Orange and black autonomous flatbed robot carrying heavy merchandise shelf effortlessly gliding down clean warehouse aisle." },
        { angle: "Wide Establishing", shot: "Multiple autonomous mobile robots navigating intersecting floor paths in futuristic gleaming fulfillment center." },
        { angle: "Human & Robot Collab", shot: "Human supervisor holding rugged tablet observing automated sorting robots working safely alongside personnel." },
        { angle: "Macro Sensor Detail", shot: "Glowing LiDAR and optical obstacle-avoidance sensor array pulsing on robotic chassis." },
        { angle: "Motion Blur Speed", shot: "Long exposure showing streaks of LED light trails as automated bots rapidly transport goods." }
      ],
      aiPrompts: {
        image: "commercial stock photography of sleek autonomous mobile robots transporting inventory shelves across a massive high-tech automated fulfillment center, bright clean industrial floor, glowing indicator lights, dramatic wide perspective, copy space above, Hasselblad 8k --ar 16:9 --v 6.1",
        video: "Smooth tracking 4K footage gliding alongside an autonomous mobile logistics robot carrying cargo through a spotless smart warehouse, depth of field, 60fps --motion 4",
        negative: "Amazon Kiva logo, dirty cluttered floor, malfunctioning sparks, scary sci-fi killer robot aesthetic, blurry wheels"
      },
      editorialFormat: "Commercial viable with proprietary brand names removed from robots and cargo containers.",
      safetyNotes: "Do not replicate exact Amazon Robotics or Boston Dynamics signature chassis or logos."
    },
    {
      id: "vanlife_remote_work",
      topic: "Off-Grid Vanlife & Digital Nomad Workstation",
      category: "lifestyle",
      formats: ["footage", "raster", "vector"],
      demandScore: 88,
      competitionScore: 49,
      commercialTier: "Tier B (High Volume Travel Lifestyle)",
      avgRPI: "$1.80 - $3.80",
      goldenGap: false,
      description: "Popular with telecommunication providers, remote work tools, camper van brands, and outdoor gear manufacturers.",
      tagsCore: ["digital nomad", "vanlife", "remote work", "off grid living", "camper van", "laptop outdoors", "working from nature", "portable solar power", "freelance lifestyle", "travel workstation"],
      tagsSecondary: ["mountain backdrop", "cozy camper interior", "satellite internet", "coffee mug", "adventure travel", "work and travel", "nomadic lifestyle", "wanderlust office", "modern freedom", "scenic workspace"],
      tagsBuyerIntent: ["nomad app promo", "telecom coverage ad", "lifestyle magazine cover", "satellite wifi promotion", "remote job platform", "copy space scenic", "inspirational travel", "freedom concept", "adventure brand", "work from anywhere"],
      shotList: [
        { angle: "Rear Doors Framed View", shot: "Open back doors of camper van framing breathtaking mountain valley while person works on laptop sitting on cozy bed." },
        { angle: "Outdoor Setup", shot: "Foldable wooden camp table set up beside van in alpine meadow with laptop, notebook, and solar battery bank." },
        { angle: "Close-Up Hand & View", shot: "Hand holding enamel camp coffee mug with steam rising against scenic misty pine forest background." },
        { angle: "Golden Hour Glow", shot: "Sunset light flooding cozy wooden van interior, fairy lights glowing as nomad finishes evening project." },
        { angle: "Drone Over Van", shot: "Aerial drone shot of camper van parked safely on dramatic coastal cliff edge with person enjoying sunset." }
      ],
      aiPrompts: {
        image: "commercial stock photo from inside a converted wooden campervan looking out open back doors at a stunning alpine lake and mountain range, young woman working on laptop with a steaming mug, morning golden hour light, cozy aesthetic, high commercial value --ar 16:9 --v 6.1",
        video: "Slow cinematic pull back from laptop screen displaying creative project to reveal the vast serene mountain view through open camper van doors, 4k 24fps --motion 3",
        negative: "Mercedes Sprinter or Ford emblem visible on doors, trash on ground, broken windows, grim lighting"
      },
      editorialFormat: "Commercial with model release. Obscure vehicle brand badges and license plates.",
      safetyNotes: "Always photoshop or avoid vehicle brand badges (Mercedes, Ford, VW, Ram) and registration plates."
    }
  ],

  // Seasonal Golden Calendar Roadmap (Upload 60-90 days before buyer peaks)
  seasonalRoadmap: [
    {
      quarter: "Q1 (Jan - Mar)",
      focusMonth: "Produce for Spring & Easter (Mar - Apr)",
      events: [
        { title: "Spring Renewal & Gardening", leadTime: "Ready to Upload", demand: "High", icon: "🌱" },
        { title: "Easter Celebration & Family", leadTime: "60 Days Ahead", demand: "Peak", icon: "🐣" },
        { title: "Earth Day & Eco Living (Apr 22)", leadTime: "75 Days Ahead", demand: "Very High", icon: "🌍" },
        { title: "Mother's Day & Gratitude", leadTime: "90 Days Ahead", demand: "Peak", icon: "💐" }
      ]
    },
    {
      quarter: "Q2 (Apr - Jun)",
      focusMonth: "Produce for Summer & Back to School (Jul - Sep)",
      events: [
        { title: "Summer Vacation & Beach Travel", leadTime: "Ready to Upload", demand: "Peak", icon: "🏖️" },
        { title: "Father's Day & BBQ Outdoor", leadTime: "60 Days Ahead", demand: "High", icon: "👔" },
        { title: "Back to School & University (Sep)", leadTime: "75 Days Ahead", demand: "Very High", icon: "🎒" },
        { title: "Autumn Harvest & Fall Colors", leadTime: "90 Days Ahead", demand: "Rising", icon: "🍂" }
      ]
    },
    {
      quarter: "Q3 (Jul - Sep)",
      focusMonth: "Produce for Halloween, Black Friday & Q4 Rush",
      events: [
        { title: "Halloween Spooky & Costumes (Oct 31)", leadTime: "Golden Window", demand: "Mega Peak", icon: "🎃" },
        { title: "Thanksgiving & Family Dinner (Nov)", leadTime: "60 Days Ahead", demand: "High", icon: "🦃" },
        { title: "Black Friday & Cyber Monday Sales", leadTime: "75 Days Ahead", demand: "Extreme", icon: "🛍️" },
        { title: "Christmas & Holiday Magic (Dec 25)", leadTime: "90 Days Ahead", demand: "Maximum Revenue", icon: "🎄" }
      ]
    },
    {
      quarter: "Q4 (Oct - Dec)",
      focusMonth: "Produce for New Year & Fitness Goals (Jan - Feb)",
      events: [
        { title: "New Year 2027 Goals & Fireworks", leadTime: "Upload Now", demand: "Mega Peak", icon: "🎆" },
        { title: "Gym, Fitness & Healthy Diet Resolution", leadTime: "60 Days Ahead", demand: "Peak", icon: "🥗" },
        { title: "Valentine's Day & Romance (Feb 14)", leadTime: "75 Days Ahead", demand: "High", icon: "💖" },
        { title: "Tax Season & Business Accounting", leadTime: "90 Days Ahead", demand: "Very High", icon: "📊" }
      ]
    }
  ],

  // Trademark and Rejection Risk Blacklist Dictionary
  trademarkBlacklist: [
    { word: "apple", severity: "high", reason: "Tech brand trademark (Apple Inc.)" },
    { word: "iphone", severity: "high", reason: "Registered trademark of Apple Inc." },
    { word: "ipad", severity: "high", reason: "Registered trademark of Apple Inc." },
    { word: "macbook", severity: "high", reason: "Registered trademark of Apple Inc." },
    { word: "nike", severity: "high", reason: "Apparel trademark (Nike Swoosh)" },
    { word: "adidas", severity: "high", reason: "Apparel trademark (Three Stripes)" },
    { word: "coca-cola", severity: "high", reason: "Beverage brand trademark" },
    { word: "coke", severity: "high", reason: "Beverage brand trademark" },
    { word: "pepsi", severity: "high", reason: "Beverage brand trademark" },
    { word: "starbucks", severity: "high", reason: "Coffeehouse chain trademark" },
    { word: "mcdonald's", severity: "high", reason: "Fast food brand trademark" },
    { word: "disney", severity: "high", reason: "Entertainment company trademark" },
    { word: "marvel", severity: "high", reason: "Comic/Film trademark" },
    { word: "lego", severity: "high", reason: "Toy brick trademark" },
    { word: "barbie", severity: "high", reason: "Mattel doll trademark" },
    { word: "tesla", severity: "high", reason: "Automotive trademark" },
    { word: "google", severity: "high", reason: "Tech brand trademark" },
    { word: "instagram", severity: "high", reason: "Social media trademark" },
    { word: "tiktok", severity: "high", reason: "Social media trademark" },
    { word: "youtube", severity: "high", reason: "Video platform trademark" },
    { word: "facebook", severity: "high", reason: "Meta trademark" },
    { word: "playstation", severity: "high", reason: "Sony interactive trademark" },
    { word: "xbox", severity: "high", reason: "Microsoft gaming trademark" },
    { word: "olympic", severity: "high", reason: "Protected by Olympic Charter law" },
    { word: "fifa", severity: "high", reason: "Protected football organization" },
    { word: "super bowl", severity: "high", reason: "NFL protected trademark" },
    { word: "eiffel tower night", severity: "high", reason: "Night illumination lighting copyright" },
    { word: "hollywood sign", severity: "high", reason: "Protected landmark trademark" },
    { word: "louvre pyramid", severity: "high", reason: "Architectural copyright without permit" }
  ]
};
