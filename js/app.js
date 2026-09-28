/**
 * Microstockgo - Main Application Controller
 * Handles UI interactions, themes, multi-agency formatting, and reactive flows.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Global State
  const AppState = {
    currentFormat: "footage",
    currentTheme: localStorage.getItem("microstockgo_theme") || "theme-obsidian-blue",
    currentActiveAgency: "adobe",
    currentResult: null,
    vaultUnlocked: false
  };

  // --- 1. TOAST SYSTEM ---
  const toastContainer = document.getElementById("toastContainer");
  window.showToast = function(message, type = "success") {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let icon = "✓";
    if (type === "error") icon = "✕";
    if (type === "warning") icon = "⚠️";

    toast.innerHTML = `<span style="font-weight: 800;">${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(30px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  };

  // --- 2. MULTI-DARK THEME MANAGER ---
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const themeMenu = document.getElementById("themeMenu");
  const themeDot = document.getElementById("themeDot");
  const themeLabel = document.getElementById("themeLabel");
  const themeOptions = document.querySelectorAll(".theme-opt");

  const themeMetadata = {
    "theme-obsidian-blue": { name: "Obsidian Blue", color: "#38bdf8" },
    "theme-emerald-green": { name: "Emerald Green", color: "#10b981" },
    "theme-deep-violet": { name: "Deep Violet", color: "#a855f7" },
    "theme-sunset-gold": { name: "Sunset Gold", color: "#f59e0b" },
    "theme-stealth-black": { name: "Stealth OLED", color: "#ffffff" }
  };

  function applyTheme(themeKey) {
    document.body.className = themeKey;
    localStorage.setItem("microstockgo_theme", themeKey);
    AppState.currentTheme = themeKey;

    const meta = themeMetadata[themeKey] || themeMetadata["theme-obsidian-blue"];
    if (themeDot) themeDot.style.background = meta.color;
    if (themeLabel) themeLabel.textContent = meta.name;

    themeOptions.forEach(opt => {
      opt.classList.toggle("active", opt.dataset.theme === themeKey);
    });
  }

  // Apply initial theme
  applyTheme(AppState.currentTheme);

  if (themeToggleBtn && themeMenu) {
    themeToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      themeMenu.classList.toggle("active");
    });

    document.addEventListener("click", () => {
      themeMenu.classList.remove("active");
    });

    themeOptions.forEach(opt => {
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        applyTheme(opt.dataset.theme);
        themeMenu.classList.remove("active");
        showToast(`Tema diubah ke ${opt.textContent.trim()}`, "success");
      });
    });
  }

  // --- 3. MAIN NAVIGATION TABS ---
  const tabNavDiscovery = document.getElementById("tabNavDiscovery");
  const tabNavGap = document.getElementById("tabNavGap");
  const tabNavSeasonal = document.getElementById("tabNavSeasonal");

  const discoveryView = document.getElementById("discoveryView");
  const gapView = document.getElementById("gapView");
  const seasonalView = document.getElementById("seasonalView");

  function switchMainView(targetView, targetTabBtn) {
    [discoveryView, gapView, seasonalView].forEach(view => {
      if (view) view.classList.remove("active");
    });
    [tabNavDiscovery, tabNavGap, tabNavSeasonal].forEach(btn => {
      if (btn) btn.classList.remove("active");
    });

    targetView.classList.add("active");
    targetTabBtn.classList.add("active");

    if (targetView === gapView) renderGapAnalysisTable();
    if (targetView === seasonalView) renderSeasonalRoadmap();
  }

  if (tabNavDiscovery) tabNavDiscovery.addEventListener("click", () => switchMainView(discoveryView, tabNavDiscovery));
  if (tabNavGap) tabNavGap.addEventListener("click", () => switchMainView(gapView, tabNavGap));
  if (tabNavSeasonal) tabNavSeasonal.addEventListener("click", () => switchMainView(seasonalView, tabNavSeasonal));

  // --- 4. ASSET FORMAT SELECTOR ---
  const formatButtons = document.querySelectorAll(".format-btn");
  const topicInput = document.getElementById("topicInput");
  const styleSelect = document.getElementById("styleSelect");
  const styleFilterLabel = document.getElementById("styleFilterLabel");
  const subjectSelect = document.getElementById("subjectSelect");
  const timeframeSelect = document.getElementById("timeframeSelect");
  const discoverBtnIcon = document.getElementById("discoverBtnIcon");
  const discoverBtnText = document.getElementById("discoverBtnText");
  const brainstormTitle = document.getElementById("brainstormTitle");

  function populateStyles(formatKey) {
    if (!styleSelect) return;
    styleSelect.innerHTML = "";
    const formatData = MICROSTOCK_DATA.formats[formatKey];
    if (!formatData) return;

    formatData.styles.forEach(style => {
      const opt = document.createElement("option");
      opt.value = style.id;
      opt.textContent = style.name;
      styleSelect.appendChild(opt);
    });

    if (styleFilterLabel) styleFilterLabel.textContent = `${formatData.name} Style`;
    if (topicInput) topicInput.placeholder = `Cari topik untuk ${formatData.name} (atau biarkan kosong)...`;
    if (discoverBtnIcon) discoverBtnIcon.textContent = formatData.icon;
    if (discoverBtnText) discoverBtnText.textContent = `Discover ${formatData.name} Opportunity`;
    if (brainstormTitle) brainstormTitle.textContent = `BRAINSTORMING IDEAS FOR ${formatData.name.toUpperCase()}:`;
  }

  function setFormat(formatKey) {
    AppState.currentFormat = formatKey;
    formatButtons.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.format === formatKey);
    });
    populateStyles(formatKey);
  }

  formatButtons.forEach(btn => {
    btn.addEventListener("click", () => setFormat(btn.dataset.format));
  });

  // Populate Subject & Timeframe Dropdowns
  if (subjectSelect) {
    subjectSelect.innerHTML = "";
    MICROSTOCK_DATA.subjectModes.forEach(sm => {
      const opt = document.createElement("option");
      opt.value = sm.id;
      opt.textContent = sm.name;
      subjectSelect.appendChild(opt);
    });
  }

  if (timeframeSelect) {
    timeframeSelect.innerHTML = "";
    MICROSTOCK_DATA.timeframes.forEach(tf => {
      const opt = document.createElement("option");
      opt.value = tf.id;
      opt.textContent = tf.name;
      if (tf.id === "upcoming_2m") opt.selected = true;
      timeframeSelect.appendChild(opt);
    });
  }

  // Set default format
  setFormat("footage");

  // --- 5. BRAINSTORMING IDEA CLOUD ---
  const brainstormCategories = document.getElementById("brainstormCategories");
  const btnRefreshIdeas = document.getElementById("btnRefreshIdeas");

  function renderBrainstormIdeas() {
    if (!brainstormCategories) return;
    brainstormCategories.innerHTML = "";

    const categories = [
      { key: "trending", label: "Trending Now" },
      { key: "business", label: "Business" },
      { key: "lifestyle", label: "Lifestyle" },
      { key: "concepts", label: "Concepts" }
    ];

    categories.forEach(cat => {
      const rawList = MICROSTOCK_DATA.brainstormPills[cat.key] || [];
      // Shuffle & pick 4-5
      const shuffled = [...rawList].sort(() => 0.5 - Math.random()).slice(0, 5);

      const row = document.createElement("div");
      row.className = "brainstorm-row";

      const label = document.createElement("div");
      label.className = "cat-label";
      label.textContent = cat.label;

      const pillsWrap = document.createElement("div");
      pillsWrap.className = "pills-wrap";

      shuffled.forEach(topicText => {
        const pill = document.createElement("button");
        pill.type = "button";
        pill.className = "idea-pill";
        pill.textContent = topicText;
        pill.addEventListener("click", () => {
          if (topicInput) topicInput.value = topicText;
          executeDiscovery(topicText);
        });
        pillsWrap.appendChild(pill);
      });

      row.appendChild(label);
      row.appendChild(pillsWrap);
      brainstormCategories.appendChild(row);
    });
  }

  renderBrainstormIdeas();

  if (btnRefreshIdeas) {
    btnRefreshIdeas.addEventListener("click", () => {
      renderBrainstormIdeas();
      showToast("Ide brainstorming diperbarui!", "success");
    });
  }

  // Inspire Me button
  const btnInspireMe = document.getElementById("btnInspireMe");
  if (btnInspireMe) {
    btnInspireMe.addEventListener("click", () => {
      const allIdeas = [
        ...MICROSTOCK_DATA.brainstormPills.trending,
        ...MICROSTOCK_DATA.brainstormPills.business,
        ...MICROSTOCK_DATA.brainstormPills.lifestyle,
        ...MICROSTOCK_DATA.brainstormPills.concepts
      ];
      const randomIdea = allIdeas[Math.floor(Math.random() * allIdeas.length)];
      if (topicInput) topicInput.value = randomIdea;
      executeDiscovery(randomIdea);
      showToast(`Inspire Me: "${randomIdea}"`, "success");
    });
  }

  // --- 6. DISCOVERY & ANALYSIS EXECUTION ---
  const btnDiscover = document.getElementById("btnDiscover");
  const resultsSection = document.getElementById("resultsSection");

  async function executeDiscovery(customQuery = null) {
    const query = customQuery !== null ? customQuery : (topicInput ? topicInput.value.trim() : "");
    const format = AppState.currentFormat;
    const style = styleSelect ? styleSelect.value : "real_4k";
    const subject = subjectSelect ? subjectSelect.value : "with_people";
    const timeframe = timeframeSelect ? timeframeSelect.value : "upcoming_2m";

    // Show loading state on button
    if (btnDiscover) {
      btnDiscover.disabled = true;
      btnDiscover.innerHTML = `<span>⏳</span> Menganalisis Peluang Pasar...`;
    }

    try {
      // Analyze via Gemini Vault (auto-falls back to smart offline engine)
      const result = await GeminiVault.analyzeWithGemini(query || "Sustainable Tech", format, style, subject, timeframe);
      AppState.currentResult = result;

      // Render Results into UI
      renderResult(result);

      if (resultsSection) {
        resultsSection.classList.add("active");
        resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      if (result._geminiNotice) {
        showToast(result._geminiNotice, "warning");
      } else if (GeminiVault.hasKey()) {
        showToast("Dianalisis secara real-time dengan Google Gemini!", "success");
      } else {
        showToast("Peluang berhasil dianalisis dengan Smart Built-in Engine!", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Terjadi kesalahan analisis: " + err.message, "error");
    } finally {
      if (btnDiscover) {
        btnDiscover.disabled = false;
        const formatData = MICROSTOCK_DATA.formats[format] || { icon: "🔍", name: "Aset" };
        btnDiscover.innerHTML = `<span>${formatData.icon}</span> <span>Discover ${formatData.name} Opportunity</span>`;
      }
    }
  }

  if (btnDiscover) {
    btnDiscover.addEventListener("click", () => executeDiscovery());
  }

  if (topicInput) {
    topicInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        executeDiscovery();
      }
    });
  }

  // --- 7. RENDERING RESULT STUDIO ---
  function renderResult(res) {
    // Badges & Topic Header
    const resFormatBadge = document.getElementById("resFormatBadge");
    const resGoldenBadge = document.getElementById("resGoldenBadge");
    const resTierBadge = document.getElementById("resTierBadge");
    const resTopicTitle = document.getElementById("resTopicTitle");
    const resTopicDesc = document.getElementById("resTopicDesc");

    if (resFormatBadge) resFormatBadge.textContent = res.selectedFormat.toUpperCase();
    if (resGoldenBadge) resGoldenBadge.style.display = res.goldenGap ? "inline-flex" : "none";
    if (resTierBadge) resTierBadge.textContent = res.commercialTier;
    if (resTopicTitle) resTopicTitle.textContent = res.topic;
    if (resTopicDesc) resTopicDesc.textContent = res.description;

    // Metrics
    const resDemandScore = document.getElementById("resDemandScore");
    const resDemandMeter = document.getElementById("resDemandMeter");
    const resDemandSub = document.getElementById("resDemandSub");
    const resCompScore = document.getElementById("resCompScore");
    const resCompMeter = document.getElementById("resCompMeter");
    const resCompSub = document.getElementById("resCompSub");
    const resRPIValue = document.getElementById("resRPIValue");
    const resSafetyScore = document.getElementById("resSafetyScore");
    const resSafetyVerdict = document.getElementById("resSafetyVerdict");

    if (resDemandScore) resDemandScore.textContent = res.demandScore;
    if (resDemandMeter) resDemandMeter.style.width = `${res.demandScore}%`;
    if (resDemandSub) {
      resDemandSub.textContent = res.demandScore > 90 ? "Permintaan Pembeli Sangat Tinggi" : "Permintaan Stabil";
    }

    if (resCompScore) resCompScore.textContent = res.competitionScore;
    if (resCompMeter) resCompMeter.style.width = `${res.competitionScore}%`;
    if (resCompSub) {
      resCompSub.textContent = res.competitionScore < 35 ? "Rendah (Peluang Blue Ocean)" : (res.competitionScore < 50 ? "Moderat (Kompetitif)" : "Tinggi (Pasar Jenuh)");
    }

    if (resRPIValue) resRPIValue.textContent = res.avgRPI || "$2.50 - $5.00";
    if (resSafetyScore) resSafetyScore.textContent = `${res.safetyCheck?.safetyScore || 100}%`;
    if (resSafetyVerdict) resSafetyVerdict.textContent = res.safetyCheck?.verdict || "Aman untuk lisensi komersial";

    // Optimized Title
    const resTitleText = document.getElementById("resTitleText");
    if (resTitleText) resTitleText.textContent = res.title;

    // Render Keywords Studio
    renderKeywordsStudio(res, AppState.currentActiveAgency);

    // Render Shot List
    renderShotList(res.shotList);

    // Render AI Prompts
    renderAiPrompts(res.aiPrompts);

    // Render Safety & Editorial Specs
    renderSafetyAndEditorial(res);

    // Update Pinboard Button State
    updatePinButtonState(res.id);
  }

  // Keywords Studio Rendering
  const tagsCloudContainer = document.getElementById("tagsCloudContainer");
  const tagCountDisplay = document.getElementById("tagCountDisplay");
  const agencyButtons = document.querySelectorAll(".agency-btn");

  function renderKeywordsStudio(res, agencyKey = "adobe") {
    AppState.currentActiveAgency = agencyKey;
    agencyButtons.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.agency === agencyKey);
    });

    if (!tagsCloudContainer) return;
    tagsCloudContainer.innerHTML = "";

    const agencyData = res.agencyKeywords ? res.agencyKeywords[agencyKey] : null;
    const tagList = agencyData ? (agencyData.tags || agencyData.priority ? [...(agencyData.priority || []), ...(agencyData.remaining || [])] : agencyData.tags || []) : (res.tagsCore || []);

    if (tagCountDisplay) tagCountDisplay.textContent = tagList.length;

    tagList.forEach((tag, idx) => {
      const badge = document.createElement("span");
      badge.className = "tag-badge";
      if (agencyKey === "adobe" && idx < 10) {
        badge.classList.add("priority");
      }

      badge.innerHTML = `<span class="tag-num">#${idx + 1}</span> ${tag}`;
      badge.title = "Klik untuk menyalin tag ini";
      badge.addEventListener("click", () => {
        MicrostockExport.copyText(tag, `Tag "${tag}" tersalin!`);
      });

      tagsCloudContainer.appendChild(badge);
    });
  }

  agencyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (AppState.currentResult) {
        renderKeywordsStudio(AppState.currentResult, btn.dataset.agency);
      }
    });
  });

  // Copy Action Buttons
  const btnCopyTitle = document.getElementById("btnCopyTitle");
  if (btnCopyTitle) {
    btnCopyTitle.addEventListener("click", () => {
      const title = document.getElementById("resTitleText")?.textContent || "";
      MicrostockExport.copyText(title, "Judul teroptimasi tersalin!");
    });
  }

  const btnCopyAllTags = document.getElementById("btnCopyAllTags");
  if (btnCopyAllTags) {
    btnCopyAllTags.addEventListener("click", () => {
      if (!AppState.currentResult) return;
      const agencyData = AppState.currentResult.agencyKeywords?.[AppState.currentActiveAgency];
      const tagsText = agencyData?.commaSeparated || AppState.currentResult.tagsCore?.join(", ") || "";
      MicrostockExport.copyText(tagsText, `Semua ${agencyData?.count || 50} tags format ${AppState.currentActiveAgency.toUpperCase()} tersalin!`);
    });
  }

  // 5-Angle Shot List Rendering
  const shotListContainer = document.getElementById("shotListContainer");
  function renderShotList(shotList) {
    if (!shotListContainer || !shotList) return;
    shotListContainer.innerHTML = "";

    shotList.forEach((item, index) => {
      const el = document.createElement("div");
      el.className = "shot-item";
      el.innerHTML = `
        <div class="shot-num">${index + 1}</div>
        <div class="shot-content">
          <div class="shot-angle">${item.angle}</div>
          <div class="shot-desc">${item.shot}</div>
        </div>
      `;
      shotListContainer.appendChild(el);
    });
  }

  // AI Prompts Rendering
  const promptImgText = document.getElementById("promptImgText");
  const promptVidText = document.getElementById("promptVidText");
  const promptNegText = document.getElementById("promptNegText");

  function renderAiPrompts(aiPrompts) {
    if (promptImgText) promptImgText.textContent = aiPrompts?.image || "";
    if (promptVidText) promptVidText.textContent = aiPrompts?.video || "";
    if (promptNegText) promptNegText.textContent = aiPrompts?.negative || "";
  }

  document.getElementById("btnCopyPromptImg")?.addEventListener("click", () => {
    MicrostockExport.copyText(promptImgText?.textContent || "", "Prompt gambar/vector tersalin!");
  });
  document.getElementById("btnCopyPromptVid")?.addEventListener("click", () => {
    MicrostockExport.copyText(promptVidText?.textContent || "", "Prompt footage/video tersalin!");
  });
  document.getElementById("btnCopyPromptNeg")?.addEventListener("click", () => {
    MicrostockExport.copyText(promptNegText?.textContent || "", "Negative prompt tersalin!");
  });

  // Safety & Editorial Specs Rendering
  const safetyAlertBox = document.getElementById("safetyAlertBox");
  const safetyAlertIcon = document.getElementById("safetyAlertIcon");
  const safetyAlertTitle = document.getElementById("safetyAlertTitle");
  const safetyAlertDesc = document.getElementById("safetyAlertDesc");
  const resEditorialText = document.getElementById("resEditorialText");
  const techSpecsGrid = document.getElementById("techSpecsGrid");

  function renderSafetyAndEditorial(res) {
    const isSafe = res.safetyCheck?.isSafe;
    if (safetyAlertBox) {
      safetyAlertBox.className = `safety-alert-box ${isSafe ? "safe" : "warning"}`;
    }
    if (safetyAlertIcon) safetyAlertIcon.textContent = isSafe ? "🛡️" : "⚠️";
    if (safetyAlertTitle) {
      safetyAlertTitle.textContent = isSafe ? "Pemeriksaan Hak Cipta & Merek (100% IP Safe)" : "Peringatan Kata Kunci Terdaftar!";
    }
    if (safetyAlertDesc) {
      if (isSafe) {
        safetyAlertDesc.textContent = "Tidak ditemukan kata kunci merek dagang terdaftar. Aman untuk didistribusikan dengan lisensi komersial ke Adobe Stock & Shutterstock.";
      } else {
        const words = res.safetyCheck.flaggedWords.map(w => `${w.word} (${w.reason})`).join(", ");
        safetyAlertDesc.innerHTML = `<span style="color: #f59e0b; font-weight: 700;">Terdeteksi merek dagang:</span> ${words}. Hapus kata-kata ini sebelum submit komersial.`;
      }
    }

    if (resEditorialText) resEditorialText.textContent = res.editorialCaption || "";

    // Technical Format Specs
    if (techSpecsGrid) {
      techSpecsGrid.innerHTML = "";
      const formatData = MICROSTOCK_DATA.formats[res.selectedFormat] || MICROSTOCK_DATA.formats.raster;
      for (const [key, val] of Object.entries(formatData.technicalSpecs)) {
        const item = document.createElement("div");
        item.className = "spec-item";
        item.innerHTML = `
          <span class="spec-label">${key.replace(/([A-Z])/g, ' $1')}</span>
          <span class="spec-val">${val}</span>
        `;
        techSpecsGrid.appendChild(item);
      }
    }
  }

  document.getElementById("btnCopyEditorial")?.addEventListener("click", () => {
    MicrostockExport.copyText(resEditorialText?.textContent || "", "Takarir editorial resmi tersalin!");
  });

  // Studio Sub-Tabs Switching
  const studioTabButtons = document.querySelectorAll(".studio-tab-btn");
  const studioPanels = {
    keywords: document.getElementById("studioKeywords"),
    shotlist: document.getElementById("studioShotlist"),
    prompts: document.getElementById("studioPrompts"),
    safety: document.getElementById("studioSafety")
  };

  studioTabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      studioTabButtons.forEach(b => b.classList.remove("active"));
      Object.values(studioPanels).forEach(p => p && p.classList.remove("active"));

      btn.classList.add("active");
      const targetPanel = studioPanels[btn.dataset.studio];
      if (targetPanel) targetPanel.classList.add("active");
    });
  });

  // --- 8. PINBOARD & CSV EXPORTER MODAL ---
  const btnOpenPinboard = document.getElementById("btnOpenPinboard");
  const pinboardModal = document.getElementById("pinboardModal");
  const btnClosePinboard = document.getElementById("btnClosePinboard");
  const pinboardCountBadge = document.getElementById("pinboardCountBadge");
  const pinboardItemsContainer = document.getElementById("pinboardItemsContainer");
  const btnPinItem = document.getElementById("btnPinItem");
  const pinBtnLabel = document.getElementById("pinBtnLabel");

  function updatePinboardBadge() {
    const items = MicrostockExport.getPinnedItems();
    if (pinboardCountBadge) pinboardCountBadge.textContent = items.length;
  }

  function updatePinButtonState(id) {
    if (!btnPinItem) return;
    const isPinned = MicrostockExport.isPinned(id);
    btnPinItem.classList.toggle("pinned", isPinned);
    if (pinBtnLabel) pinBtnLabel.textContent = isPinned ? "Tersimpan di Pinboard" : "Simpan ke Pinboard";
  }

  if (btnPinItem) {
    btnPinItem.addEventListener("click", () => {
      if (!AppState.currentResult) return;
      const { pinned } = MicrostockExport.togglePin(AppState.currentResult);
      updatePinButtonState(AppState.currentResult.id);
      updatePinboardBadge();
      showToast(pinned ? "Berhasil disimpan ke Pinboard!" : "Dihapus dari Pinboard", pinned ? "success" : "warning");
    });
  }

  function renderPinboardModalItems() {
    if (!pinboardItemsContainer) return;
    const items = MicrostockExport.getPinnedItems();
    pinboardItemsContainer.innerHTML = "";

    if (items.length === 0) {
      pinboardItemsContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-faint); padding: 30px;">
          Belum ada item yang disimpan. Klik tombol "Simpan ke Pinboard" pada hasil riset untuk menambahkannya ke sini.
        </div>
      `;
      return;
    }

    items.forEach(item => {
      const row = document.createElement("div");
      row.className = "event-row";
      row.innerHTML = `
        <div>
          <div style="font-weight: 700; color: var(--text-main); font-size: 0.95rem;">${item.topic}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${item.format.toUpperCase()} • Demand: ${item.demandScore} • Comp: ${item.competitionScore}</div>
        </div>
        <button class="btn-ctrl btn-remove-pin" data-id="${item.id}" style="padding: 4px 8px; color: #ef4444;" title="Hapus">✕</button>
      `;

      row.querySelector(".btn-remove-pin").addEventListener("click", (e) => {
        e.stopPropagation();
        MicrostockExport.removePin(item.id);
        renderPinboardModalItems();
        updatePinboardBadge();
        if (AppState.currentResult && AppState.currentResult.id === item.id) {
          updatePinButtonState(item.id);
        }
      });

      pinboardItemsContainer.appendChild(row);
    });
  }

  if (btnOpenPinboard && pinboardModal) {
    btnOpenPinboard.addEventListener("click", () => {
      renderPinboardModalItems();
      pinboardModal.classList.add("active");
    });

    btnClosePinboard?.addEventListener("click", () => {
      pinboardModal.classList.remove("active");
    });

    pinboardModal.addEventListener("click", (e) => {
      if (e.target === pinboardModal) pinboardModal.classList.remove("active");
    });
  }

  // CSV Export Triggers
  document.getElementById("btnExportAdobe")?.addEventListener("click", () => {
    MicrostockExport.exportToCSV(MicrostockExport.getPinnedItems(), "adobe");
  });
  document.getElementById("btnExportShutter")?.addEventListener("click", () => {
    MicrostockExport.exportToCSV(MicrostockExport.getPinnedItems(), "shutterstock");
  });
  document.getElementById("btnExportFreepik")?.addEventListener("click", () => {
    MicrostockExport.exportToCSV(MicrostockExport.getPinnedItems(), "freepik");
  });
  document.getElementById("btnClearPinboard")?.addEventListener("click", () => {
    if (confirm("Kosongkan seluruh koleksi Pinboard?")) {
      MicrostockExport.clearPinboard();
      renderPinboardModalItems();
      updatePinboardBadge();
      if (AppState.currentResult) updatePinButtonState(AppState.currentResult.id);
      showToast("Pinboard dikosongkan", "warning");
    }
  });

  updatePinboardBadge();

  // --- 9. ADMIN SECURITY VAULT MODAL ---
  const btnOpenVault = document.getElementById("btnOpenVault");
  const vaultModal = document.getElementById("vaultModal");
  const btnCloseVault = document.getElementById("btnCloseVault");
  const vaultPinStep = document.getElementById("vaultPinStep");
  const vaultSettingsStep = document.getElementById("vaultSettingsStep");
  const vaultPinInput = document.getElementById("vaultPinInput");
  const btnVerifyPin = document.getElementById("btnVerifyPin");
  const vaultApiKeyInput = document.getElementById("vaultApiKeyInput");
  const vaultNewPinInput = document.getElementById("vaultNewPinInput");
  const btnSaveVault = document.getElementById("btnSaveVault");
  const btnLockVault = document.getElementById("btnLockVault");
  const vaultStatusDot = document.getElementById("vaultStatusDot");

  function updateVaultStatusUI() {
    const hasKey = GeminiVault.hasKey();
    if (vaultStatusDot) {
      vaultStatusDot.classList.toggle("inactive", !hasKey);
      vaultStatusDot.title = hasKey ? "Gemini API Aktif" : "Mode Bawaan / Offline Engine";
    }
  }

  updateVaultStatusUI();

  if (btnOpenVault && vaultModal) {
    btnOpenVault.addEventListener("click", () => {
      vaultPinInput.value = "";
      if (AppState.vaultUnlocked) {
        vaultPinStep.style.display = "none";
        vaultSettingsStep.style.display = "block";
        vaultApiKeyInput.value = GeminiVault.getKey();
      } else {
        vaultPinStep.style.display = "block";
        vaultSettingsStep.style.display = "none";
      }
      vaultModal.classList.add("active");
    });

    btnCloseVault?.addEventListener("click", () => {
      vaultModal.classList.remove("active");
    });

    vaultModal.addEventListener("click", (e) => {
      if (e.target === vaultModal) vaultModal.classList.remove("active");
    });
  }

  if (btnVerifyPin) {
    btnVerifyPin.addEventListener("click", () => {
      const pin = vaultPinInput.value.trim();
      if (GeminiVault.verifyPin(pin)) {
        AppState.vaultUnlocked = true;
        vaultPinStep.style.display = "none";
        vaultSettingsStep.style.display = "block";
        vaultApiKeyInput.value = GeminiVault.getKey();
        showToast("Master PIN terverifikasi!", "success");
      } else {
        showToast("PIN salah! Default PIN adalah 1234", "error");
      }
    });
  }

  if (btnSaveVault) {
    btnSaveVault.addEventListener("click", () => {
      const key = vaultApiKeyInput.value.trim();
      const newPin = vaultNewPinInput.value.trim();

      GeminiVault.saveKey(key);

      if (newPin) {
        try {
          GeminiVault.setPin(newPin);
          showToast("PIN Admin berhasil diubah!", "success");
          vaultNewPinInput.value = "";
        } catch (err) {
          showToast(err.message, "error");
          return;
        }
      }

      updateVaultStatusUI();
      showToast("Pengaturan Vault berhasil disimpan!", "success");
      vaultModal.classList.remove("active");
    });
  }

  if (btnLockVault) {
    btnLockVault.addEventListener("click", () => {
      AppState.vaultUnlocked = false;
      vaultPinStep.style.display = "block";
      vaultSettingsStep.style.display = "none";
      vaultModal.classList.remove("active");
      showToast("Vault terkunci kembali 🔒", "info");
    });
  }

  // --- 10. GAP ANALYSIS MATRIX TABLE VIEW ---
  const matrixTableBody = document.getElementById("matrixTableBody");
  const gapCategoryFilters = document.getElementById("gapCategoryFilters");
  const gapSortSelect = document.getElementById("gapSortSelect");

  let currentGapCat = "all";
  let currentGapSort = "opportunity";

  function renderGapAnalysisTable() {
    if (!matrixTableBody) return;
    matrixTableBody.innerHTML = "";

    const items = MicrostockEngine.getGapAnalysisTable(currentGapCat, "all", currentGapSort);

    items.forEach(item => {
      const tr = document.createElement("tr");

      const formatBadges = item.formats.map(f => `<span class="badge-format" style="margin-right: 4px;">${f}</span>`).join("");
      const oppStatus = item.goldenGap 
        ? `<span class="badge-golden">⭐ Golden Gap</span>` 
        : (item.demandScore > 90 ? `<span class="score-badge mid">High Volume</span>` : `<span class="score-badge low">Standard</span>`);

      tr.innerHTML = `
        <td style="font-weight: 700; color: var(--text-main);">${item.topic}</td>
        <td>${formatBadges}</td>
        <td><span class="score-badge high">${item.demandScore} / 100</span></td>
        <td><span class="score-badge ${item.competitionScore < 35 ? 'low' : 'mid'}">${item.competitionScore} / 100</span></td>
        <td>${oppStatus}</td>
        <td style="font-weight: 600; color: var(--accent-secondary);">${item.avgRPI}</td>
        <td>
          <button class="btn-ctrl btn-analyze-gap" style="padding: 6px 12px; font-size: 0.8rem;">
            Riset Topik 🚀
          </button>
        </td>
      `;

      tr.querySelector(".btn-analyze-gap").addEventListener("click", () => {
        switchMainView(discoveryView, tabNavDiscovery);
        if (topicInput) topicInput.value = item.topic;
        setFormat(item.formats[0] || "footage");
        executeDiscovery(item.topic);
      });

      matrixTableBody.appendChild(tr);
    });
  }

  if (gapCategoryFilters) {
    gapCategoryFilters.querySelectorAll(".filter-pill-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        gapCategoryFilters.querySelectorAll(".filter-pill-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentGapCat = btn.dataset.cat;
        renderGapAnalysisTable();
      });
    });
  }

  if (gapSortSelect) {
    gapSortSelect.addEventListener("change", (e) => {
      currentGapSort = e.target.value;
      renderGapAnalysisTable();
    });
  }

  // --- 11. SEASONAL ROADMAP VIEW ---
  const quartersGrid = document.getElementById("quartersGrid");
  function renderSeasonalRoadmap() {
    if (!quartersGrid) return;
    quartersGrid.innerHTML = "";

    MICROSTOCK_DATA.seasonalRoadmap.forEach(q => {
      const card = document.createElement("div");
      card.className = "quarter-card";

      let eventsHtml = "";
      q.events.forEach(ev => {
        eventsHtml += `
          <div class="event-row">
            <span class="event-name">${ev.icon} ${ev.title}</span>
            <span class="event-lead">${ev.leadTime}</span>
          </div>
        `;
      });

      card.innerHTML = `
        <div class="quarter-header">
          <div class="quarter-title">${q.quarter}</div>
          <div class="quarter-focus">${q.focusMonth}</div>
        </div>
        <div class="seasonal-events-list">
          ${eventsHtml}
        </div>
      `;

      quartersGrid.appendChild(card);
    });
  }

    // --- 12. MONETIZATION, DONATION & STICKY FOOTER ---
  const btnOpenDonation = document.getElementById("btnOpenDonation");
  const donationModal = document.getElementById("donationModal");
  const btnCloseDonation = document.getElementById("btnCloseDonation");
  const btnCloseStickyAd = document.getElementById("btnCloseStickyAd");
  const adStickyFooter = document.getElementById("adStickyFooter");

  if (btnOpenDonation && donationModal) {
    btnOpenDonation.addEventListener("click", () => {
      donationModal.classList.add("active");
    });
    btnCloseDonation?.addEventListener("click", () => {
      donationModal.classList.remove("active");
    });
    donationModal.addEventListener("click", (e) => {
      if (e.target === donationModal) donationModal.classList.remove("active");
    });
  }

  if (btnCloseStickyAd && adStickyFooter) {
    btnCloseStickyAd.addEventListener("click", () => {
      adStickyFooter.style.display = "none";
      showToast("Bar notifikasi ditutup", "info");
    });
  }

  // Trigger default initial analysis for immediate engagement!
  executeDiscovery("EV Charging Infrastructure & Smart Fleet");
});
