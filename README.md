# tesla-prometheus-exporter

A Prometheus exporter for your Tesla vehicle.

It exposes metrics such as Remaining Battery Percentage, Remaining Range, Charger Current, etc.

Originally developed by [madchicken](https://github.com/madchicken/tesla-prometheus-exporter). I have now forked and continued development due to inactivity of the original repository.

## Usage

Firstly get a Tesla API token. The easiest way is to use this [utility on the Tesla-info.com website](https://tesla-info.com/tesla-token.php).

Then pass the token to the exporter.

    # install
    npm install -g @wywywywy/tesla-prometheus-exporter

    # run
    tesla-prometheus-exporter --token=qts-a0123456789

Or if you're using Docker or Kubernetes, set the required environment variables as listed below (at least the `TESLA_EXPORTER_TOKEN`), and simply run the [wywywywy/tesla_exporter image on Docker Hub](https://hub.docker.com/r/wywywywy/tesla_exporter).

    # docker
    docker run -e TESLA_EXPORTER_TOKEN=qts-a0123456789 wywywywy/tesla_exporter

And then access `http://localhost:9885/metrics`.

## Options

Some options can be set as environment variables instead of command line arguments.

| Option | Environment Variable | Description | Notes |
|---|---|---|---|
| `--version` | | Show version number | |
| `--token` | `TESLA_EXPORTER_TOKEN`| Tesla API token | **Required**  |
| `--port` | `TESLA_EXPORTER_PORT`| HTTP port to serve on | Default: **9885**  |
| `--interval` | `TESLA_EXPORTER_INTERVAL`| Scraping interval in seconds | Default: **120**  |
| `--vin` | `TESLA_EXPORTER_VIN`| VIN of the car to be monitored | If not provided, the first one will be used  |
| `--retries` | `TESLA_EXPORTER_RETRIES`| Number of times to retry when encountering an error before quitting | Set to 0 to disable. Default: **3**  |
| `--debug` | `TESLA_EXPORTER_DEBUG` | Debug mode | |
| `--help` | | Show help | |

## Prometheus

This is an example Prometheus config

```
  - job_name: 'tesla_exporter'
    scrape_interval: 2m
    metrics_path: '/metrics'
    static_configs:
      - targets:
        - '192.168.1.77:9885'
```

## Contributing

Yes, contributions are always welcome.  
Fork it & submit a pull request.

## License

This is licensed under the Apache License 2.0.

## Disclaimer

This project is not affiliated with or endorsed by Tesla.
