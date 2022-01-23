#!/usr/bin/env node
import client, { register } from 'prom-client';
import express, { Express } from 'express';
import { TeslaAPI } from './tesla-api';
import { CenterDisplayState, Vehicle } from './types';
import yargs = require('yargs');

const DEFAULT_HTTP_PORT = 9898;
const expr: Express = express();
expr.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

interface ClientOptions {
  token: string;
  port?: number;
  interval?: number;
  vin?: string;
  debug?: boolean;
}

const options: ClientOptions = yargs
  .options({
    token: {
      alias: 't',
      description: 'Tesla account API token',
      type: 'string',
      demandOption: true,
      default: process.env.TESLA_EXPORTER_TOKEN,
    },
    port: {
      description: 'Used HTTP port',
      default: parseInt(process.env.TESLA_EXPORTER_PORT) || DEFAULT_HTTP_PORT,
    },
    interval: {
      alias: 'i',
      description: 'Scraping interval in seconds',
      default: parseInt(process.env.TESLA_EXPORTER_INTERVAL) || 120,
    },
    vin: {
      description: 'VIN of the car to be monitored',
      type: 'string',
      default: process.env.TESLA_EXPORTER_VIN,
    },
    debug: {
      alias: 'd',
      description: 'Debug mode',
      boolean: true,
      default: /true/i.test(process.env.TESLA_EXPORTER_DEBUG),
    },
  })
  .help().argv;

const metrics = {
  charge_state: {
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

    battery_heater_on: new client.Counter({
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

    charge_to_max_range: new client.Counter({
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
  },
  drive_state: {
    speed: new client.Gauge({
      name: 'tesla_car_speed',
      help: 'registered speed of the car',
      labelNames: ['vehicle'],
    }),
  },
  vehicle_state: {
    odometer: new client.Gauge({
      name: 'tesla_odometer',
      help: 'run miles',
      labelNames: ['vehicle'],
    }),
  },
};

async function reportVehicleData(
  api: TeslaAPI,
  vehicle: Vehicle
): Promise<'asleep' | 'online' | 'off'> {
  try {
    if (vehicle.state !== 'asleep') {
      console.log('Requesting data');
      const vehicleData = await api.data(vehicle.id);
      if (!vehicleData) {
        console.warn(`Cannot read vehicle data for ${vehicle.display_name}`);
        return 'asleep';
      }
      if (options.debug) {
        console.log(vehicleData);
      }

      console.log('Expose data as metric');
      Object.keys(metrics).forEach(section => {
        Object.keys(metrics[section]).forEach(metric => {
          const value = vehicleData[section][metric];
          if (value !== undefined && value !== null && !(typeof value === 'string')) {
            const prometheusMetric = metrics[section][metric];
            if (options.debug) {
              console.log(`${prometheusMetric.name}: ${value}`);
            }
            try {
              if (prometheusMetric instanceof client.Counter) {
                if (value) {
                  prometheusMetric.inc(
                    {
                      vehicle: vehicleData.display_name,
                    },
                    1
                  );
                }
              } else {
                prometheusMetric.set(
                  {
                    vehicle: vehicleData.display_name,
                  },
                  value
                );
              }
            } catch (e) {
              console.error(`Can't report metric ${prometheusMetric.name}: ${e.message}`);
            }
          }
        });
      });
      if (vehicleData.vehicle_state.center_display_state === CenterDisplayState.Off) {
        return 'off';
      }
      return 'online';
    } else {
      console.info(`Vehicle ${vehicle.display_name} is ${vehicle.state}, skipping request`);
      return 'asleep';
    }
  } catch (e) {
    console.error(e.message);
  }
}

let timeout: NodeJS.Timeout;

function startPolling(vehicleId: number, api: TeslaAPI): void {
  const ms = options.interval * 1000;
  let vehicle = null;
  const callback = async () => {
    timeout.unref();

    vehicle = vehicle || (await api.vehicle(vehicleId));
    console.log(`Vehicle: ${vehicle.display_name}, state ${vehicle.state}`);
    const report = await reportVehicleData(api, vehicle);

    switch (report) {
      case 'asleep':
        vehicle = null;
        timeout = setTimeout(callback, ms);
        break;
      case 'online':
        timeout = setTimeout(callback, ms);
        break;
      case 'off':
        console.log('Sleep tentative');
        timeout = setTimeout(callback, 15 * 60 * 1000); // 15 minutes of delay
    }
  };

  timeout = setTimeout(callback, ms);
}

async function run() {
  if (options.debug) {
    console.log(options);
  }
  const server = expr.listen(options.port);
  console.log(`Exporter listening on port ${options.port}...(press CTRL+c to interrupt)`);
  try {
    if (!options.token) {
      throw new Error('Token is required');
    }
    const api = new TeslaAPI(options.token);
    const vehicles = await api.vehicles();
    // get the selected vehicle or the first one!
    const vehicle = options.vin ? vehicles.find(v => v.vin === options.vin) : vehicles[0];
    if (vehicle) {
      startPolling(vehicle.id, api);

      return new Promise<void>(resolve => {
        process.stdin.on('keypress', async (str, key) => {
          if (key.ctrl && key.name === 'c') {
            clearTimeout(timeout);
            server.close();
            resolve();
          }
        });
      });
    } else {
      console.error(`Can't find vehicle with VIN ${options.vin}`);
    }
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
