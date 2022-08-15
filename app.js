// supports expiration in 1 sec interval.
class Redis {
  #database;
  tickEverySecond() {
    setInterval(() => {
      // current time
      const time = Math.ceil(new Date().getTime() / 1000);

      console.log(time);

      if (this.expirationMap.has(time)) {
        // expirationMap keys are time stamps
        const valuesToDelete = this.expirationMap.get(time);

        // against expirationMap[time] we have array of keys that will expire in given time
        valuesToDelete.forEach((key) => this.database.delete(key));

        // optionally delete expirationMap[time]
        this.expirationMap.delete(time);
      }
    }, 1000); // tick every second
  }

  appendKeyInExpirationMap(timeIn10Sec, key) {
    const list = this.expirationMap[timeIn10Sec];
    if (!list) this.expirationMap.set(timeIn10Sec, [key]);
    else list.push(key);
    console.log(this.expirationMap);
  }

  constructor() {
    this.database = new Map();
    this.expirationMap = new Map();
    this.tickEverySecond();
  }

  set(key, value, durationIn10Sec, callback = null) {
    this.database.set(key, value);
    this.appendKeyInExpirationMap(
      Math.ceil(new Date().getTime() / 1000) + durationIn10Sec,
      key
    );

    callback?.();
  }

  get(key, callback = null) {
    const value = this.database.get(key);
    callback?.(value);
    return value;
  }

  del(key, callback = null) {
    this.database.delete(key);
    callback?.();
  }

  quit(callback = null) {
    this.database.clear();
    callback?.();
  }

  getAllKeys() {
    return this.database.keys();
  }
}

// module.exports = Redis;

let object = new Redis();
const time = new Date().getTime();

object.set("name", "John Doe", 7);
object.set("subject", "System Deign", 5);
object.set("roll", "1001", 3);

setInterval(() => {
  console.log("----->::: ", object.getAllKeys());
}, 1000);
