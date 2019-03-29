export class LightSourceSensorLocal {
    constructor() {}

    init() {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }

    read() {
        return new Promise((resolve, reject) => {
            const rawLight = 1050;
            resolve({'light_lvl': rawLight});
        });
    }

  async getStuff() {
    const light_lvl = 1050;
    return {'light_lvl': light_lvl};
   }
}
