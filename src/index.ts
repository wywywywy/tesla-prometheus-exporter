import client, { register } from 'prom-client';
import express, { Express } from 'express';
import yargs = require('yargs');
import { TeslaAPI } from 'teslats';

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
    debug: { alias: 'd', description: 'Debug mode', default: false },
  })
  .help().argv;

const metrics = {
  battery_level: new client.Gauge({
    name: 'battery_level',
    help: 'Battery Level',
  }),

  battery_range: new client.Gauge({
    name: 'battery_range',
    help: 'Battery Range',
  }),

  battery_heater_on: new client.Gauge({
    name: 'battery_heater_on',
    help: 'Battery Heater status',
  }),
  charge_current_request: new client.Gauge({
    name: 'charge_current_request',
    help: 'charge current request',
  }),
  charge_current_request_max: new client.Gauge({
    name: 'charge_current_request_max',
    help: 'charge current request max',
  }),
  charge_energy_added: new client.Gauge({
    name: 'charge_energy_added',
    help: 'charge energy added',
  }),
  charge_limit_soc: new client.Gauge({
    name: 'charge_limit_soc',
    help: 'charge limit soc',
  }),
  charge_limit_soc_max: new client.Gauge({
    name: 'charge_limit_soc_max',
    help: 'charge limit soc max',
  }),
  charge_limit_soc_min: new client.Gauge({
    name: 'charge_limit_soc_min',
    help: 'charge limit soc min',
  }),
  charge_limit_soc_std: new client.Gauge({
    name: 'charge_limit_soc_std',
    help: 'charge limit soc std',
  }),
  charge_miles_added_ideal: new client.Gauge({
    name: 'charge_miles_added_ideal',
    help: 'charge miles added ideal',
  }),
  charge_miles_added_rated: new client.Gauge({
    name: 'charge_miles_added_rated',
    help: 'charge miles added rated',
  }),
  charge_port_door_open: new client.Counter({
    name: 'charge_port_door_open',
    help: 'charge port door open',
  }),
  charge_rate: new client.Gauge({
    name: 'charge_rate',
    help: 'charge_rate',
  }),
  charge_to_max_range: new client.Gauge({
    name: 'charge_to_max_range',
    help: 'charge to max range',
  }),

  charger_actual_current: new client.Gauge({
    name: 'charger_actual_current',
    help: 'charger actual current',
  }),
  charger_phases: new client.Gauge({
    name: 'charger_phases',
    help: 'charger_phases',
  }),
  charger_pilot_current: new client.Gauge({
    name: 'charger_pilot_current',
    help: 'charger pilot current',
  }),

  charger_power: new client.Gauge({
    name: 'charger_power',
    help: 'charger_power',
  }),

  charger_voltage: new client.Gauge({
    name: 'charger_voltage',
    help: 'charger_voltage',
  }),

  charging_state: new client.Gauge({
    name: 'charging_state',
    help: 'charging state',
  }),

  est_battery_range: new client.Gauge({
    name: 'est_battery_range',
    help: 'est battery range',
  }),
  ideal_battery_range: new client.Gauge({
    name: 'ideal_battery_range',
    help: 'ideal battery range',
  }),
  max_range_charge_counter: new client.Gauge({
    name: 'max_range_charge_counter',
    help: 'max range charge counter',
  }),
  time_to_full_charge: new client.Gauge({
    name: 'time_to_full_charge',
    help: 'time to full charge',
  }),
  timestamp: new client.Gauge({
    name: 'timestamp',
    help: 'timestamp',
  }),
  usable_battery_level: new client.Gauge({
    name: 'usable_battery_level',
    help: 'usable battery level',
  }),
};

async function reportVehicleData(api: TeslaAPI) {
  const vehicles = await api.vehicles();
  console.log(
    'my vehicles: ',
    vehicles.map(v => v.data)
  );
  // get the first vehicle!
  const vehicle = vehicles[0];
  await vehicle.commands.wakeUp();
  console.log('Vehicle awaken');
  try {
    console.log('Requesting data');
    const vehicleData = await vehicle.vehicleData();
    if (options.debug) {
      console.log(vehicleData.charge_state);
    }

    Object.keys(metrics).forEach(metric => {
      metrics[metric].set(
        {
          vehicle: vehicleData.display_name,
        },
        vehicleData[metric]
      );
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
    const timeout = setImmediate(async () => await reportVehicleData(api), options.interval * 1000);

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
