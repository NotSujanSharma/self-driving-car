# 🚗 Self-Driving Car Simulation

A stunning self-driving car simulation built entirely with vanilla JavaScript, HTML, and CSS - no external libraries required!

![Self-Driving Car Demo](https://img.shields.io/badge/Demo-Live-brightgreen)
![JavaScript](https://img.shields.io/badge/JavaScript-68.8%25-yellow)
![HTML](https://img.shields.io/badge/HTML-18.6%25-orange)
![CSS](https://img.shields.io/badge/CSS-12.6%25-blue)

## ✨ Features

- 🧠 **Neural Network AI** - Self-learning car behavior
- 🛣️ **Dynamic Road Generation** - Procedural road layouts
- 🚦 **Traffic Simulation** - Realistic traffic patterns
- 🎮 **Interactive Controls** - Manual override capabilities
- 📊 **Real-time Visualization** - Neural network decision making
- 🎨 **Smooth Animations** - CSS-powered visual effects
- 📱 **Responsive Design** - Works on desktop and mobile

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/NotSujanSharma/self-driving-car.git
   cd self-driving-car
   ```

2. **Open in browser**
   ```bash
   # use python server or any other server to start a local server
   python3 -m http.server
   ```

3. **Start driving!**
   - Watch the AI learn to navigate traffic
   - Use arrow keys for manual control
   - Adjust AI parameters in real-time

## 🎮 Controls

| Key | Action |
|-----|--------|
| `↑` | Accelerate |
| `↓` | Brake/Reverse |
| `←` | Turn Left |
| `→` | Turn Right |
| `Space` | Delete Brain and Reset Simulation |
| `R` | Reset Simulation |
| `S` | Save Best Brain |

## 🧠 How It Works

The self-driving car uses a neural network to make driving decisions:

1. **Sensors** - Ray casting for obstacle detection
2. **Neural Network** - Processes sensor data
3. **Decision Making** - Outputs steering and acceleration
4. **Learning** - Genetic algorithm for improvement

### Architecture

```
Sensors → Neural Network → Controls → Car Movement
    ↑                           ↓
    └─── Feedback Loop ←────────┘
```

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Pure CSS3 with animations
- **Canvas**: HTML5 Canvas for rendering
- **AI**: Custom neural network implementation
- **No Dependencies**: 100% library-free!

## 📁 Project Structure

```
self-driving-car/
├── css
│   ├── style.css          # Main styles
├── img
│   ├── car.png            # Car image
├── js
│   ├── main.js            # Main entry point
│   ├── car.js             # Car physics
│   ├── controls.js        # Controls
│   ├── network.js         # Neural network implementation
│   ├── sensor.js          # Sensor system
│   ├── road.js            # Road generation
│   ├── visualizer.js      # Neural network visualization
│   └── utils.js           # Utility functions
└── index.html          # Main HTML file
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sujan Sharma** ([@NotSujanSharma](https://github.com/NotSujanSharma))

- 🌐 Website: [https://sujan.brokenai.ca](https://sujan.brokenai.ca)
- 📧 Email: [sujan@brokenai.ca](mailto:sujan@brokenai.ca)
- 🐦 Twitter: [@CheaterPeter0](https://twitter.com/CheaterPeter0)

## 🙏 Acknowledgments

- Inspired by modern autonomous vehicle technology
- Built with passion for AI and web development
- Thanks to the open-source community for inspiration

## ⭐ Show Your Support

If you found this project helpful or interesting, please consider giving it a star! ⭐

---
