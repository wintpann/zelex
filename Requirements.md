# ZELEX - requirements

## What it should be
    NodeJs Express middleware smart logger
    
## What info it should save
### Watch requests and
* Save info about request:
    * traffic (incoming, outgoing, total)
    * body
    * raw headers
    * location (coordinates)
    * city
    * region
    * country
    * isVPN
    * ip
    * path
    * method
* Save info about response
    * status code
    * raw headers
    * sent data
* Save info about request timing
    * started
    * finished
    * duration

## Where it should save info
* MongoDB instance (to serve and aggregate data later)
* Any other databases
* Json files

## It should also have associated data logs with request log
* level (silly, debug, verbose, info, warn, error)
* step (e.g. `getting info from database`, `checking token`)
* name (e.g. `JS_ERROR` for aggregating by the criteria later)
* description (what goes wrong or right, e.g. `DB crashed`)
* data (custom event data)
* time

## What it should also have
* Log event subscribing (for custom log handling)
* Ability to save custom fields
* Ability to clear logs after some time