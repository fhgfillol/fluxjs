# FluxJS

A lightweight and flexible **Entity Component System (ECS)** for JavaScript, designed for games and interactive simulations. FluxJS makes it easy to build modular, performant applications by separating entities, components, and systems.

## Features

- 🛠 **Simple API**: Create entities, register components, and add systems with a clean interface.
- ⚡ **Performant**: Uses bitmasks for fast component queries.
- 🎮 **Game-ready**: Perfect for physics-based simulations and game mechanics.
- 📦 **Modular**: Extend with custom components and systems.

## Installation

```bash
npm install @fhgfillol/fluxjs
```

**Note**: FluxJS is not yet published to NPM. For now, clone the repository to try it out.

## Quick Start

Create a simple simulation with bouncing balls:

```javascript
import { ECS, Entity } from '@fhgfillol/fluxjs';
import { Transform, Rigidbody, Render } from './components.js';
import { PhysicsSystem, RenderSystem } from './systems.js';

// Initialize canvas
const canvas = document.getElementById('gameCanvas');
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext('2d');

// Initialize ECS
const ecs = new ECS(100);
ecs.registerComponent(Transform);
ecs.registerComponent(Rigidbody);
ecs.registerComponent(Render);

// Create a ball
const ball = ecs.activateEntity();
ecs.enableComponent(ball, Transform).x = 400;
ecs.enableComponent(ball, Transform).y = 100;
ecs.enableComponent(ball, Rigidbody).vx = 100;
ecs.enableComponent(ball, Render).r = 255;

// Add systems
ecs.addSystem((dt, ecs) => PhysicsSystem(dt, ecs, 800, 600));
ecs.addSystem((dt, ecs) => RenderSystem(dt, ecs, ctx));

// Game loop
let lastTime = performance.now();
function gameLoop() {
  const dt = (performance.now() - lastTime) / 1000;
  lastTime = performance.now();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ecs.update(dt);
  requestAnimationFrame(gameLoop);
}
gameLoop();
```

## Example: Bouncing Balls

Try the bouncing balls demo to see FluxJS in action! It features balls with dynamic scaling that bounce off the bottom of the canvas and wrap around the sides.

To run the example locally:

```bash
git clone https://github.com/fhgfillol/fluxjs.git
cd fluxjs
npm install
npm run example
```

Open http://localhost:5173 in your browser to see the demo.

## Usage

1. **Register Components**: Define components by extending BaseComponent.
2. **Create Entities**: Use ecs.activateEntity() and enable components.
3. **Add Systems**: Write systems as functions that process entities with specific components.
4. **Update**: Call ecs.update(dt) in your game loop.

## Contributing

Contributions are welcome! Fork the repo, make changes, and submit a pull request. Check out the Contributing Guide for details.

## Support

Love FluxJS? Help keep it alive:

- ⭐ Star this repository on GitHub!
- 💖 Sponsor via GitHub Sponsors
- ☕ Buy me a coffee

## License

MIT License