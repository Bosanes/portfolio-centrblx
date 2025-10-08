fetch("portfolio-data.json")
  .then(res => res.json())
  .then(data => {
    const projectList = document.getElementById("project-list");
    const modal = document.getElementById("modal");
    const modalContent = modal.querySelector(".modal-content");
    const backHome = document.getElementById("back-home");
    const categoryPills = document.getElementById("category-pills");

    let currentMedia = [];
    let currentIndex = 0;
    let activeCategory = "all";

    // Populate filter pills
    const categories = ["all", ...new Set(data.projects.map(p => p.category))];
    categories.forEach(cat => {
      const pill = document.createElement("button");
      pill.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      pill.className = "filter-pill" + (cat === "all" ? " active" : "");
      pill.addEventListener("click", () => {
        activeCategory = cat;
        document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        displayProjects(activeCategory);
      });
      categoryPills.appendChild(pill);
    });

    // Function to display projects
    function displayProjects(filter = "all") {
      projectList.innerHTML = "";
      data.projects
        .filter(proj => filter === "all" || proj.category === filter)
        .forEach(proj => {
          const card = document.createElement("div");
          card.className = "glass-card shadow-lg fade-in";

          // Thumbnail
          const firstMedia = proj.media[0];
          const mediaHTML = firstMedia.type === "video"
            ? `<video src="${firstMedia.src}" class="w-full h-48 object-cover"></video>`
            : `<img src="${firstMedia.src}" alt="${proj.title}" class="w-full h-48 object-cover">`;

          card.innerHTML = `
            ${mediaHTML}
            <div class="p-5">
              <h3 class="text-lg font-bold mb-1">${proj.title}</h3>
              <p class="text-gray-300 text-sm">${proj.description}</p>
            </div>
          `;

          // Open modal gallery
          card.addEventListener("click", () => {
            currentMedia = proj.media;
            currentIndex = 0;
            openModal(currentMedia[currentIndex]);
          });

          projectList.appendChild(card);
        });
    }

    // Modal handling
    function openModal(media) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");

      const mainMediaHTML = media.type === "video"
        ? `<video src="${media.src}" controls autoplay class="w-full h-auto"></video>`
        : `<img src="${media.src}" alt="" class="w-full h-auto">`;

      modalContent.innerHTML = `
        <div class="main-media w-full h-auto mb-4">${mainMediaHTML}</div>
        <div id="thumbnails" class="flex justify-center gap-2 overflow-x-auto mb-2"></div>
        <button id="prev" class="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-3xl px-2">❮</button>
        <button id="next" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-3xl px-2">❯</button>
        <span id="modal-close" class="absolute top-2 right-2 text-white text-3xl cursor-pointer">&times;</span>
      `;

      const thumbnails = document.getElementById("thumbnails");

      currentMedia.forEach((item, idx) => {
        const thumb = document.createElement("div");
        thumb.className = "w-20 h-20 flex-shrink-0 cursor-pointer border-2 border-gray-600 hover:border-white";
        thumb.innerHTML = item.type === "video"
          ? `<video src="${item.src}" class="w-full h-full object-cover"></video>`
          : `<img src="${item.src}" class="w-full h-full object-cover" alt="">`;

        thumb.addEventListener("click", () => {
          currentIndex = idx;
          updateMainMedia(currentMedia[currentIndex]);
        });

        thumbnails.appendChild(thumb);
      });

      document.getElementById("prev").addEventListener("click", prevMedia);
      document.getElementById("next").addEventListener("click", nextMedia);
      document.getElementById("modal-close").addEventListener("click", closeModal);
    }

    function updateMainMedia(media) {
      const main = modalContent.querySelector(".main-media");
      main.innerHTML = media.type === "video"
        ? `<video src="${media.src}" controls autoplay class="w-full h-auto"></video>`
        : `<img src="${media.src}" alt="" class="w-full h-auto">`;
    }

    function closeModal() {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }

    function prevMedia() {
      currentIndex = (currentIndex - 1 + currentMedia.length) % currentMedia.length;
      updateMainMedia(currentMedia[currentIndex]);
    }

    function nextMedia() {
      currentIndex = (currentIndex + 1) % currentMedia.length;
      updateMainMedia(currentMedia[currentIndex]);
    }

    // Back button
    backHome.addEventListener("click", () => window.location.href = "index.html");

    // Close modal on background click
    modal.addEventListener("click", e => {
      if (e.target === modal) closeModal();
    });

    // Initial render
    displayProjects();

    // Footer year
    document.getElementById("year").textContent = new Date().getFullYear();
  })
  .catch(err => console.error("Error loading portfolio-data.json:", err));
