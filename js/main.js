class SimulationManager {
  constructor() {
    this.isRunning = false;
    this.generation = 1;
    this.startTime = 0;
    this.bestDistance = 0;
    this.cars = [];
    this.traffic = [];
    this.road = null;
    this.bestCar = null;

    this.initializeElements();
    this.initializeEventListeners();
    this.initializeSimulation();
    this.usePretrainedBrain();
  }

  initializeElements() {
    this.carCanvas = document.getElementById("carCanvas");
    this.networkCanvas = document.getElementById("networkCanvas");

    // Set canvas sizes
    this.carCanvas.width = 300;
    this.carCanvas.height = 600;
    this.networkCanvas.width = 500;
    this.networkCanvas.height = 600;

    this.carCtx = this.carCanvas.getContext("2d");
    this.networkCtx = this.networkCanvas.getContext("2d");

    // Control elements
    this.startBtn = document.getElementById("startBtn");
    this.usePretrainedBrainBtn = document.getElementById("usePretrainedBrain");
    this.notUsePretrainedBrainBtn = document.getElementById(
      "notUsePretrainedBrain",
    );
    this.stopBtn = document.getElementById("stopBtn");
    this.resetBtn = document.getElementById("resetBtn");
    this.saveBtn = document.getElementById("saveBtn");
    this.loadBtn = document.getElementById("loadBtn");
    this.deleteBtn = document.getElementById("deleteBtn");

    // Sliders
    this.carCountSlider = document.getElementById("carCount");
    this.mutationSlider = document.getElementById("mutationRate");

    // Checkboxes
    this.showSensorsCheck = document.getElementById("showSensors");
    this.showNetworkCheck = document.getElementById("showNetwork");
    this.showTrafficCheck = document.getElementById("showTraffic");

    // Stats
    this.generationStat = document.getElementById("generation");
    this.bestDistanceStat = document.getElementById("bestDistance");
    this.carsAliveStat = document.getElementById("carsAlive");
    this.timeStat = document.getElementById("time");

    // Value displays
    this.carCountValue = document.getElementById("carCountValue");
    this.mutationValue = document.getElementById("mutationValue");

    // Load saved settings
    const savedCarCount = localStorage.getItem("carCount") || 120;
    const savedMutation = localStorage.getItem("mutationAmount") || 0.1;

    this.carCountSlider.value = savedCarCount;
    this.carCountValue.textContent = savedCarCount;
    this.mutationSlider.value = savedMutation;
    this.mutationValue.textContent = savedMutation;
  }

  initializeEventListeners() {
    // Button events
    this.startBtn.addEventListener("click", () => this.startSimulation());
    this.usePretrainedBrainBtn.addEventListener("click", () =>
      this.usePretrainedBrain(),
    );
    this.notUsePretrainedBrainBtn.addEventListener("click", () =>
      this.deleteBrain(),
    );
    this.stopBtn.addEventListener("click", () => this.stopSimulation());
    this.resetBtn.addEventListener("click", () => this.resetSimulation());
    this.saveBtn.addEventListener("click", () => this.saveBestBrain());
    this.loadBtn.addEventListener("click", () => this.loadBrain());
    this.deleteBtn.addEventListener("click", () => this.deleteBrain());

    // Slider events
    this.carCountSlider.addEventListener("input", (e) => {
      this.carCountValue.textContent = e.target.value;
      localStorage.setItem("carCount", e.target.value);
    });

    this.mutationSlider.addEventListener("input", (e) => {
      this.mutationValue.textContent = e.target.value;
      localStorage.setItem("mutationAmount", e.target.value);
    });

    // Keyboard controls
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case " ":
          e.preventDefault();
          this.deleteBrain();
          break;
        case "r":
        case "R":
          this.resetSimulation();
          break;
        case "s":
        case "S":
          this.saveBestBrain();
          break;
      }
    });
  }

  initializeSimulation() {
    this.road = new Road(this.carCanvas.width / 2, this.carCanvas.width * 0.9);
    this.generateCars();
    this.generateTraffic();

    const savedBrain = localStorage.getItem("bestBrain");
    if (savedBrain) {
      for (let i = 0; i < this.cars.length; i++) {
        this.cars[i].brain = JSON.parse(savedBrain);
        if (i !== 0) {
          NeuralNetwork.mutate(
            this.cars[i].brain,
            parseFloat(this.mutationSlider.value),
          );
        }
      }
    }

    this.bestCar = this.cars[0];
    this.startSimulation();
    this.animate();
  }

  generateCars() {
    const carCount = parseInt(this.carCountSlider.value);
    this.cars = [];

    for (let i = 0; i < carCount; i++) {
      this.cars.push(new Car(this.road.getLaneCenter(1), 100, 30, 50, "AI", 4));
    }
  }

  generateTraffic() {
    this.traffic = [
      new Car(
        this.road.getLaneCenter(1),
        -100,
        30,
        50,
        "DUMMY",
        2,
        getRandomColor(),
      ),
      new Car(
        this.road.getLaneCenter(0),
        -300,
        30,
        50,
        "DUMMY",
        2,
        getRandomColor(),
      ),
      new Car(
        this.road.getLaneCenter(2),
        -300,
        30,
        50,
        "DUMMY",
        2,
        getRandomColor(),
      ),
      new Car(
        this.road.getLaneCenter(0),
        -500,
        30,
        50,
        "DUMMY",
        2,
        getRandomColor(),
      ),
      new Car(
        this.road.getLaneCenter(1),
        -500,
        30,
        50,
        "DUMMY",
        2,
        getRandomColor(),
      ),
      new Car(
        this.road.getLaneCenter(1),
        -700,
        30,
        50,
        "DUMMY",
        2,
        getRandomColor(),
      ),
      new Car(
        this.road.getLaneCenter(2),
        -700,
        30,
        50,
        "DUMMY",
        2,
        getRandomColor(),
      ),
    ];
  }

  usePretrainedBrain() {
    const defaultBrain = {
      levels: [
        {
          inputs: [0.42050172444762424, 0, 0, 0, 0],
          outputs: [0, 1, 0, 0, 1, 1],
          biases: [
            0.4007947679112621, -0.2314396559522583, 0.1356633325662595,
            -0.0005005958304615879, -0.40977919201472546, -0.07687411924205753,
          ],
          weights: [
            [
              -0.2218970456660171, 0.029302257299221562, -0.03761715048840894,
              -0.12460771731117165, 0.4005612171163914, -0.1761212859306358,
            ],
            [
              0.2783220173538617, 0.21422124151065025, 0.26815545189874057,
              -0.09562143240910424, -0.08110542410674978, -0.05988865990068215,
            ],
            [
              0.1660631928205347, 0.4151766372916441, 0.10494287881787279,
              0.007676843889507096, -0.016970690155645243, -0.14289994371552717,
            ],
            [
              -0.37241743761704094, -0.005739986414523654,
              -0.030681888718047542, -0.06389950978800098, -0.12879477174175816,
              0.0783717924912257,
            ],
            [
              0.27355851949193255, -0.1478932443584539, 0.1963179596712099,
              0.23620963956957935, 0.21509365789266072, -0.2394570090274909,
            ],
          ],
        },
        {
          inputs: [0, 1, 0, 0, 1, 1],
          outputs: [1, 0, 0, 0],
          biases: [
            0.20152881746771317, 0.06160224691627503, 0.07086410590680632,
            0.14682686883248822,
          ],
          weights: [
            [
              0.018432051311949384, -0.3624508224473132, 0.09528606801098982,
              0.08077711528247045,
            ],
            [
              0.14161847875442934, -0.42912170030516184, -0.0444599311164911,
              -0.05256343404094816,
            ],
            [
              0.050465817154411154, -0.4220106357209658, 0.07884089356311119,
              0.14119780000324264,
            ],
            [
              0.2569995765593953, 0.244865399994403, -0.24291910498268812,
              0.06735381268568821,
            ],
            [
              0.352234076312654, 0.3391128242442817, 0.22734232553011754,
              -0.2817247555640754,
            ],
            [
              -0.008835799798809094, 0.015661579496946597, -0.1239518836565811,
              -0.14606154560208545,
            ],
          ],
        },
      ],
    };

    localStorage.setItem("bestBrain", JSON.stringify(defaultBrain));
    this.usePretrainedBrainBtn.innerText = "Using Pretrained Brain";

    this.loadBrain();
    this.resetSimulation();
  }

  startSimulation() {
    this.isRunning = true;
    this.startTime = Date.now();
    if (this.startBtn) {
      this.startBtn.disabled = true;
      this.startBtn.classList.add("loading");
    }
    if (this.stopBtn) {
      this.stopBtn.disabled = false;
    }
  }

  stopSimulation() {
    this.isRunning = false;
    if (this.startBtn) {
      this.startBtn.disabled = false;
      this.startBtn.classList.remove("loading");
    }
    if (this.stopBtn) {
      this.stopBtn.disabled = true;
    }
  }

  toggleSimulation() {
    if (this.isRunning) {
      this.stopSimulation();
    } else {
      this.startSimulation();
    }
  }

  resetSimulation() {
    this.generation++;
    if (this.generationStat) {
      this.generationStat.textContent = this.generation;
    }

    const mutationRate = parseFloat(this.mutationSlider.value);

    // Find best car
    this.bestCar = this.cars.find(
      (c) => c.y === Math.min(...this.cars.map((c) => c.y)),
    );

    // Update best distance
    const currentBestDistance = -Math.min(...this.cars.map((c) => c.y));
    if (currentBestDistance > this.bestDistance) {
      this.bestDistance = currentBestDistance;
      if (this.bestDistanceStat) {
        this.bestDistanceStat.textContent = Math.round(this.bestDistance);
      }
    }

    // Generate new generation
    this.cars = [];
    const carCount = parseInt(this.carCountSlider.value);
    for (let i = 0; i < carCount; i++) {
      this.cars.push(new Car(this.road.getLaneCenter(1), 100, 30, 50, "AI", 4));

      if (this.bestCar && this.bestCar.brain) {
        this.cars[i].brain = JSON.parse(JSON.stringify(this.bestCar.brain));
        if (i !== 0) {
          NeuralNetwork.mutate(this.cars[i].brain, mutationRate);
        }
      }
    }

    // Reset traffic
    this.generateTraffic();
    this.startTime = Date.now();

    this.showNotification("🔄 New generation started!", "info");
  }

  saveBestBrain() {
    if (this.bestCar && this.bestCar.brain) {
      localStorage.setItem("bestBrain", JSON.stringify(this.bestCar.brain));
      this.showNotification("🧠 Brain saved successfully!", "success");
    } else {
      this.showNotification("❌ No brain to save!", "error");
    }
  }

  loadBrain() {
    const savedBrain = localStorage.getItem("bestBrain");
    if (savedBrain) {
      for (let i = 0; i < this.cars.length; i++) {
        this.cars[i].brain = JSON.parse(savedBrain);
        if (i !== 0) {
          NeuralNetwork.mutate(
            this.cars[i].brain,
            parseFloat(this.mutationSlider.value),
          );
        }
      }
      this.showNotification("🧠 Brain loaded successfully!", "info");
    } else {
      this.showNotification("❌ No saved brain found!", "error");
    }
  }

  deleteBrain() {
    localStorage.removeItem("bestBrain");
    this.cars = [];
    this.generation = 0;
    this.resetSimulation();
    this.usePretrainedBrainBtn.innerText = "Use Pretrained Brain";
    this.showNotification("🗑️ Brain deleted successfully!", "warning");
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "15px 20px",
      borderRadius: "8px",
      color: "white",
      fontWeight: "600",
      zIndex: "1000",
      transform: "translateX(300px)",
      transition: "transform 0.3s ease",
    });

    // Set background color based on type
    const colors = {
      success: "#00b894",
      error: "#e17055",
      warning: "#fdcb6e",
      info: "#74b9ff",
    };
    notification.style.background = colors[type] || colors.info;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(300px)";
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  updateStats() {
    if (this.isRunning && this.startTime) {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      if (this.timeStat) {
        this.timeStat.textContent = `${elapsed}s`;
      }
    }

    const aliveCars = this.cars.filter((car) => !car.damaged).length;
    if (this.carsAliveStat) {
      this.carsAliveStat.textContent = aliveCars;
    }

    // Auto-reset if all cars are damaged
    if (aliveCars === 0 && this.isRunning) {
      setTimeout(() => this.resetSimulation(), 1000);
    }
  }

  animate() {
    // Update traffic
    for (let i = 0; i < this.traffic.length; i++) {
      this.traffic[i].update(this.road, []);
    }

    // Update cars
    for (let i = 0; i < this.cars.length; i++) {
      this.cars[i].update(this.road, this.traffic);
    }

    // Find best car
    this.bestCar = this.cars.find(
      (c) => c.y === Math.min(...this.cars.map((c) => c.y)),
    );

    // Update stats
    this.updateStats();

    // Clear canvases
    this.carCtx.clearRect(0, 0, this.carCanvas.width, this.carCanvas.height);
    this.networkCtx.clearRect(
      0,
      0,
      this.networkCanvas.width,
      this.networkCanvas.height,
    );

    // Set up camera to follow best car
    this.carCtx.save();
    this.carCtx.translate(0, -this.bestCar.y + this.carCanvas.height * 0.7);

    // Draw road
    this.road.draw(this.carCtx);

    // Draw traffic
    if (!this.showTrafficCheck || this.showTrafficCheck.checked) {
      for (let i = 0; i < this.traffic.length; i++) {
        this.traffic[i].draw(this.carCtx, "red");
      }
    }

    // Draw all cars with low opacity
    this.carCtx.globalAlpha = 0.2;
    for (let i = 0; i < this.cars.length; i++) {
      this.cars[i].draw(this.carCtx, "blue");
    }
    this.carCtx.globalAlpha = 1;

    // Draw best car
    const showSensors = !this.showSensorsCheck || this.showSensorsCheck.checked;
    this.bestCar.draw(this.carCtx, "blue", showSensors);

    this.carCtx.restore();

    // Draw neural network
    if (!this.showNetworkCheck || this.showNetworkCheck.checked) {
      this.networkCtx.lineDashOffset = -Date.now() / 50;
      Visualizer.drawNetwork(this.networkCtx, this.bestCar.brain);
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Utility function for random colors
function getRandomColor() {
  const hue = 290 + Math.random() * 260;
  return `hsl(${hue}, 100%, 60%)`;
}

// Initialize simulation when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new SimulationManager();
});
