class Redis {
	#client;

	constructor() {
		this.client = new Map();
		this.timestamp = new Map();

		setInterval(() => {
			const time = new Date().getTime();

			if (this.timestamp.size > 0 && this.timestamp.has(time)) {
				const keys = this?.client?.keys();

				for (const key of keys) {
					const value = this?.client?.get(key);

					if (time - value?.ex > value?.duration) {
						this.client?.delete(key);
					}
				}

				this.timestamp.delete(time);
			}
		}, 1000);
	}

	set(key, value, ex, duration, callback = null) {
		this.timestamp.set(ex + duration, 1);
		this.client.set(key, { value, ex, duration });
		callback?.();
	}

	get(key, callback = null) {
		const value = this.client.get(key);
		callback?.(value);
		return value;
	}

	del(key, callback = null) {
		this.client.delete(key);
		callback?.();
	}

	quit(callback = null) {
		this.client.clear();
		callback?.();
	}

	getAllKeys() {
		return this.client.keys();
	}
}

// module.exports = Redis;

let object = new Redis();
const time = new Date().getTime();

object.set("name", "John Doe", time, 2000);
object.set("subject", "System Deign", time, 5000);
object.set("roll", "1001", time, 3000);

// setInterval(() => {
// 	const objectAllKeys = object.getAllKeys();

// 	for (const key of objectAllKeys) {
// 		const value = object.get(key);
// 		const time = new Date().getTime() - value.ex;

// 		if (time > value.duration) {
// 			object.del(key);
// 		}
// 	}

// 	console.log("----->::: ", object.getAllKeys());
// }, 1000);

setInterval(() => {
	console.log("----->::: ", object.getAllKeys());
}, 1000);
