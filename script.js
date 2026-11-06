

// Helper to retrieve images list from visualPool
function getHotelImages(hotel) {
  let list = [];
  if (Array.isArray(visualPool)) {
    const found = visualPool.find((v) => v && (v.nama === hotel.nama || v.name === hotel.nama));
    if (found) {
      if (Array.isArray(found.images)) list = found.images;
      else if (Array.isArray(found.photos)) list = found.photos;
      else if (typeof found.image === "string") list = [found.image];
    } else if (visualPool.length > 0 && typeof visualPool[0] === "string") {
      list = visualPool;
    }
  } else if (visualPool && typeof visualPool === "object") {
    const entry = visualPool[hotel.nama];
    if (Array.isArray(entry)) {
      list = entry;
    } else if (typeof entry === "string") {
      list = [entry];
    }
  }

  if (hotel.foto_langsung && !list.includes(hotel.foto_langsung)) {
    list = [hotel.foto_langsung, ...list];
  }

  return list;
}

// State management
let state = {
  data: rawHotels.map((item, index) => {
    const images = getHotelImages(item);
    // Ambil data pertama sebagai cover image
    const coverImage = images[0] || item.foto_langsung || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";

    return {
      id: index + 1,
      ...item,
      images,
      coverImage,
    };
  }),
  selectedCity: "all",
  selectedCategory: "all",
  searchQuery: "",
  sortBy: "random",
  randomOrder: {},
  viewMode: "grid",
  onlyFavorites: false,
  favorites: JSON.parse(localStorage.getItem("stayvibe_favs") || "[]"),
};

function reshuffleRandomOrder() {
  state.randomOrder = {};
  state.data.forEach((h) => {
    state.randomOrder[h.id] = Math.random();
  });
}

function reshuffle() {
  state.sortBy = "random";
  const select = document.getElementById("sortBy");
  if (select) select.value = "random";
  reshuffleRandomOrder();
  render();
}

function handleSortChange() {
  const select = document.getElementById("sortBy");
  const sortType = select ? select.value : state.sortBy;
  state.sortBy = sortType;
  if (sortType === "random") {
    reshuffleRandomOrder();
  }
  render();
}

reshuffleRandomOrder();

