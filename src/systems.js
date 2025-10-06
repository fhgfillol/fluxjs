// Example systems for FluxJS ECS
import { Acceleration, Color, Escape, Follow, Lifetime, Position, Radius, Velocity } from "./components.js";

export function applyAccelerationSystem(dt, ecs) {
    const entities = ecs.queryEntities(Velocity, Acceleration);
    for (let i = 0; i < entities.length; i++) {
        const entityId = entities[i];
        const velocity = ecs.getComponent(entityId, Velocity);
        const acceleration = ecs.getComponent(entityId, Acceleration);
        velocity.x += acceleration.x * dt;
        velocity.y += acceleration.y * dt;
    }
}

export function moveSystem(dt, ecs, width, height) {
    const entities = ecs.queryEntities(Position, Velocity, Radius);
    for (let i = 0; i < entities.length; i++) {
        const entityId = entities[i];
        const position = ecs.getComponent(entityId, Position);
        const velocity = ecs.getComponent(entityId, Velocity);
        const radius = ecs.getComponent(entityId, Radius);
        position.x += velocity.x * dt;
        position.y += velocity.y * dt;

        if (position.x > width + radius.value) position.x = 0 - radius.value;
        if (position.x < 0 - radius.value) position.x = width + radius.value;
        if (position.y > height + radius.value) position.y = 0 - radius.value;
        if (position.y < 0 - radius.value) position.y = height + radius.value;
    }
}

export function followSystem(dt, ecs) {
    const entities = ecs.queryEntities(Follow, Position, Acceleration, Radius);
    for (let i = 0; i < entities.length; i++) {
        const entityId = entities[i];
        const follow = ecs.getComponent(entityId, Follow);
        const position = ecs.getComponent(entityId, Position);
        const acceleration = ecs.getComponent(entityId, Acceleration);
        const radius = ecs.getComponent(entityId, Radius).value;

        const baseAcceleration = 1000;
        const maxAcceleration = baseAcceleration / radius ** 3;
        const maxPerceptionRadius = radius ** 2;

        let closestId = null;
        let minDist = Infinity;
        const others = ecs.queryEntities(Position, Radius);
        for (let j = 0; j < others.length; j++) {
            const otherId = others[j];
            if (otherId === entityId) continue;
            const otherRadius = ecs.getComponent(otherId, Radius).value;
            if (otherRadius >= radius) continue;
            const otherPos = ecs.getComponent(otherId, Position);
            const dx = otherPos.x - position.x;
            const dy = otherPos.y - position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxPerceptionRadius && dist < minDist) {
                minDist = dist;
                closestId = otherId;
            }
        }

        if (closestId) {
            const targetPos = ecs.getComponent(closestId, Position);
            const angle = Math.atan2(targetPos.y - position.y, targetPos.x - position.x);
            acceleration.x = Math.cos(angle) * maxAcceleration;
            acceleration.y = Math.sin(angle) * maxAcceleration;
        } else {
            acceleration.x = 0;
            acceleration.y = 0;
        }
    }
}

export function escapeSystem(dt, ecs) {
    const entities = ecs.queryEntities(Escape, Position, Acceleration, Radius);
    for (let i = 0; i < entities.length; i++) {
        const entityId = entities[i];
        const escape = ecs.getComponent(entityId, Escape);
        const position = ecs.getComponent(entityId, Position);
        const acceleration = ecs.getComponent(entityId, Acceleration);
        const radius = ecs.getComponent(entityId, Radius).value;

        const baseAcceleration = 500;
        const maxAcceleration = baseAcceleration / radius;
        const maxPerceptionRadius = 200;

        let avgDx = 0;
        let avgDy = 0;
        let threatCount = 0;
        const others = ecs.queryEntities(Position, Radius);
        for (let j = 0; j < others.length; j++) {
            const otherId = others[j];
            if (otherId === entityId) continue;
            const otherRadius = ecs.getComponent(otherId, Radius).value;
            if (otherRadius <= radius) continue;
            const otherPos = ecs.getComponent(otherId, Position);
            const dx = position.x - otherPos.x;
            const dy = position.y - otherPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxPerceptionRadius) {
                avgDx += dx / dist;
                avgDy += dy / dist;
                threatCount++;
            }
        }

        if (threatCount > 0) {
            const angle = Math.atan2(avgDy, avgDx);
            acceleration.x = Math.cos(angle) * maxAcceleration;
            acceleration.y = Math.sin(angle) * maxAcceleration;
        } else {
            acceleration.x = 0;
            acceleration.y = 0;
        }
    }
}

