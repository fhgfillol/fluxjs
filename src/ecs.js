// FluxJS: A lightweight Entity Component System for JavaScript
export class ECS {
    constructor(maxEntities) {
        this.maxEntities = maxEntities;
        this.components = {};
        this.componentClassToBit = new Map();
        this.registeredBits = [];
        this.nextBit = 1;
        this.freeEntityIds = [];
        this.activeEntities = [];
        this.systems = [];

        this.registerComponent(Entity);

        for (let i = 0; i < maxEntities; i++) {
            this.freeEntityIds.push(i);
        }
    }

    registerComponent(componentClass) {
        if (!this.componentClassToBit.has(componentClass)) {
            const bit = this.nextBit;
            this.componentClassToBit.set(componentClass, bit);
            this.components[bit] = new Array(this.maxEntities).fill(null).map(() => new componentClass());
            this.registeredBits.push(bit);
            this.nextBit *= 2;
        }
    }

    activateEntity() {
        if (this.freeEntityIds.length > 0) {
            const id = this.freeEntityIds.pop();
            const entity = this.components[1][id];
            entity.mask = 1;
            entity.dirtyMask = 1;

            for (let i = 0; i < this.registeredBits.length; i++) {
                const bit = this.registeredBits[i];
                if (bit !== 1) {
                    this.components[bit][id].reset();
                }
            }
            this.activeEntities.push(id);
            return id;
        }
        return -1;
    }

    deactivateEntity(entityId) {
        const entity = this.components[1][entityId];
        entity.dirtyMask = 0;
        this.freeEntityIds.push(entityId);
        const index = this.activeEntities.indexOf(entityId);
        if (index !== -1) {
            this.activeEntities.splice(index, 1);
        }
    }

    enableComponent(entityId, componentClass) {
        const bit = this.componentClassToBit.get(componentClass);
        if (bit) {
            const entity = this.components[1][entityId];
            entity.dirtyMask |= bit;
            return this.components[bit][entityId];
        }
        return null;
    }

    disableComponent(entityId, componentClass) {
        const bit = this.componentClassToBit.get(componentClass);
        if (bit) {
            const entity = this.components[1][entityId];
            entity.dirtyMask &= ~bit;
        }
    }

    getComponent(entityId, componentClass) {
        const bit = this.componentClassToBit.get(componentClass);
        return this.components[bit][entityId];
    }

    addSystem(system) {
        this.systems.push(system);
    }

    update(dt) {
        for (let i = 0; i < this.systems.length; i++) {
            this.systems[i](dt, this);
        }
        this.updateEntityMasks();
    }

    updateEntityMasks() {
        for (let i = 0; i < this.maxEntities; i++) {
            const entity = this.components[1][i];
            if (entity.mask !== entity.dirtyMask) {
                entity.mask = entity.dirtyMask;
            }
        }
    }

    queryEntities(...componentClasses) {
        let requiredMask = 1;
        for (let i = 0; i < componentClasses.length; i++) {
            const bit = this.componentClassToBit.get(componentClasses[i]);
            if (bit === undefined) {
                throw new Error(`Componente no registrado: ${componentClasses[i].name}`);
            }
            requiredMask |= bit;
        }
        const result = [];
        for (let i = 0; i < this.activeEntities.length; i++) {
            const entityId = this.activeEntities[i];
            const entity = this.components[1][entityId];
            if ((entity.mask & requiredMask) === requiredMask) {
                result.push(entityId);
            }
        }
        return result;
    }
}

export class BaseComponent {
    reset() {
        throw new Error("El método reset() debe ser implementado en los componentes.");
    }
}

export class Entity extends BaseComponent {
    constructor() {
        super();
        this.mask = 0;
        this.dirtyMask = 0;
    }
}