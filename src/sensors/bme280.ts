export class Bme280SensorLocal {

    private bme280: any;

    constructor(config, logger) {
        this.bme280 = {};
    }

    public init() {
        return new Promise( (resolve, reject) => {
            resolve(true);
        });  
    }

    public read() {
        return new Promise( (resolve, reject) => {
            const data = {
                temperature_C: 20.5,
                pressure_hPa: 215,
                temperature_Fa: 125,
                pressure_inHg: 200,
            };

            setTimeout( () => {
                resolve(data);
            }, 2500)
        });
    }


}