export const emit = Symbol('emit');
export const subscribe = Symbol('subscribe');

export default function EventEmitter(Base) {
    return class extends Base {
        constructor() {
            super();
            this.events = {};
        }

        [emit](eventName, payload) {
            const eventsArray = this.events[eventName];
            if (eventsArray) {
                eventsArray.forEach((callback) => {
                    setTimeout(() => callback(payload), 0);
                });
            }
        }

        [subscribe](eventName, callback) {
            if (this.events[eventName]) {
                this.events[eventName].push(callback);
            } else {
                this.events[eventName] = [callback];
            }

            return () => {
                this.events[eventName] = this.events[eventName]
                    .filter(eventFn => callback !== eventFn);
            };
        }
    };
}
