# tesla-prometheus-exporter

A Prometheus exporter for your tesla car

## Installation

    npm i -g tesla-prometheus-exporter

### Usage

    tesla-prometheus-exporter -h

### Options

- --version Show version number [boolean]
- --token TESLA API Token [required]
- --port Used HTTP port for metrics export [default: 9898]
- --interval Scraping interval in seconds [default: 120]
- --vin VIN of the car to be monitored. If not provided the fist one will be used.
- --debug Debug mode
- --help Show help
