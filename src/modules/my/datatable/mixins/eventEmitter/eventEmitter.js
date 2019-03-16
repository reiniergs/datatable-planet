export const emit = Symbol('emit');
export const subscribe = Symbol('subscribe');
const privateEvents = Symbol('privateEvents');

export default function EventEmitter(Base) {
    return class extends Base {
        [privateEvents] = {};

        [emit](eventName, payload) {
            const eventsArray = this[privateEvents][eventName];
            if (eventsArray) {
                eventsArray.forEach((callback) => {
                    callback(payload);
                });
            }
        }

        [subscribe](eventName, callback) {
            if (this[privateEvents][eventName]) {
                this[privateEvents][eventName].push(callback);
            } else {
                this[privateEvents][eventName] = [callback];
            }

            return () => {
                this[privateEvents][eventName] = this[privateEvents][eventName]
                    .filter(eventFn => callback !== eventFn);
            };
        }
    };
}
