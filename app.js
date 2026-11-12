"use strict";

// ---------------------------------------------------------------------------
// Données de démonstration
// Remplacez ces objets par les données d'une API lorsque votre backend est prêt.
// ---------------------------------------------------------------------------

const images = {
  hero: "images/hero-naya.jpg",
  naya: "images/hero-naya.jpg",
  eden: "images/eden-park.jpg",
  lina: "images/lina-d.jpg",
  milo: "images/milo-v.jpg",
  ilya: "images/ilya.jpg",
  sana: "images/sana.jpg",
  zayn: "images/zayn-blue.jpg",
  noa: "assets/images/yanis.jpg",
};

const tracks = [
  {
    id: 1,
    title: "Danse avec la nuit",
    artist: "Naya",
    album: "Éclats Nocturnes",
    cover: images.naya,
    duration: "3:24",
    seconds: 204,
    plays: "2,4 M",
  },
  {
    id: 2,
    title: "Mirage",
    artist: "Eden Park",
    album: "Sans Frontières",
    cover: images.eden,
    duration: "3:48",
    seconds: 228,
    plays: "1,8 M",
  },
  {
    id: 3,
    title: "Cœur magnétique",
    artist: "Lina D.",
    album: "Lune Rose",
    cover: images.lina,
    duration: "2:57",
    seconds: 177,
    plays: "1,5 M",
  },
  {
    id: 4,
    title: "Casablanca",
    artist: "Milo V.",
    album: "Après Minuit",
    cover: images.milo,
    duration: "4:02",
    seconds: 242,
    plays: "984 K",
  },
  {
    id: 5,
    title: "Vertige",
    artist: "Ilya",
    album: "Fréquences",
    cover: images.ilya,
    duration: "3:17",
    seconds: 197,
    plays: "875 K",
  },
  {
    id: 6,
    title: "Soleil d'hiver",
    artist: "Sana",
    album: "Ailleurs",
    cover: images.sana,
    duration: "3:36",
    seconds: 216,
    plays: "746 K",
  },
];

const albums = [
  { title: "Éclats Nocturnes", artist: "Naya", cover: images.naya, tint: "violet" },
  { title: "Sans Frontières", artist: "Eden Park", cover: images.eden, tint: "blue" },
  { title: "Lune Rose", artist: "Lina D.", cover: images.lina, tint: "pink" },
  { title: "Après Minuit", artist: "Milo V.", cover: images.milo, tint: "orange" },
  { title: "Fréquences", artist: "Ilya", cover: images.ilya, tint: "green" },
];

const artists = [
  ["Naya", "Pop alternative", images.naya],
  ["Milo V.", "Afro fusion", images.milo],
  ["Lina D.", "R&B", images.lina],
  ["Eden Park", "Électro", images.eden],
  ["Sana", "Indie", images.sana],
  ["Zayn Blue", "Hip-Hop", images.zayn],
];

const genres = [
  ["Afro", "linear-gradient(135deg,#f97316,#ef4444)", images.milo],
  ["Pop", "linear-gradient(135deg,#ec4899,#8b5cf6)", images.naya],
  ["Hip-Hop", "linear-gradient(135deg,#8b5cf6,#4338ca)", images.zayn],
  ["Électro", "linear-gradient(135deg,#06b6d4,#2563eb)", images.eden],
  ["R&B", "linear-gradient(135deg,#db2777,#7e22ce)", images.lina],
  ["Indie", "linear-gradient(135deg,#10b981,#0f766e)", images.sana],
  ["Raï", "linear-gradient(135deg,#f59e0b,#ea580c)", images.noa],
  ["Chill", "linear-gradient(135deg,#6366f1,#0891b2)", images.ilya],
];

const app = {
  page: "home",
  currentTrack: 0,
  playing: false,
  progress: 0,
  liked: new Set([1, 3]),
  downloaded: new Set([1, 4, 6]),
  timer: null,
};

const pageContent = document.querySelector("#page-content");
const sidebar = document.querySelector("#sidebar");
const overlay = document.querySelector("#menu-overlay");
const searchInput = document.querySelector("#search");

function sectionTitle(title, eyebrow = "", action = "") {
  return `
    <div class="sectionTitle">
      <div>${eyebrow ? `<span>${eyebrow}</span>` : ""}<h2>${title}</h2></div>
      ${action ? `<button class="textAction">${action}<b>›</b></button>` : ""}
    </div>`;
}

