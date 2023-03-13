class Redis {
	#database = new Map();
	#expirationMap = new Map();
	#timerId;

	constructor() {
		this.#tickEverySecond();
	}

	#getCurrentTimePerSecond() {
		return Math.ceil(new Date().getTime() / 1000);
	}

	#tickEverySecond() {
		this.#timerId = setInterval(() => {
			const currentTimePerSecond = this.#getCurrentTimePerSecond();

			if (!this.#expirationMap.has(currentTimePerSecond)) {
				return;
			}

			const keysToExpire = this.#expirationMap.get(currentTimePerSecond);
			keysToExpire.forEach((key) => this.#database.delete(key));

			this.#expirationMap.delete(currentTimePerSecond);
		}, 1000);
	}

	#addKeyToExpirationMap(key, expirationTime) {
		const keysToExpire = this.#expirationMap.get(expirationTime) || [];
		keysToExpire.push(key);
		this.#expirationMap.set(expirationTime, keysToExpire);
	}

	set(key, value, durationInSeconds) {
		if (durationInSeconds <= 0) {
			throw new Error("Duration must be a positive number.");
		}

		const expirationTime =
			this.#getCurrentTimePerSecond() + durationInSeconds;
		this.#addKeyToExpirationMap(key, expirationTime);
		this.#database.set(key, value);
	}

	get(key) {
		return this.#database.get(key);
	}

	del(key) {
		this.#database.delete(key);
	}

	quit() {
		clearInterval(this.#timerId);
		this.#database.clear();
		this.#expirationMap.clear();
	}

	getAllKeys() {
		return this.#database.keys();
	}
}

module.exports = new Redis;
