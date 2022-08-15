class Redis {
	#database;

	#getCurrentTimePerSecond() {
		return Math.ceil(new Date().getTime() / 1000);
	}

	tickEverySecond() {
		setInterval(() => {
			const currentTimePerSecond = this.#getCurrentTimePerSecond();

			if (this.expirationMap.has(currentTimePerSecond)) {
				// expirationMap keys are time stamps
				const valuesToDelete =
					this.expirationMap.get(currentTimePerSecond);

				// against expirationMap[time] we have array of keys that will expire in given time
				valuesToDelete.forEach((key) => this.database.delete(key));

				// optionally delete expirationMap[time]
				this.expirationMap.delete(currentTimePerSecond);
			}
		}, 1000); // tick every second
	}

	appendKeyInExpirationMap(timeIn10Sec, key) {
		const list = this.expirationMap[timeIn10Sec];

		if (list) {
			list.push(key);
			return;
		}

		this.expirationMap.set(timeIn10Sec, [key]);
	}

	constructor() {
		this.database = new Map();
		this.expirationMap = new Map();
		this.tickEverySecond();
	}

	set(key, value, duration) {
		this.database.set(key, value);
		const currentTimePerSecond = this.#getCurrentTimePerSecond();
		this.appendKeyInExpirationMap(currentTimePerSecond + duration, key);
	}

	get(key) {
		return this.database.get(key);
	}

	del(key) {
		this.database.delete(key);
	}

	quit() {
		this.database.clear();
	}

	getAllKeys() {
		return this.database.keys();
	}
}

module.exports = new Redis();