function albumCards(list = albums) {
  return `<div class="albumGrid">
    ${list
      .map(
        (album, index) => `
      <article class="albumCard" data-play="${index % tracks.length}">
        <div class="albumCover">
          <img src="${album.cover}" alt="Pochette de ${album.title}">
          <span class="albumTint ${album.tint || ""}"></span>
          <button class="floatingPlay" aria-label="Écouter ${album.title}">▶</button>
        </div>
        <h3>${album.title}</h3><p>${album.artist}</p>
      </article>`,
      )
      .join("")}
  </div>`;
}

function trackRows(list = tracks, options = {}) {
  if (!list.length) {
    return `<div class="emptyState"><b class="empty-icon">⌕</b><h3>Aucun résultat</h3><p>Essayez un autre titre ou un autre artiste.</p></div>`;
  }

  return `<div class="trendList">
    ${list
      .map((track, index) => {
        const trackIndex = tracks.findIndex((item) => item.id === track.id);
        const isCurrent = app.currentTrack === trackIndex;
        return `
        <div class="trackRow ${isCurrent ? "current" : ""}">
          <button class="trackIndex" data-play="${trackIndex}">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <b>${isCurrent && app.playing ? "Ⅱ" : "▶"}</b>
          </button>
          <img src="${track.cover}" alt="" data-play="${trackIndex}">
          <div class="trackTitle"><strong>${track.title}</strong><span>${track.artist}</span></div>
          <span class="trackAlbum">${track.album}</span>
          <span class="trackPlays">◉ ${track.plays}</span>
          <button class="heartButton ${app.liked.has(track.id) ? "liked" : ""}" data-like="${track.id}" aria-label="Favori">${app.liked.has(track.id) ? "♥" : "♡"}</button>
          ${
            options.download
              ? `<button class="heartButton" data-download="${track.id}" aria-label="Supprimer le téléchargement">✓</button>`
              : ""
          }
          <span class="trackDuration">${track.duration}</span>
          <button class="moreButton" aria-label="Plus d'options">•••</button>
        </div>`;
      })
      .join("")}
  </div>`;
}

function renderHome() {
  return `
    <section class="hero">
      <img src="${images.hero}" alt="Artiste dans une ambiance musicale violette">
      <div class="heroGlow"></div>
      <div class="heroContent">
        <div class="heroBadge"><span></span><b>NOUVEL ALBUM</b></div>
        <h1>La nuit nous<br><em>appartient.</em></h1>
        <p>Découvrez « Éclats Nocturnes », le nouvel album de Naya. Une traversée pop intense et lumineuse.</p>
        <div class="heroActions">
          <button class="primaryButton" data-play="0">▶ Écouter maintenant</button>
          <button class="roundButton" data-like="1" aria-label="Ajouter aux favoris">${app.liked.has(1) ? "♥" : "♡"}</button>
        </div>
      </div>
      <div class="heroMeta"><span>01</span><div><i></i><i></i><i></i></div><span>03</span></div>
    </section>
    <section class="contentSection">
      ${sectionTitle("Nouveautés musicales", "À écouter aujourd'hui", "Tout afficher")}
      ${albumCards()}
    </section>
    <section class="contentSection trendsSection">
      ${sectionTitle("Tendances du moment", "Les sons qui montent", "Voir le classement")}
      ${trackRows(tracks.slice(0, 5))}
    </section>
    <section class="contentSection artistSection">
      ${sectionTitle("Artistes populaires", "Talents à suivre", "Tous les artistes")}
      <div class="artistGrid">
        ${artists
          .map(
            ([name, genre, image]) => `
          <article class="artistCard">
            <div><img src="${image}" alt="Portrait de ${name}"><span class="artistRing"></span></div>
            <h3>${name}<span class="verified">✓</span></h3><p>${genre}</p>
          </article>`,
          )
          .join("")}
      </div>
      <button class="mobileExplore" data-page="explore">Explorer tous les univers ›</button>
    </section>`;
}

