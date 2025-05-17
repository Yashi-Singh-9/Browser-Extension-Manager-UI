document.addEventListener("DOMContentLoaded", () => {
  const extensionsContainer = document.getElementById("extensions");
  const filterButtons = document.querySelectorAll(".filter-button");
  const themeToggleButton = document.getElementById("themeToggle");
  const themeIcon = themeToggleButton.querySelector("img");
  let extensions = [];

  // Load extensions from data.json
  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      extensions = data;
      renderExtensions(extensions);
    })
    .catch(err => console.error("Failed to load extensions:", err));

  // Render extensions to the DOM
  function renderExtensions(data) {
    extensionsContainer.innerHTML = "";

    data.forEach(ext => {
      const extCard = document.createElement("div");
      extCard.classList.add("extension");

      extCard.innerHTML = `
        <div class="info">
          <img src="${ext.logo}" alt="${ext.name} logo">
          <div>
            <h3>${ext.name}</h3>
            <p>${ext.description}</p>
          </div>
        </div>
        <div class="btns-info">
          <button class="remove-btn">Remove</button>
          <input type="checkbox" ${ext.isActive ? "checked" : ""}>
        </div>
      `;

      // Toggle isActive
      extCard.querySelector('input[type="checkbox"]').addEventListener("change", (e) => {
        ext.isActive = e.target.checked;
        updateFilter(); // Refresh current filter view
      });

      // Remove extension
      extCard.querySelector(".remove-btn").addEventListener("click", () => {
        extensions = extensions.filter(item => item.name !== ext.name);
        updateFilter();
      });

      extensionsContainer.appendChild(extCard);
    });
  }

  // Filtering logic
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".filter-button.active")?.classList.remove("active");
      btn.classList.add("active");
      updateFilter();
    });
  });

  function updateFilter() {
    const activeFilter = document.querySelector(".filter-button.active").dataset.filter;
    let filtered = [...extensions];

    if (activeFilter === "active") {
      filtered = filtered.filter(ext => ext.isActive);
    } else if (activeFilter === "inactive") {
      filtered = filtered.filter(ext => !ext.isActive);
    }

    renderExtensions(filtered);
  }

  // Theme Toggle Logic
  themeToggleButton.addEventListener("click", () => {
    // Toggle theme
    document.body.classList.toggle("dark-theme");

    // Change icon based on the current theme
    if (document.body.classList.contains("dark-theme")) {
      themeIcon.src = "assets/images/icon-sun.svg"; // Sun icon for dark theme
    } else {
      themeIcon.src = "assets/images/icon-moon.svg"; // Moon icon for light theme
    }
  });
});
