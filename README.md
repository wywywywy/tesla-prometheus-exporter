# tesla-prometheus-exporter

A Prometheus exporter for your tesla car

## Installation

    npm i -g tesla-prometheus-exporter

### Usage

    tesla-prometheus-exporter -h

### Options

Some options can be set as environment variables instead of command line arguments.

- `--version` Show version number [boolean]
- `--token` TESLA API Token [required] (environment variable name: `TESLA_EXPORTER_TOKEN`)
- `--port` Used HTTP port for metrics export [default: 9898] (environment variable name: `TESLA_EXPORTER_PORT`)
- `--interval` Scraping interval in seconds [default: 120] (environment variable name: `TESLA_EXPORTER_INTERVAL`)
- `--vin` VIN of the car to be monitored. If not provided the fist one will be used. (environment variable name: `TESLA_EXPORTER_VIN`)
- `--debug` Debug mode (environment variable name: `TESLA_EXPORTER_DEBUG`)
- `--help` Show help