function renderExplore(query = "") {
  const normalized = query.trim().toLowerCase();
  const results = normalized
    ? tracks.filter((track) =>
        `${track.title} ${track.artist} ${track.album}`.toLowerCase().includes(normalized),
      )
    : tracks;

  return `
    <div class="innerPage">
      <div class="pageHeading">
        <span>DÉCOUVRIR</span>
        <h1>${query ? `Résultats pour « ${escapeHtml(query)} »` : "Explorez sans limites"}</h1>
        <p>${query ? `${results.length} titre(s) trouvé(s)` : "Des univers musicaux sélectionnés selon vos envies."}</p>
      </div>
      ${
        query
          ? ""
          : `
        ${sectionTitle("Parcourir les genres", "", "Tous les genres")}
        <div class="genreGrid">
          ${genres
            .map(
              ([name, color, image]) => `
            <button class="genreCard toast-trigger" data-message="Sélection ${name} ouverte" style="background:${color}">
              <div><span>GENRE</span><strong>${name}</strong><p>Explorer la sélection</p></div>
              <img src="${image}" alt=""><b>›</b>
            </button>`,
            )
            .join("")}
        </div>
        <div class="featuredMix">
          <img src="${images.zayn}" alt="">
          <div><span>SÉLECTION SOUK SOUND</span><h2>Pulse : le futur<br>du Hip-Hop</h2>
          <p>Une sélection avant-gardiste des talents qui façonnent le son de demain.</p>
          <button class="primaryButton" data-play="4">▶ Lancer la sélection</button></div>
        </div>`
      }
      <section class="contentSection searchResults">
        ${sectionTitle(query ? "Titres correspondants" : "Tendances mondiales")}
        ${trackRows(results)}
      </section>
    </div>`;
}

function renderLibrary() {
  const favorites = tracks.filter((track) => app.liked.has(track.id));
  return `
    <div class="innerPage">
      <div class="pageHeading inlineHeading">
        <div><span>VOTRE ESPACE</span><h1>Ma bibliothèque</h1><p>Retrouvez tout ce que vous aimez, au même endroit.</p></div>
        <button class="outlineButton toast-trigger" data-message="Nouvelle playlist créée">＋ Créer une playlist</button>
      </div>
      <div class="statsGrid">
        <div><span>♥</span><strong>${favorites.length}</strong><p>Titres favoris</p></div>
        <div><span>☷</span><strong>8</strong><p>Playlists</p></div>
        <div><span>◷</span><strong>42 h</strong><p>Temps d'écoute</p></div>
      </div>
      <section class="contentSection">
        ${sectionTitle("Vos favoris")}
        ${
          favorites.length
            ? trackRows(favorites)
            : `<div class="emptyState"><b>♡</b><h3>Vos favoris vous attendent</h3><p>Ajoutez des titres avec le cœur pour les retrouver ici.</p><button class="primaryButton" data-page="explore">Explorer la musique</button></div>`
        }
      </section>
      <section class="contentSection">
        ${sectionTitle("Écoutés récemment", "", "Voir l'historique")}
        ${albumCards(albums.slice(1))}
      </section>
    </div>`;
}

function renderDownloads() {
  const downloaded = tracks.filter((track) => app.downloaded.has(track.id));
  return `
    <div class="innerPage">
      <div class="pageHeading inlineHeading">
        <div><span>HORS CONNEXION</span><h1>Téléchargements</h1><p>Votre musique, partout avec vous.</p></div>
        <div class="storage"><div><span>Stockage utilisé</span><b>1,8 Go / 8 Go</b></div><i><span></span></i></div>
      </div>
      <div class="downloadBanner">
        <div class="downloadOrb">↓</div>
        <div><h3>Téléchargements intelligents</h3><p>SOUK SOUND télécharge automatiquement vos favoris lorsque vous êtes en Wi-Fi.</p></div>
        <button class="switch active toast-trigger" data-message="Téléchargements intelligents activés"><i></i></button>
      </div>
      <section class="contentSection">
        ${sectionTitle(`${downloaded.length} titres téléchargés`, "", "Gérer")}
        ${trackRows(downloaded, { download: true })}
      </section>
    </div>`;
}

