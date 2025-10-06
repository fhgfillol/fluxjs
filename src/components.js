// Example components for FluxJS ECS
import { BaseComponent } from "../ecs.js";

export class Position extends BaseComponent {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
    }
    reset() {
        this.x = 0;
        this.y = 0;
    }
}

export class Velocity extends BaseComponent {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
    }
    reset() {
        this.x = 0;
        this.y = 0;
    }
}

export class Acceleration extends BaseComponent {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
    }
    reset() {
        this.x = 0;
        this.y = 0;
    }
}

export class Color extends BaseComponent {
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

export class Radius extends BaseComponent {
    constructor() {
        super();
        this.value = 10;
        this.targetValue = 10;
        this.multiplier = 10;
    }
    reset() {
        this.value = 10;
        this.targetValue = 10;
        this.multiplier = 10;
    }
}

export class Follow extends BaseComponent {
    constructor() {
        super();
    }

    reset() {
    }
}

export class Escape extends BaseComponent {
    constructor() {
        super();
    }

    reset() {
    }
}

export class Lifetime extends BaseComponent {
    constructor() {
        super();
        this.duration = 1;
    }
    reset() {
        this.duration = 1;
    }
}