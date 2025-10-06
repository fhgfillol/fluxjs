// Simple bouncing balls example for FluxJS ECS
import { Render, Rigidbody, Transform } from '../src/components.js';
import { ECS } from '../src/ecs.js';
import { PhysicsSystem, RenderSystem } from '../src/systems.js';

export function startParticleSim({ canvas, maxEntities = 100, particleCount = 10, width = 800, height = 600 }) {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const ecs = new ECS(maxEntities);
  ecs.registerComponent(Transform);
  ecs.registerComponent(Rigidbody);
  ecs.registerComponent(Render);

  for (let i = 0; i < particleCount; i++) {
    const entityId = ecs.activateEntity();
    const transform = ecs.enableComponent(entityId, Transform);
    const rigidbody = ecs.enableComponent(entityId, Rigidbody);
    const render = ecs.enableComponent(entityId, Render);

    transform.x = Math.random() * width;
    transform.y = Math.random() * height * 0.5;
    rigidbody.vx = (Math.random() - 0.5) * 200;
    rigidbody.vy = 0;
    render.r = Math.floor(Math.random() * 255);
    render.g = Math.floor(Math.random() * 255);
    render.b = Math.floor(Math.random() * 255);
  }

  ecs.addSystem((dt, ecs) => PhysicsSystem(dt, ecs, width, height));
  ecs.addSystem((dt, ecs) => RenderSystem(dt, ecs, ctx));

  let lastTime = performance.now();

  function gameLoop() {
    const currentTime = performance.now();
    const dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ecs.update(dt);
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}