function renderPlaylists() {
  const lists = [
    ["Vibes du soir", 32, images.naya, "#8B5CF6"],
    ["Focus & Flow", 48, images.eden, "#2563eb"],
    ["Afro Heat", 25, images.milo, "#f97316"],
    ["Douceur acoustique", 19, images.sana, "#10b981"],
  ];
  return `
    <div class="innerPage">
      <div class="pageHeading inlineHeading">
        <div><span>VOS COLLECTIONS</span><h1>Playlists</h1><p>La bande-son de chaque moment de votre vie.</p></div>
        <button class="primaryButton toast-trigger" data-message="Nouvelle playlist créée">＋ Nouvelle playlist</button>
      </div>
      <div class="playlistGrid">
        ${lists
          .map(
            ([name, count, image, color], index) => `
          <article class="playlistCard" data-play="${index}">
            <div class="playlistArt" style="background:${color}"><img src="${image}" alt=""><span>SOUK<br>SOUND</span><button>▶</button></div>
            <h3>${name}</h3><p>${count} titres • Créée par vous</p>
          </article>`,
          )
          .join("")}
        <button class="newPlaylist toast-trigger" data-message="Nouvelle playlist créée">
          <span>＋</span><strong>Créer une playlist</strong><p>Rassemblez vos titres préférés</p>
        </button>
      </div>
      <section class="contentSection">
        ${sectionTitle("Créées pour vous")}
        <div class="editorialCards">
          ${["Votre mix découverte", "Radar des nouveautés", "Retour en 2024"]
            .map(
              (name, index) => `
            <article style="background-image:linear-gradient(0deg,rgba(11,11,15,.95),rgba(11,11,15,.05)),url(${albums[index + 1].cover})">
              <span>POUR YANIS</span><h3>${name}</h3><p>Mise à jour cette semaine</p>
            </article>`,
            )
            .join("")}
        </div>
      </section>
    </div>`;
}

function renderProfile() {
  return `
    <div class="innerPage profilePage">
      <section class="profileHero">
        <div class="profileAura"></div>
        <img src="${images.noa}" alt="Yanis Amrani">
        <div><span>PROFIL PREMIUM</span><h1>Yanis Amrani</h1><p>@yanis.music • Membre depuis 2023</p>
          <div><b>12</b><span>Playlists</span><b>84</b><span>Abonnements</span><b>1,2 K</b><span>Abonnés</span></div>
        </div>
        <button class="outlineButton toast-trigger" data-message="Mode édition activé">⚙ Modifier le profil</button>
      </section>
      <div class="profileColumns">
        <section>${sectionTitle("Activité récente")}
          <div class="activityCard">
            ${tracks
              .slice(0, 4)
              .map(
                (track, index) => `
              <div><img src="${track.cover}" alt=""><p><strong>Vous avez écouté ${track.title}</strong><span>${index + 1} h • ${track.artist}</span></p><button>•••</button></div>`,
              )
              .join("")}
          </div>
        </section>
        <aside class="accountCard">
          <span>VOTRE ABONNEMENT</span><h3>Premium</h3><p>Profitez du son en qualité maximale, sans aucune publicité.</p>
          <div>✓ Audio haute fidélité</div><div>✓ Écoute hors connexion</div><div>✓ Titres illimités</div>
          <button class="toast-trigger" data-message="Abonnement actif jusqu'au 24 mars 2027">Gérer mon abonnement</button>
        </aside>
      </div>
      <div class="settingsList"><h2>Paramètres du compte</h2>
        <button><span>♙</span><div><b>Informations personnelles</b><small>Nom, e-mail et mot de passe</small></div><b>›</b></button>
        <button><span>◖</span><div><b>Qualité audio</b><small>Très élevée • 320 kbit/s</small></div><b>›</b></button>
        <button><span>♢</span><div><b>Notifications</b><small>Nouveautés, sorties et recommandations</small></div><b>›</b></button>
        <button class="logout toast-trigger" data-message="Vous avez été déconnecté"><span>↪</span><div><b>Se déconnecter</b><small>Quitter votre session SOUK SOUND</small></div><b>›</b></button>
      </div>
    </div>`;
}

const renderers = {
  home: renderHome,
  explore: () => renderExplore(searchInput.value),
  library: renderLibrary,
  downloads: renderDownloads,
  playlists: renderPlaylists,
  profile: renderProfile,
};

function renderPage() {
  pageContent.innerHTML = renderers[app.page]();
  document.querySelectorAll("[data-page]").forEach((button) => {
    button.classList.toggle("active", button.dataset.page === app.page);
  });
  bindDynamicEvents();
}

