fetch("data.json")
  .then(res => res.json())
  .then(data => {
    // Profile
    const profile = document.getElementById("profile");
    profile.innerHTML = `
      <img src="${data.profileImage}" alt="Profile"
        class="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-lg" />
      <h1 class="text-3xl font-bold">${data.name}</h1>
      <p class="text-gray-300 max-w-md mx-auto whitespace-pre-line">${data.bio}</p>
    `;

    // Links
    const linksDiv = document.getElementById("links");
    data.links.forEach(link => {
      const a = document.createElement("a");
      a.href = link.url;
      a.target = "_blank";
      a.textContent = link.label;
      a.className =
        "link-button w-full px-6 py-3 rounded-xl bg-gray-800 text-white font-semibold text-center shadow";
      linksDiv.appendChild(a);
    });

    // Footer
    const footer = document.getElementById("footer");
    footer.textContent = `© ${new Date().getFullYear()} ${data.name}`;
  })
  .catch(err => console.error("Error loading data.json:", err));
