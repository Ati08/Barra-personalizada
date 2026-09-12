import "@/app.css";

// Valores por defecto
const DEFAULT_CONFIG = {
  opacity: 0.35,
  blur: 35,
  color: "15, 15, 35",
  saturate: 150,
  width: 311,
};

// Presets predefinidos
const PRESETS = {
  oscuro: { opacity: 0.85, blur: 10, saturate: 100, color: "10, 10, 20" },
  cristal: { opacity: 0.25, blur: 50, saturate: 180, color: "15, 15, 35" },
  neon: { opacity: 0.45, blur: 30, saturate: 250, color: "30, 0, 50" },
  sutil: { opacity: 0.15, blur: 20, saturate: 120, color: "0, 0, 0" },
};

// Cargar configuración guardada o usar los valores por defecto
function loadConfig() {
  const saved = localStorage.getItem("barra-lateral-config");
  if (saved) {
    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch (e) {
      console.warn("Error al cargar configuración, usando valores por defecto");
    }
  }
  return { ...DEFAULT_CONFIG };
}

let config = loadConfig();

// Función para aplicar los cambios al CSS
function applyConfig() {
  const root = document.documentElement;
  root.style.setProperty("--sidebar-opacity", config.opacity.toString());
  root.style.setProperty("--sidebar-blur", `${config.blur}px`);
  root.style.setProperty("--sidebar-color", config.color);
  root.style.setProperty("--sidebar-saturate", `${config.saturate}%`);
  root.style.setProperty("--sidebar-width", `${config.width}px`);
  console.log("✅ Configuración aplicada:", config);
}

// Función para guardar los cambios en localStorage
function saveConfig() {
  localStorage.setItem("barra-lateral-config", JSON.stringify(config));
}

// Función para crear el panel
function createPanel() {
  const panel = document.createElement("div");
  panel.id = "barra-lateral-panel";
  panel.innerHTML = `
    <div class="panel-header">
      <h3> Configurar Barra Lateral</h3>
      <button class="panel-close" id="panel-close">✕</button>
    </div>
    <div class="panel-body">
      <div class="panel-presets">
        <label>Presets rápidos:</label>
        <div class="preset-buttons">
          <button class="preset-btn" data-preset="oscuro"> Oscuro</button>
          <button class="preset-btn" data-preset="cristal"> Cristal</button>
          <button class="preset-btn" data-preset="neon"> Neón</button>
          <button class="preset-btn" data-preset="sutil"> Sutil</button>
        </div>
      </div>
      <div class="panel-control">
        <label>Transparencia: <span id="opacity-value">${config.opacity}</span></label>
        <input type="range" id="opacity-slider" min="0.1" max="1" step="0.05" value="${config.opacity}">
      </div>
      <div class="panel-control">
        <label>Desenfoque: <span id="blur-value">${config.blur}px</span></label>
        <input type="range" id="blur-slider" min="0" max="80" step="5" value="${config.blur}">
      </div>
      <div class="panel-control">
        <label>Saturación: <span id="saturate-value">${config.saturate}%</span></label>
        <input type="range" id="saturate-slider" min="50" max="250" step="10" value="${config.saturate}">
      </div>
      <div class="panel-control">
        <label>Ancho de la barra: <span id="width-value">${config.width}px</span></label>
        <input type="range" id="width-slider" min="200" max="400" step="10" value="${config.width}">
      </div>
      <div class="panel-control">
        <label>Color de fondo:</label>
        <input type="color" id="color-picker" value="#0f0f23">
      </div>
      <button class="panel-save" id="panel-reset">Restablecer</button>
    </div>
  `;

  document.body.appendChild(panel);
  document.body.classList.add("panel-open");

  // Obtener elementos
  const opacitySlider = document.getElementById("opacity-slider") as HTMLInputElement;
  const blurSlider = document.getElementById("blur-slider") as HTMLInputElement;
  const saturateSlider = document.getElementById("saturate-slider") as HTMLInputElement;
  const widthSlider = document.getElementById("width-slider") as HTMLInputElement;
  const colorPicker = document.getElementById("color-picker") as HTMLInputElement;
  const opacityValue = document.getElementById("opacity-value")!;
  const blurValue = document.getElementById("blur-value")!;
  const saturateValue = document.getElementById("saturate-value")!;
  const widthValue = document.getElementById("width-value")!;
  const closeBtn = document.getElementById("panel-close")!;
  const resetBtn = document.getElementById("panel-reset")!;

  // Convertir el color RGB a HEX
  const [r, g, b] = config.color.split(",").map((n) => parseInt(n.trim()));
  colorPicker.value = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

  // Función para actualizar la UI desde config
  function updateUI() {
    opacitySlider.value = config.opacity.toString();
    blurSlider.value = config.blur.toString();
    saturateSlider.value = config.saturate.toString();
    widthSlider.value = config.width.toString();
    opacityValue.textContent = config.opacity.toString();
    blurValue.textContent = `${config.blur}px`;
    saturateValue.textContent = `${config.saturate}%`;
    widthValue.textContent = `${config.width}px`;

    const [r, g, b] = config.color.split(",").map((n) => parseInt(n.trim()));
    colorPicker.value = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  // Eventos de los sliders
  opacitySlider.addEventListener("input", (e) => {
    config.opacity = parseFloat((e.target as HTMLInputElement).value);
    opacityValue.textContent = config.opacity.toString();
    applyConfig();
    saveConfig();
  });

  blurSlider.addEventListener("input", (e) => {
    config.blur = parseInt((e.target as HTMLInputElement).value);
    blurValue.textContent = `${config.blur}px`;
    applyConfig();
    saveConfig();
  });

  saturateSlider.addEventListener("input", (e) => {
    config.saturate = parseInt((e.target as HTMLInputElement).value);
    saturateValue.textContent = `${config.saturate}%`;
    applyConfig();
    saveConfig();
  });

  widthSlider.addEventListener("input", (e) => {
    config.width = parseInt((e.target as HTMLInputElement).value);
    widthValue.textContent = `${config.width}px`;
    applyConfig();
    saveConfig();
  });

  colorPicker.addEventListener("input", (e) => {
    const hex = (e.target as HTMLInputElement).value;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    config.color = `${r}, ${g}, ${b}`;
    applyConfig();
    saveConfig();
  });

  // Eventos de los presets
  document.querySelectorAll(".preset-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const presetName = (btn as HTMLElement).dataset.preset as keyof typeof PRESETS;
      const preset = PRESETS[presetName];
      if (!preset) return;

      // Aplicar el preset manteniendo el ancho actual
      config = { ...config, ...preset };
      applyConfig();
      saveConfig();
      updateUI();
      Spicetify.showNotification(` Preset aplicado: ${presetName}`);
    });
  });

  closeBtn.addEventListener("click", () => {
    panel.remove();
    document.body.classList.remove("panel-open");
  });

  resetBtn.addEventListener("click", () => {
    config = { ...DEFAULT_CONFIG };
    applyConfig();
    saveConfig();
    updateUI();
    Spicetify.showNotification("🔄 Configuración restablecida");
  });
}

async function main() {
  console.log("🚀 Extensión barra-lateral-config iniciada");

  while (!Spicetify?.Topbar) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log("✅ Spicetify detectado");

  new Spicetify.Topbar.Button("Configurar Barra Lateral", "Configuracion", () => {
    if (document.getElementById("barra-lateral-panel")) return;
    createPanel();
  });

  console.log("✅ Botón agregado");
  applyConfig();
}

main();