function navigate(page) {
  app.page = page;
  sidebar.classList.remove("open");
  overlay.classList.remove("visible");
  window.scrollTo({ top: 0, behavior: "smooth" });
  renderPage();
}

function selectTrack(index, forcePlay = false) {
  if (app.currentTrack === index && !forcePlay) {
    app.playing = !app.playing;
  } else {
    app.currentTrack = index;
    app.progress = 0;
    app.playing = true;
  }
  updatePlayer();
  startTimer();
  renderPage();
}

function updatePlayer() {
  const track = tracks[app.currentTrack];
  document.querySelector("#player-cover").src = track.cover;
  document.querySelector("#player-title").textContent = track.title;
  document.querySelector("#player-artist").textContent = track.artist;
  document.querySelector("#duration").textContent = track.duration;
  document.querySelector("#main-play").textContent = app.playing ? "Ⅱ" : "▶";
  document.querySelector("#player-like").textContent = app.liked.has(track.id) ? "♥" : "♡";
  document.querySelector("#player-like").classList.toggle("liked", app.liked.has(track.id));
  const progress = document.querySelector("#progress");
  progress.value = app.progress;
  progress.style.setProperty("--value", `${app.progress}%`);
  const elapsed = Math.round((app.progress / 100) * track.seconds);
  document.querySelector("#current-time").textContent =
    `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}`;
}

function startTimer() {
  window.clearInterval(app.timer);
  if (!app.playing) return;
  app.timer = window.setInterval(() => {
    app.progress += 100 / tracks[app.currentTrack].seconds;
    if (app.progress >= 100) nextTrack();
    updatePlayer();
  }, 1000);
}

function nextTrack(direction = 1) {
  app.currentTrack = (app.currentTrack + direction + tracks.length) % tracks.length;
  app.progress = 0;
  app.playing = true;
  updatePlayer();
  startTimer();
  renderPage();
}

function toggleLike(id) {
  app.liked.has(id) ? app.liked.delete(id) : app.liked.add(id);
  updatePlayer();
  renderPage();
}

let toastTimeout;
function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.querySelector("span").textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function bindDynamicEvents() {
  pageContent.querySelectorAll("[data-play]").forEach((element) => {
    element.addEventListener("click", (event) => {
      if (event.target.closest("[data-like]")) return;
      selectTrack(Number(element.dataset.play));
    });
  });
  pageContent.querySelectorAll("[data-like]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleLike(Number(button.dataset.like));
    });
  });
  pageContent.querySelectorAll("[data-download]").forEach((button) => {
    button.addEventListener("click", () => {
      app.downloaded.delete(Number(button.dataset.download));
      showToast("Téléchargement supprimé");
      renderPage();
    });
  });
  bindNavigation(pageContent);
  bindToasts(pageContent);
}

function bindNavigation(scope = document) {
  scope.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => navigate(button.dataset.page));
  });
}

function bindToasts(scope = document) {
  scope.querySelectorAll(".toast-trigger").forEach((button) => {
    button.addEventListener("click", () => showToast(button.dataset.message));
  });
}

function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = value;
  return element.innerHTML;
}

document.querySelector("#open-menu").addEventListener("click", () => {
  sidebar.classList.add("open");
  overlay.classList.add("visible");
});
document.querySelector("#close-menu").addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("visible");
});
overlay.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("visible");
});

searchInput.addEventListener("input", () => {
  app.page = "explore";
  renderPage();
});
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.code === "Space" && document.activeElement.tagName !== "INPUT") {
    event.preventDefault();
    app.playing = !app.playing;
    updatePlayer();
    startTimer();
  }
});

document.querySelector("#main-play").addEventListener("click", () => {
  app.playing = !app.playing;
  updatePlayer();
  startTimer();
});
document.querySelector("#next-track").addEventListener("click", () => nextTrack(1));
document.querySelector("#previous-track").addEventListener("click", () => nextTrack(-1));
document.querySelector("#player-like").addEventListener("click", () => {
  toggleLike(tracks[app.currentTrack].id);
});
document.querySelector("#progress").addEventListener("input", (event) => {
  app.progress = Number(event.target.value);
  updatePlayer();
});
document.querySelector("#volume").addEventListener("input", (event) => {
  event.target.style.setProperty("--value", `${event.target.value}%`);
});

bindNavigation();
bindToasts();
renderPage();
updatePlayer();