export function collisionSystem(dt, ecs, particleEcs) {
    const entities = ecs.queryEntities(Position, Radius, Color);
    for (let i = 0; i < entities.length; i++) {
        for (let j = i + 1; j < entities.length; j++) {
            const entityA = entities[i];
            const entityB = entities[j];
            const posA = ecs.getComponent(entityA, Position);
            const posB = ecs.getComponent(entityB, Position);
            const radiusA = ecs.getComponent(entityA, Radius);
            const colorA = ecs.getComponent(entityA, Color);
            const radiusB = ecs.getComponent(entityB, Radius);
            const colorB = ecs.getComponent(entityB, Color);

            const dx = posA.x - posB.x;
            const dy = posA.y - posB.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < radiusA.value + radiusB.value) {
                if (radiusA.value > radiusB.value) {
                    const areaA = Math.PI * radiusA.value * radiusA.value;
                    const areaB = Math.PI * radiusB.value * radiusB.value;
                    const newArea = areaA + areaB;
                    radiusA.targetValue = Math.sqrt(newArea / Math.PI);
                    spawnParticles(particleEcs, posB.x, posB.y, radiusB.value, colorB);
                    ecs.deactivateEntity(entityB);
                } else if (radiusB.value > radiusA.value) {
                    const areaA = Math.PI * radiusA.value * radiusA.value;
                    const areaB = Math.PI * radiusB.value * radiusB.value;
                    const newArea = areaA + areaB;
                    radiusB.targetValue = Math.sqrt(newArea / Math.PI);
                    spawnParticles(particleEcs, posA.x, posA.y, radiusA.value, colorA);
                    ecs.deactivateEntity(entityA);
                }
            }
        }
    }
}

function spawnParticles(particleEcs, x, y, baseRadius, baseColor) {
    const particleCount = Math.floor(baseRadius * 2);
    for (let i = 0; i < particleCount; i++) {
        const entityId = particleEcs.activateEntity();
        const position = particleEcs.enableComponent(entityId, Position);
        const velocity = particleEcs.enableComponent(entityId, Velocity);
        const radius = particleEcs.enableComponent(entityId, Radius);
        const color = particleEcs.enableComponent(entityId, Color);
        const lifetime = particleEcs.enableComponent(entityId, Lifetime);

        position.x = x;
        position.y = y;
        const angle = Math.random() * 2 * Math.PI;
        const speed = (0.5 + Math.random() * 0.5) * baseRadius  * 2;  // Velocidad aleatoria
        velocity.x = Math.cos(angle) * speed;
        velocity.y = Math.sin(angle) * speed;
        radius.value = 2 + Math.random() * 3;
        radius.targetValue = 0;
        color.r = baseColor.r;
        color.g = baseColor.g;
        color.b = baseColor.b;
        lifetime.duration = 0.5 + Math.random() * 1;
        radius.multiplier = (1 / lifetime.duration) * 2;
    }
}

export function renderSystem(dt, ecs, ctx) {
    const entities = ecs.queryEntities(Position, Radius, Color);
    for (let i = 0; i < entities.length; i++) {
        const entityId = entities[i];
        const position = ecs.getComponent(entityId, Position);
        const radius = ecs.getComponent(entityId, Radius);
        const color = ecs.getComponent(entityId, Color);
        ctx.beginPath();
        ctx.arc(position.x, position.y, radius.value, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        ctx.fill();
        ctx.closePath();
    }
}

export function lifetimeSystem(dt, ecs) {
    const entities = ecs.queryEntities(Lifetime);
    for (let i = 0; i < entities.length; i++) {
        const entityId = entities[i];
        const lifetime = ecs.getComponent(entityId, Lifetime);
        lifetime.duration -= dt;
        if (lifetime.duration <= 0) {
            ecs.deactivateEntity(entityId);
        }
    }
}

export function expandRadius(dt, ecs) {
    const entities = ecs.queryEntities(Radius);
    for (let i = 0; i < entities.length; i++) {
        const entityId = entities[i];
        const radius = ecs.getComponent(entityId, Radius);
        radius.value += (radius.targetValue - radius.value) * dt * radius.multiplier;
    }
}