// Format Rupiah
function formatIDR(amount) {
  if (amount === null || amount === undefined) return null;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getApproxPrice(hotel) {
  if (hotel.harga_mulai_dari_idr) {
    return hotel.harga_mulai_dari_idr;
  }
  if (hotel.perkiraan_harga_idr) {
    // Approximate midpoint for sorting
    return 1100000;
  }
  return 9999999;
}

function getStarScore(hotel) {
  if (typeof hotel.bintang === "number") return hotel.bintang;
  if (typeof hotel.bintang === "string") {
    const num = parseFloat(hotel.bintang);
    if (!isNaN(num)) return num;
  }
  return 3.5; // default fallback for aesthetic
}

// Toggle favorite
function toggleFavorite(id, event) {
  if (event) event.stopPropagation();
  const idx = state.favorites.indexOf(id);
  if (idx > -1) {
    state.favorites.splice(idx, 1);
  } else {
    state.favorites.push(id);
  }
  localStorage.setItem("stayvibe_favs", JSON.stringify(state.favorites));
  updateFavBadge();
  render();
}

function updateFavBadge() {
  const countEl = document.getElementById("favoriteCount");
  if (countEl) countEl.innerText = state.favorites.length;
}

function toggleFavoriteFilter() {
  state.onlyFavorites = !state.onlyFavorites;
  const btn = document.getElementById("favoriteFilterBtn");
  if (state.onlyFavorites) {
    btn.classList.add("bg-amber-50", "border-amber-400", "text-amber-800");
    btn.classList.remove("bg-white", "text-slate-700");
  } else {
    btn.classList.remove("bg-amber-50", "border-amber-400", "text-amber-800");
    btn.classList.add("bg-white", "text-slate-700");
  }
  render();
}

function setCityFilter(city) {
  state.selectedCity = city;
  document.querySelectorAll(".city-btn").forEach((btn) => {
    if (btn.dataset.city === city) {
      btn.className = "city-btn px-3 py-1.5 rounded-lg font-medium transition bg-slate-900 text-white shadow-sm";
    } else {
      btn.className = "city-btn px-3 py-1.5 rounded-lg font-medium transition bg-slate-100 hover:bg-slate-200 text-slate-600";
    }
  });
  render();
}

function setCategoryFilter(category) {
  state.selectedCategory = category;
  document.querySelectorAll(".cat-btn").forEach((btn) => {
    if (btn.dataset.cat === category) {
      btn.className = "cat-btn px-3 py-1.5 rounded-lg font-medium transition bg-brand-600 text-white shadow-sm";
    } else {
      btn.className = "cat-btn px-3 py-1.5 rounded-lg font-medium transition bg-slate-100 hover:bg-slate-200 text-slate-600";
    }
  });
  render();
}

function handleSearch() {
  const val = document.getElementById("searchInput").value;
  state.searchQuery = val.trim().toLowerCase();
  const clearBtn = document.getElementById("clearSearchBtn");
  if (state.searchQuery) {
    clearBtn.classList.remove("hidden");
  } else {
    clearBtn.classList.add("hidden");
  }
  render();
}

function clearSearch() {
  document.getElementById("searchInput").value = "";
  state.searchQuery = "";
  document.getElementById("clearSearchBtn").classList.add("hidden");
  render();
}

function resetAllFilters() {
  state.selectedCity = "all";
  state.selectedCategory = "all";
  state.searchQuery = "";
  state.sortBy = "random";
  state.onlyFavorites = false;
  document.getElementById("searchInput").value = "";
  document.getElementById("sortBy").value = "random";
  document.getElementById("clearSearchBtn").classList.add("hidden");

  const favBtn = document.getElementById("favoriteFilterBtn");
  favBtn.classList.remove("bg-amber-50", "border-amber-400", "text-amber-800");
  favBtn.classList.add("bg-white", "text-slate-700");

  setCityFilter("all");
  setCategoryFilter("all");
}

function setViewMode(mode) {
  state.viewMode = mode;
  const gridBtn = document.getElementById("viewGridBtn");
  const listBtn = document.getElementById("viewListBtn");
  const gridContainer = document.getElementById("hotelGrid");
  const listContainer = document.getElementById("hotelList");

  if (mode === "grid") {
    gridBtn.className = "p-1.5 rounded-lg bg-slate-900 text-white transition";
    listBtn.className = "p-1.5 rounded-lg text-slate-500 hover:text-slate-900 transition";
    gridContainer.classList.remove("hidden");
    listContainer.classList.add("hidden");
  } else {
    listBtn.className = "p-1.5 rounded-lg bg-slate-900 text-white transition";
    gridBtn.className = "p-1.5 rounded-lg text-slate-500 hover:text-slate-900 transition";
    gridContainer.classList.add("hidden");
    listContainer.classList.remove("hidden");
  }
}

function getFilteredData() {
  return state.data
    .filter((hotel) => {
      // City match
      if (state.selectedCity !== "all" && hotel.kota !== state.selectedCity) {
        return false;
      }

      // Category match
      if (state.selectedCategory !== "all" && hotel.kategori !== state.selectedCategory) {
        return false;
      }

      // Favorites match
      if (state.onlyFavorites && !state.favorites.includes(hotel.id)) {
        return false;
      }

      // Search match
      if (state.searchQuery) {
        const nameMatch = hotel.nama.toLowerCase().includes(state.searchQuery);
        const addrMatch = hotel.alamat ? hotel.alamat.toLowerCase().includes(state.searchQuery) : false;
        const cityMatch = hotel.kota.toLowerCase().includes(state.searchQuery);
        if (!nameMatch && !addrMatch && !cityMatch) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      const sortType = document.getElementById("sortBy")?.value || state.sortBy;
      if (sortType === "random") {
        return (state.randomOrder[a.id] ?? 0) - (state.randomOrder[b.id] ?? 0);
      }
      if (sortType === "price_asc") {
        return getApproxPrice(a) - getApproxPrice(b);
      }
      if (sortType === "price_desc") {
        return getApproxPrice(b) - getApproxPrice(a);
      }
      if (sortType === "name_asc") {
        return a.nama.localeCompare(b.nama);
      }
      if (sortType === "stars_desc") {
        return getStarScore(b) - getStarScore(a);
      }
      return a.id - b.id; // default featured order
    });
}

function renderStars(bintang) {
  if (!bintang) {
    return `<span class="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ring-emerald-600/20"><i data-lucide="sparkles" class="w-3 h-3"></i> Estetik</span>`;
  }
  return `<span class="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ring-amber-600/20"><i data-lucide="star" class="w-3 h-3 fill-amber-400 text-amber-500"></i> ${bintang} ${typeof bintang === "number" ? "Bintang" : ""}</span>`;
}

function renderCategoryBadge(kategori) {
  if (kategori === "bintang_rendah_estetik") {
    return `<span class="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">Boutique & Estetik</span>`;
  }
  return `<span class="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">Bintang 4-5 Value</span>`;
}

function renderPriceTag(hotel) {
  if (hotel.harga_mulai_dari_idr) {
    return `
          <div class="flex items-baseline gap-1">
            <span class="text-xs text-slate-500 font-medium">Mulai</span>
            <span class="text-lg font-bold text-slate-900">${formatIDR(hotel.harga_mulai_dari_idr)}</span>
            <span class="text-[11px] text-slate-400">/malam</span>
          </div>
        `;
  }
  if (hotel.perkiraan_harga_idr) {
    return `
          <div>
            <div class="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Perkiraan</div>
            <div class="text-sm font-bold text-slate-900">Rp 1.000.000 - 1.200.000</div>
          </div>
        `;
  }
  return `<span class="text-xs text-slate-400 italic">Hubungi hotel</span>`;
}

function render() {
  const hotels = getFilteredData();
  const grid = document.getElementById("hotelGrid");
  const tableBody = document.getElementById("hotelTableBody");
  const emptyState = document.getElementById("emptyState");
  const countEl = document.getElementById("currentCount");
  const resetBox = document.getElementById("resetFiltersBox");

  countEl.innerText = hotels.length;

  const isFiltered = state.selectedCity !== "all" || state.selectedCategory !== "all" || state.searchQuery !== "" || state.onlyFavorites;
  resetBox.classList.toggle("hidden", !isFiltered);

  if (hotels.length === 0) {
    grid.innerHTML = "";
    tableBody.innerHTML = "";
    emptyState.classList.remove("hidden");
    lucide.createIcons();
    return;
  }

  emptyState.classList.add("hidden");

  // 1. Render Grid
  grid.innerHTML = hotels
    .map((hotel) => {
      const isFav = state.favorites.includes(hotel.id);
      const cityColor =
        {
          Surabaya: "bg-sky-50 text-sky-700 border-sky-200",
          Mojokerto: "bg-emerald-50 text-emerald-700 border-emerald-200",
          Sidoarjo: "bg-indigo-50 text-indigo-700 border-indigo-200",
          Malang: "bg-amber-50 text-amber-700 border-amber-200",
        }[hotel.kota] || "bg-slate-100 text-slate-700 border-slate-200";

      return `
          <div class="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden">
            <!-- Image Card Header -->
            <div class="relative h-48 w-full overflow-hidden bg-slate-100">
              <img 
                src="${hotel.coverImage}" 
                alt="${hotel.nama}" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="lazy"
                onerror="this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

              <!-- Top floating badges -->
              <div class="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                <span class="px-2.5 py-1 rounded-xl text-xs font-semibold backdrop-blur-md bg-white/90 text-slate-800 shadow-sm flex items-center gap-1 border border-white/40">
                  <i data-lucide="map-pin" class="w-3 h-3 text-brand-600"></i>
                  ${hotel.kota}
                </span>

                <button 
                  onclick="toggleFavorite(${hotel.id}, event)" 
                  class="w-8 h-8 rounded-full backdrop-blur-md bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center transition shadow-sm active:scale-90"
                  title="Simpan ke favorit"
                >
                  <i data-lucide="bookmark" class="w-4 h-4 ${isFav ? "text-amber-500 fill-amber-500" : "text-slate-400"}"></i>
                </button>
              </div>

              <!-- Bottom overlay category badge -->
              <div class="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between">
                <div>${renderStars(hotel.bintang)}</div>
                ${renderCategoryBadge(hotel.kategori)}
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div class="space-y-2">
                <h3 class="font-bold text-lg text-slate-900 group-hover:text-brand-600 transition leading-snug line-clamp-1" title="${hotel.nama}">
                  ${hotel.nama}
                </h3>
                <p class="text-xs text-slate-500 flex items-start gap-1.5 line-clamp-2">
                  <i data-lucide="navigation" class="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400"></i>
                  <span>${hotel.alamat || "Alamat dalam konfirmasi pusat kota"}</span>
                </p>

                ${hotel.catatan
          ? `
                  <div class="px-2.5 py-1.5 rounded-lg bg-amber-50/80 border border-amber-200/60 text-amber-800 text-[11px] flex items-center gap-1.5">
                    <i data-lucide="info" class="w-3.5 h-3.5 shrink-0 text-amber-600"></i>
                    <span class="truncate">${hotel.catatan}</span>
                  </div>
                `
          : ""
        }
              </div>

              <!-- Price & Action CTA -->
              <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  ${renderPriceTag(hotel)}
                </div>

                <div class="flex items-center gap-1.5">
                  <a 
                    href="${hotel.google_maps}" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="p-2 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-brand-50 border border-slate-200 transition"
                    title="Buka Peta Lokasi"
                  >
                    <i data-lucide="map" class="w-4 h-4"></i>
                  </a>
                  <button 
                    onclick="openModal(${hotel.id})" 
                    class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-brand-600 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <span>Detail</span>
                    <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
    })
    .join("");

  // 2. Render Table View
  tableBody.innerHTML = hotels
    .map((hotel) => {
      const isFav = state.favorites.includes(hotel.id);
      return `
          <tr class="hover:bg-slate-50 transition border-b border-slate-100">
            <td class="p-4">
              <div class="flex items-center gap-3">
                <button onclick="toggleFavorite(${hotel.id}, event)" class="text-slate-300 hover:text-amber-500 transition">
                  <i data-lucide="bookmark" class="w-4 h-4 ${isFav ? "text-amber-500 fill-amber-500" : ""}"></i>
                </button>
                <img src="${hotel.coverImage}" class="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" />
                <div>
                  <div class="font-bold text-slate-900 text-sm hover:text-brand-600 cursor-pointer" onclick="openModal(${hotel.id})">${hotel.nama}</div>
                  <div class="text-[11px] text-slate-400">ID: #${hotel.id}</div>
                </div>
              </div>
            </td>
            <td class="p-4 whitespace-nowrap">
              <span class="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">${hotel.kota}</span>
            </td>
            <td class="p-4">
              <div class="flex flex-col gap-1 items-start">
                ${renderStars(hotel.bintang)}
                ${renderCategoryBadge(hotel.kategori)}
              </div>
            </td>
            <td class="p-4 whitespace-nowrap">
              ${hotel.harga_mulai_dari_idr ? `<span class="font-bold text-slate-900">${formatIDR(hotel.harga_mulai_dari_idr)}</span><span class="text-xs text-slate-400">/mlm</span>` : '<span class="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">Perkiraan ~1.1 Jt</span>'}
            </td>
            <td class="p-4 max-w-xs">
              <div class="text-xs text-slate-600 truncate">${hotel.alamat || "-"}</div>
              ${hotel.catatan ? `<div class="text-[11px] text-amber-700 font-medium truncate mt-0.5">⚠️ ${hotel.catatan}</div>` : ""}
            </td>
            <td class="p-4 text-right whitespace-nowrap">
              <div class="flex items-center justify-end gap-1.5">
                <a href="${hotel.google_maps}" target="_blank" class="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition" title="Google Maps">
                  <i data-lucide="map-pin" class="w-4 h-4"></i>
                </a>
                <button onclick="openModal(${hotel.id})" class="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-brand-600 text-white text-xs font-semibold transition">
                  Lihat
                </button>
              </div>
            </td>
          </tr>
        `;
    })
    .join("");

  lucide.createIcons();
}

// Modal Details Logic
function setModalImage(url) {
  const modalImg = document.getElementById("modalImage");
  if (modalImg) modalImg.src = url;
}

function openModal(id) {
  const hotel = state.data.find((h) => h.id === id);
  if (!hotel) return;

  document.getElementById("modalTitle").innerText = hotel.nama;
  document.getElementById("modalImage").src = hotel.coverImage;

  // Gallery thumbnails if multiple photos exist
  const galleryEl = document.getElementById("modalGallery");
  if (galleryEl) {
    if (hotel.images && hotel.images.length > 1) {
      galleryEl.classList.remove("hidden");
      galleryEl.innerHTML = hotel.images
        .map(
          (img, idx) => `
        <button 
          onclick="setModalImage('${img}')" 
          class="shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 border-transparent hover:border-brand-500 focus:border-brand-600 transition shadow-sm active:scale-95"
          title="Lihat foto ${idx + 1}"
        >
          <img src="${img}" class="w-full h-full object-cover" alt="Thumbnail ${idx + 1}" />
        </button>
      `
        )
        .join("");
    } else {
      galleryEl.classList.add("hidden");
      galleryEl.innerHTML = "";
    }
  }

  document.getElementById("modalCityBadge").innerText = hotel.kota;
  document.getElementById("modalCategoryBadge").innerText = hotel.kategori === "bintang_rendah_estetik" ? "Boutique & Estetik" : "Bintang 4 - 5 Luxury Value";
  document.getElementById("modalStarBadge").innerText = hotel.bintang ? `${hotel.bintang} Bintang` : "Desain Estetik";

  if (hotel.harga_mulai_dari_idr) {
    document.getElementById("modalPrice").innerText = formatIDR(hotel.harga_mulai_dari_idr);
    document.getElementById("modalPriceLabel").innerText = "/ malam (harga terendah)";
  } else if (hotel.perkiraan_harga_idr) {
    document.getElementById("modalPrice").innerText = "Rp 1.000.000 - 1.200.000";
    document.getElementById("modalPriceLabel").innerText = `(${hotel.perkiraan_harga_idr})`;
  } else {
    document.getElementById("modalPrice").innerText = "Hubungi Pihak Hotel";
    document.getElementById("modalPriceLabel").innerText = "";
  }

  document.getElementById("modalAddress").innerText = hotel.alamat || "Alamat lengkap dapat dicek melalui tautan peta Google.";

  // Notes
  const notesWrap = document.getElementById("modalNotesWrapper");
  if (hotel.catatan) {
    notesWrap.classList.remove("hidden");
    document.getElementById("modalNotes").innerText = hotel.catatan;
  } else {
    notesWrap.classList.add("hidden");
  }

  // Sources
  const sourcesBox = document.getElementById("modalSources");
  let sources = [];
  if (Array.isArray(hotel.sumber)) {
    sources = hotel.sumber;
  } else if (typeof hotel.sumber === "string") {
    sources = [hotel.sumber];
  }
  sourcesBox.innerHTML =
    sources
      .map(
        (url, i) => `
        <a href="${url}" target="_blank" rel="noopener noreferrer" class="text-brand-600 hover:text-brand-800 underline truncate inline-flex items-center gap-1">
          <i data-lucide="external-link" class="w-3 h-3 shrink-0"></i>
          <span>${url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]} (${i + 1})</span>
        </a>
      `,
      )
      .join("") || '<span class="text-slate-400">Ulasan web travel</span>';

  // Action links
  document.getElementById("modalMapLink").href = hotel.google_maps;
  document.getElementById("modalImageSearchLink").href = hotel.link_gambar;

  document.getElementById("hotelModal").classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
  lucide.createIcons();
}

function closeModal() {
  document.getElementById("hotelModal").classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

// Close modal on click outside
window.addEventListener("click", (e) => {
  const modal = document.getElementById("hotelModal");
  if (e.target === modal) {
    closeModal();
  }
});

// Close on Escape key
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});

function updateHeaderStats() {
  const totalEl = document.getElementById("statTotal");
  const citiesEl = document.getElementById("statCities");
  const luxuryEl = document.getElementById("statLuxury");
  const minPriceEl = document.getElementById("statMinPrice");

  if (totalEl) totalEl.innerText = `${state.data.length} Hotel`;
  if (citiesEl) {
    const uniqueCities = new Set(state.data.map((h) => h.kota));
    citiesEl.innerText = `${uniqueCities.size} Daerah`;
  }
  if (luxuryEl) {
    const luxuryCount = state.data.filter((h) => h.kategori === "bintang_4_5_maks_1500000").length;
    luxuryEl.innerText = `${luxuryCount} Properti`;
  }
  if (minPriceEl) {
    const prices = state.data.map((h) => h.harga_mulai_dari_idr).filter((p) => typeof p === "number" && p > 0);
    if (prices.length > 0) {
      const min = Math.min(...prices);
      minPriceEl.innerText = `Rp ${Math.round(min / 1000)} Rb`;
    }
  }
}

// Initial boot
document.addEventListener("DOMContentLoaded", () => {
  updateFavBadge();
  updateHeaderStats();
  render();
});