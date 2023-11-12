# Spooler
[![Docker](https://img.shields.io/docker/image-size/joegoldin/spooler/latest)](https://hub.docker.com/r/joegoldin/spooler)

Spooler is a web application for tracking 3D printing usage, featuring an API that can be interacted with from slicers on post-processing for automatic filament tracking.

Heavily inspired by [Spoolman](https://github.com/Donkie/Spoolman), but with a log of each filament spool's usage, rather than just the total usage.

![localhost_3001_](https://github.com/joegoldin/spooler/assets/1571956/db1a2417-056d-45db-9bba-0d3869e9bd17)

## Quick Start

To run Spooler using Docker:

```bash
docker pull joegoldin/spooler:latest
docker run -p 3000:3000 -p 3001:3001 -v /path/on/host:/data joegoldin/spooler
```

## TODO: More docs coming soon...
