/**
 * Microstockgo - Exporter & Pinboard Manager
 * Handles CSV Generation for Adobe Stock, Shutterstock, Freepik, and Pinboard Storage
 */

const MicrostockExport = {
  PINBOARD_KEY: "microstockgo_pinboard_items",

  getPinnedItems() {
    try {
      const data = localStorage.getItem(this.PINBOARD_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  isPinned(id) {
    const items = this.getPinnedItems();
    return items.some(item => item.id === id);
  },

  togglePin(item) {
    let items = this.getPinnedItems();
    const index = items.findIndex(i => i.id === item.id);
    let pinned = false;

    if (index >= 0) {
      items.splice(index, 1);
      pinned = false;
    } else {
      items.unshift({
        id: item.id || ("item_" + Date.now()),
        topic: item.topic,
        title: item.title,
        demandScore: item.demandScore,
        competitionScore: item.competitionScore,
        goldenGap: item.goldenGap,
        format: item.selectedFormat || "raster",
        keywords: item.agencyKeywords?.adobe?.commaSeparated || item.tagsCore?.join(", ") || "",
        addedAt: new Date().toLocaleDateString()
      });
      pinned = true;
    }

    localStorage.setItem(this.PINBOARD_KEY, JSON.stringify(items));
    return { pinned, count: items.length };
  },

  removePin(id) {
    let items = this.getPinnedItems().filter(i => i.id !== id);
    localStorage.setItem(this.PINBOARD_KEY, JSON.stringify(items));
    return items;
  },

  clearPinboard() {
    localStorage.removeItem(this.PINBOARD_KEY);
  },

  /**
   * Copy string to clipboard with feedback
   */
  async copyText(text, successMessage = "Tersalin ke clipboard!") {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-999999px";
        textarea.style.top = "-999999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      if (window.showToast) {
        window.showToast(successMessage, "success");
      }
      return true;
    } catch (err) {
      console.error("Copy failed:", err);
      if (window.showToast) {
        window.showToast("Gagal menyalin teks", "error");
      }
      return false;
    }
  },

  /**
   * Generate CSV for Microstock Agencies
   * @param {Array} items - List of research items or pinboard items
   * @param {string} agency - 'adobe', 'shutterstock', or 'freepik'
   */
  exportToCSV(items, agency = "adobe") {
    if (!items || items.length === 0) {
      if (window.showToast) window.showToast("Tidak ada item untuk diekspor", "warning");
      return;
    }

    let csvContent = "";
    const clean = (str) => `"${(str || "").replace(/"/g, '""')}"`;

    if (agency === "adobe") {
      // Adobe Stock CSV Standard: Filename, Title, Keywords, Category, Releases
      csvContent += "Filename,Title,Keywords,Category,Releases\r\n";
      items.forEach((item, index) => {
        const filename = `asset_${index + 1}_${(item.topic || 'stock').toLowerCase().replace(/[^a-z0-9]/g, '_')}.jpg`;
        const title = clean(item.title || item.topic);
        const keywords = clean(item.agencyKeywords?.adobe?.commaSeparated || item.keywords || "");
        const category = clean(item.category || "Business");
        const releases = clean("");
        csvContent += `${filename},${title},${keywords},${category},${releases}\r\n`;
      });
    } else if (agency === "shutterstock") {
      // Shutterstock CSV Standard: Filename, Description, Keywords, Categories, Editorial, Mature
      csvContent += "Filename,Description,Keywords,Categories,Editorial,Mature\r\n";
      items.forEach((item, index) => {
        const filename = `asset_${index + 1}_${(item.topic || 'stock').toLowerCase().replace(/[^a-z0-9]/g, '_')}.jpg`;
        const description = clean(item.title || item.topic);
        const keywords = clean(item.agencyKeywords?.shutterstock?.commaSeparated || item.keywords || "");
        const categories = clean("Technology, Business/Finance");
        const editorial = clean("no");
        const mature = clean("no");
        csvContent += `${filename},${description},${keywords},${categories},${editorial},${mature}\r\n`;
      });
    } else if (agency === "freepik") {
      // Freepik CSV Standard: Filename, Title, Tags
      csvContent += "Filename,Title,Tags\r\n";
      items.forEach((item, index) => {
        const filename = `asset_${index + 1}_${(item.topic || 'stock').toLowerCase().replace(/[^a-z0-9]/g, '_')}.jpg`;
        const title = clean(item.title || item.topic);
        const tags = clean(item.agencyKeywords?.freepik?.commaSeparated || item.keywords || "");
        csvContent += `${filename},${title},${tags}\r\n`;
      });
    }

    // Trigger Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Microstockgo_${agency.toUpperCase()}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    if (window.showToast) {
      window.showToast(`Berhasil mengekspor CSV format ${agency.toUpperCase()}!`, "success");
    }
  }
};
