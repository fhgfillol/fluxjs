// Example components for FluxJS ECS
import { BaseComponent } from './ecs.js';

export class Transform extends BaseComponent {
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.scale = 1;
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
    this.vx = 0;
    this.vy = 0;
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
