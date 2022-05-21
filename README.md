# tesla-prometheus-exporter

A Prometheus exporter for your Tesla vehicle.

It exposes metrics such as Remaining Battery Percentage, Remaining Range, Charger Current, etc.

Originally developed by [madchicken](https://github.com/madchicken/tesla-prometheus-exporter). I have now forked and continued development due to inactivity of the original repository.

## Usage

Firstly get a Tesla API **refresh token** (not access token). The easiest way is to use [this utility on the Tesla-info.com website](https://tesla-info.com/tesla-token.php). Note that since version 2.0.0, it's the **refresh token**, not the access token, that's required.

Then pass the token to the exporter.

    # install
    npm install -g @wywywywy/tesla-prometheus-exporter

    # run
    tesla-prometheus-exporter --token=qts-a0123456789

Or if you're using Docker, set the required environment variables as listed below (at least the `TESLA_EXPORTER_TOKEN`), and simply run the [wywywywy/tesla_exporter image on Docker Hub](https://hub.docker.com/r/wywywywy/tesla_exporter).

    # docker
    docker run -e TESLA_EXPORTER_TOKEN=eyJa0123456789 -p 9885:9885 wywywywy/tesla_exporter

And then access `http://localhost:9885/metrics`.

Since version 2.0.0, it will try to get a new access token from the provided refresh token once every 7 hours, so you don't have to keep providing new access tokens.

For Docker Compose & Kubernetes deployments, see the `examples` directory.

## Notes

If the car is sleeping, it will **not** attempt to get data from Tesla, as that will wake the car up which is a major battery drain.

If the car is awake, but the screen is off, the exporter will **stop** for 15 mins, in order to not keep the car awake and allow it to go to sleep gracefully.

## Options

Some options can be set as environment variables instead of command line arguments.

| Option | Environment Variable | Description | Notes |
|---|---|---|---|
| `--version` | | Show version number | |
| `--token` | `TESLA_EXPORTER_TOKEN`| Tesla API refresh token | **Required**  |
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
