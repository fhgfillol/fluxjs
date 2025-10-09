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

## Quick Start

Create a simple simulation with bouncing balls:

```javascript
// Example components for FluxJS ECS
import { BaseComponent } from './ecs.js';

export class Transform extends BaseComponent {
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.scale = 1; // Escala para el tamaño de la bolita
  }
  reset() {
    this.x = 0;
    this.y = 0;
    this.scale = 1;
  }
}

export class Rigidbody extends BaseComponent {
  constructor() {
    super();
    this.vx = 0; // Velocidad en x
    this.vy = 0; // Velocidad en y
  }
  reset() {
    this.vx = 0;
    this.vy = 0;
  }
}

export class Render extends BaseComponent {
  constructor() {
    super();
    this.r = 255;
    this.g = 255;
    this.b = 255;
  }
  reset() {
    this.r = 255;
    this.g = 255;
    this.b = 255;
  }
}
```

```javascript
// Example systems for FluxJS ECS
import { Transform, Rigidbody, Render } from './components.js';

export function PhysicsSystem(dt, ecs, width, height) {
  const entities = ecs.queryEntities(Transform, Rigidbody);
  const gravity = 500;
  for (let i = 0; i < entities.length; i++) {
    const entityId = entities[i];
    const transform = ecs.getComponent(entityId, Transform);
    const rigidbody = ecs.getComponent(entityId, Rigidbody);

    rigidbody.vy += gravity * dt;

    transform.x += rigidbody.vx * dt;
    transform.y += rigidbody.vy * dt;

    const speed = Math.sqrt(rigidbody.vx * rigidbody.vx + rigidbody.vy * rigidbody.vy);
    transform.scale = 1 + speed * 0.001;

    if (transform.y > height - 20 * transform.scale) {
      transform.y = height - 20 * transform.scale;
      rigidbody.vy *= -0.98;
    }

    if (transform.x > width + 20 * transform.scale) {
      transform.x = -20 * transform.scale;
    } else if (transform.x < -20 * transform.scale) {
      transform.x = width + 20 * transform.scale;
    }
  }
}

export function RenderSystem(dt, ecs, ctx) {
  const entities = ecs.queryEntities(Transform, Render);
  for (let i = 0; i < entities.length; i++) {
    const entityId = entities[i];
    const transform = ecs.getComponent(entityId, Transform);
    const render = ecs.getComponent(entityId, Render);
    ctx.beginPath();
    ctx.arc(transform.x, transform.y, 20 * transform.scale, 0, 2 * Math.PI);
    ctx.fillStyle = `rgb(${render.r}, ${render.g}, ${render.b})`;
    ctx.fill();
    ctx.closePath();
  }
}
```

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

const transform = ecs.enableComponent(ball, Transform);
transform.x = 400;
transform.y = 100;

const rigidbody = ecs.enableComponent(ball, Rigidbody);
rigidbody.vx = 100;

const render = ecs.enableComponent(ball, Render);
render.r = 255;

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
- ⭐ Star this repository on [GitHub](https://github.com/fhgfillol/fluxjs)!
- ☕ [Support me on Ko-fi](https://ko-fi.com/fhgfillol)
- ☕ [Buy me a coffee](https://buymeacoffee.com/fhgfillol)

## License

MIT License