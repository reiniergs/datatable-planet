export const emit = Symbol('emit');
export const subscribe = Symbol('subscribe');
const privateEvents = Symbol('privateEvents');

export default function eventEmitter(Base) {
    return class extends Base {
        [privateEvents] = {};

        [emit](eventName, payload) {
            const callbackList = this[privateEvents][eventName];
            if (callbackList) {
                callbackList.forEach((callback) => {
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

            return function unsubcribe() {
                this[privateEvents][eventName] = this[privateEvents][eventName]
                    .filter(eventFn => callback !== eventFn);
            };
        }
    };
}
