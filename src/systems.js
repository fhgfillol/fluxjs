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