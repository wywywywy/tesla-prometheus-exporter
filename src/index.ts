import client, { register } from 'prom-client';
import express, { Express } from 'express';
import yargs = require('yargs');
import { TeslaAPI, VehicleAPI } from 'teslats';

const DEFAULT_HTTP_PORT = 9898;
const expr: Express = express();
expr.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
});

interface ClientOptions {
  token?: string;
  username?: string;
  password?: string;
  port?: number;
  interval?: number;
  debug?: boolean;
}

const options: ClientOptions & any = yargs
  .options({
    token: { alias: 't', description: 'Tesla account API token', demandOption: true },
    port: { description: 'Used HTTP port', default: DEFAULT_HTTP_PORT },
    username: { alias: 'u', description: 'Tesla account username', demandOption: false },
    password: { alias: 'p', description: 'Tesla account password', demandOption: false },
    interval: { alias: 'i', description: 'Scraping interval in seconds', default: 120 },
    debug: { alias: 'd', description: 'Debug mode', boolean: true, default: false },
  })
  .help().argv;

const metrics = {
  battery_level: new client.Gauge({
    name: 'tesla_battery_level',
    help: 'Battery Level',
    labelNames: ['vehicle'],
  }),

  battery_range: new client.Gauge({
    name: 'tesla_battery_range',
    help: 'Battery Range',
    labelNames: ['vehicle'],
  }),

  battery_heater_on: new client.Gauge({
    name: 'tesla_battery_heater_on',
    help: 'Battery Heater status',
    labelNames: ['vehicle'],
  }),

  charge_current_request: new client.Gauge({
    name: 'tesla_charge_current_request',
    help: 'charge current request',
    labelNames: ['vehicle'],
  }),

  charge_current_request_max: new client.Gauge({
    name: 'tesla_charge_current_request_max',
    help: 'charge current request max',
    labelNames: ['vehicle'],
  }),

  charge_energy_added: new client.Gauge({
    name: 'tesla_charge_energy_added',
    help: 'charge energy added',
    labelNames: ['vehicle'],
  }),

  charge_limit_soc: new client.Gauge({
    name: 'tesla_charge_limit_soc',
    help: 'charge limit soc',
    labelNames: ['vehicle'],
  }),

  charge_limit_soc_max: new client.Gauge({
    name: 'tesla_charge_limit_soc_max',
    help: 'charge limit soc max',
    labelNames: ['vehicle'],
  }),

  charge_limit_soc_min: new client.Gauge({
    name: 'tesla_charge_limit_soc_min',
    help: 'charge limit soc min',
    labelNames: ['vehicle'],
  }),

  charge_limit_soc_std: new client.Gauge({
    name: 'tesla_charge_limit_soc_std',
    help: 'charge limit soc std',
    labelNames: ['vehicle'],
  }),

  charge_miles_added_ideal: new client.Gauge({
    name: 'tesla_charge_miles_added_ideal',
    help: 'charge miles added ideal',
    labelNames: ['vehicle'],
  }),

  charge_miles_added_rated: new client.Gauge({
    name: 'tesla_charge_miles_added_rated',
    help: 'charge miles added rated',
    labelNames: ['vehicle'],
  }),

  charge_port_door_open: new client.Counter({
    name: 'tesla_charge_port_door_open',
    help: 'charge port door open',
    labelNames: ['vehicle'],
  }),

  charge_rate: new client.Gauge({
    name: 'tesla_charge_rate',
    help: 'charge_rate',
    labelNames: ['vehicle'],
  }),

  charge_to_max_range: new client.Gauge({
    name: 'tesla_charge_to_max_range',
    help: 'charge to max range',
    labelNames: ['vehicle'],
  }),

  charger_actual_current: new client.Gauge({
    name: 'tesla_charger_actual_current',
    help: 'charger actual current',
    labelNames: ['vehicle'],
  }),

  charger_phases: new client.Gauge({
    name: 'tesla_charger_phases',
    help: 'charger_phases',
    labelNames: ['vehicle'],
  }),

  charger_pilot_current: new client.Gauge({
    name: 'tesla_charger_pilot_current',
    help: 'charger pilot current',
    labelNames: ['vehicle'],
  }),

  charger_power: new client.Gauge({
    name: 'tesla_charger_power',
    help: 'charger_power',
    labelNames: ['vehicle'],
  }),

  charger_voltage: new client.Gauge({
    name: 'tesla_charger_voltage',
    help: 'charger_voltage',
    labelNames: ['vehicle'],
  }),

  charging_state: new client.Gauge({
    name: 'tesla_charging_state',
    help: 'charging state',
    labelNames: ['vehicle'],
  }),

  est_battery_range: new client.Gauge({
    name: 'tesla_est_battery_range',
    help: 'est battery range',
    labelNames: ['vehicle'],
  }),

  ideal_battery_range: new client.Gauge({
    name: 'tesla_ideal_battery_range',
    help: 'ideal battery range',
    labelNames: ['vehicle'],
  }),

  max_range_charge_counter: new client.Gauge({
    name: 'tesla_max_range_charge_counter',
    help: 'max range charge counter',
    labelNames: ['vehicle'],
  }),

  time_to_full_charge: new client.Gauge({
    name: 'tesla_time_to_full_charge',
    help: 'time to full charge',
    labelNames: ['vehicle'],
  }),

  timestamp: new client.Gauge({
    name: 'tesla_timestamp',
    help: 'timestamp',
    labelNames: ['vehicle'],
  }),

  usable_battery_level: new client.Gauge({
    name: 'tesla_usable_battery_level',
    help: 'usable battery level',
    labelNames: ['vehicle'],
  }),
};

async function reportVehicleData(api: TeslaAPI, vehicle: VehicleAPI) {
  try {
    console.log('Requesting data');
    const vehicleData = await vehicle.vehicleData();
    if (options.debug) {
      console.log(vehicleData.charge_state);
    }

    console.log('Expose data as metric');
    Object.keys(metrics).forEach(metric => {
      const value = vehicleData.charge_state[metric];
      if (value !== undefined && value !== null && !(typeof value === 'string')) {
        if (options.debug) {
          console.log(`${metric}: ${value}`);
        }
        if (value === true || value === false) {
          if (value) {
            metrics[metric].inc(
              {
                vehicle: vehicleData.display_name,
              },
              1
            );
          }
        } else {
          metrics[metric].set(
            {
              vehicle: vehicleData.display_name,
            },
            value
          );
        }
      }
    });
  } catch (e) {
    console.error(e.message, e);
  }
}

async function run() {
  if (options.debug) {
    console.log(options);
  }
  const server = expr.listen(options.port);
  console.log(`Exporter listening on port ${options.port}...(press CTRL+c to interrupt)`);
  try {
    const api = new TeslaAPI(options.token);
    const vehicles = await api.vehicles();
    // get the first vehicle!
    const vehicle = vehicles[0];
    await vehicle.commands.wakeUp();
    console.log('Vehicle awaken');
    const timeout = setInterval(
      async () => await reportVehicleData(api, vehicle),
      options.interval * 1000
    );

    return new Promise<void>(resolve => {
      process.stdin.on('keypress', async (str, key) => {
        if (key.ctrl && key.name === 'c') {
          clearInterval(timeout);
          server.close();
          resolve();
        }
      });
    });
  } catch (e) {
    console.error(e.message, e);
    throw e;
  }
}

run()
  .then(() => {
    console.log('Exiting...');
    process.exit(0);
  })
  .catch(() => {
    console.log('Exiting...');
    process.exit(1);
  });
