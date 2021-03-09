import yargs = require('yargs');
import { TeslaAPI } from '../tesla-api';
import { OPTION_CODES } from '../option-codes';

interface ClientOptions {
  _: (string | number)[];
  token: string;
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
    },
    vin: { description: 'VIN of the car to use', type: 'string' },
    debug: { alias: 'd', description: 'Debug mode', boolean: true, default: false },
  })
  .command('info', 'Request car information')
  .demandCommand()
  .help().argv;

async function displayVehicleInfo() {
  const api = new TeslaAPI(options.token);
  const vehicles = await api.vehicles();
  const vehicle = options.vin ? vehicles.find(v => v.vin === options.vin) : vehicles[0];
  if (vehicle) {
    console.log(`${vehicle.display_name} in ${vehicle.state} mode`);
    const codes = vehicle.option_codes.split(',');
    codes.forEach(code => {
      const option = OPTION_CODES.find(c => c.code === code);
      if (option) {
        console.log(`${option.title} (${option.description || 'no description'})`);
      }
    });
  } else {
    console.log('Car not found');
  }
}

async function run() {
  if (options.debug) {
    console.log(options);
  }

  const command = options._[0];
  switch (command) {
    case 'info':
      await displayVehicleInfo();
      break;
    default:
      console.log(`Unknown command ${command}, exiting...`);
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
