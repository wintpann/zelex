/**
 * @api {get} /{serveURL}/logs/request
 * @apiGroup GetRequestLogs
 * @apiDescription Get paginated request logs by specified filter.
 * ServeURL is the transport serve prefix you specified when created transports
 *
 * @apiParam (query) {String=GET,POST,PUT,PATCH,DELETE} [method] Filter logs by request method
 * @apiParam (query) {Number} [code] Filter logs by status code
 * @apiParam (query) {String} [path] Filter logs by base path (without query params)
 * @apiParam (query) {Number} [pageSize] Specifies logs count for page
 * @apiParam (query) {Number} [pageIndex] Specifies page index
 * @apiParam (query) {Date} [dateFrom] Filter logs by date from
 * @apiParam (query) {Date} [dateTo] Filter logs by date to
 * @apiParam (query) {String=
 *  createDateAsc,
 *  createDateDesc,
 *  durationAsc,
 *  durationDesc,
 *  trafficAsc,
 *  trafficDesc
 *  } [sort] Sorts logs by specified field
 *
 * @apiSuccessExample {json} Success response:
 * {
 *    "result": [
 *        {
            "_id": "Tue Mar 23 2021 14:37:12 GMT+0300 (Moscow Standard Time)@4610315640.json",
            "traffic": {
                "incoming": 2000,
                "outgoing": 3000,
                "total": 5000
            },
            "time": {
                "started": "2021-03-23T11:37:12.301Z",
                "finished": "2021-03-23T11:37:12.301Z",
                "duration": 0
            },
            "geo": {
                "location": {
                    "latitude": 0,
                    "longitude": 0
                },
                "city": "",
                "region": ""
            },
            "request": {
                "body": {
                    "access_token": "Basic auth"
                },
                "headers": {
                    "content-type": "application/json"
                },
                "ip": "176.59.71.118",
                "path": "super/secret/data",
                "method": "PUT",
                "params": {},
                "query": {}
            },
            "response": {
                "code": 403,
                "headers": {
                    "content-type": "application/json"
                },
                "data": {
                    "message": "Access forbidden"
                }
            },
            "extra": {
                "user": {
                    "id": "qwerty123456"
                }
            },
            "dataLogs": [
                {
                    "level": 2,
                    "levelHumanized": "Info",
                    "step": "getting data from db",
                    "name": "JS_ERROR",
                    "description": "table does not exist",
                    "time": "2021-02-13T20:06:05.118Z",
                    "data": {
                        "some": {
                            "random": {
                                "useful": {
                                    "data": 123
                                }
                            }
                        }
                    }
                }
            ]
        }
 *    ],
 *    "nextPageExists": true
 * }
 *
 * @apiErrorExample {json} Error response
 * {
 *     "result": [],
 *     "nextPageExists": false,
 *     "notify": {
 *         "type": "error",
 *         "text": "could not get logs"
 *     }
 * }
 */

/**
 * @api {get} /{serveURL}/logs/data
 * @apiGroup GetDataLogs
 * @apiDescription Get paginated data logs by specified filter.
 * ServeURL is the transport serve prefix you specified when created transports
 *
 * @apiParam (query) {String=Info,Warning,Error,Debug,Fatal} [level] Filter logs by severity level
 * @apiParam (query) {String} [name] Filter logs by name
 * @apiParam (query) {Number} [pageSize] Specifies logs count for page
 * @apiParam (query) {Number} [pageIndex] Specifies page index
 * @apiParam (query) {Date} [dateFrom] Filter logs by date from
 * @apiParam (query) {Date} [dateTo] Filter logs by date to
 * @apiParam (query) {String=
 *  createDateAsc,
 *  createDateDesc,
 *  } [sort] Sorts logs by specified field
 *
 * @apiSuccessExample {json} Success response:
 * {
 *    "result": [
 *        {
            "_id": "Wed Mar 24 2021 00:42:12 GMT+0300 (Moscow Standard Time)@6660408323.json",
            "level": 4,
            "levelHumanized": "Info",
            "time": "2021-03-23T21:42:12.301Z",
            "step": "getting data from db",
            "name": "JS_ERROR",
            "description": "table does not exist",
            "data": {
                "some": {
                    "random": {
                        "useful": {
                            "data": 123
                        }
                    }
                }
            }
        }
 *    ],
 *    "nextPageExists": true
 * }
 *
 * @apiErrorExample {json} Error response
 * {
 *     "result": [],
 *     "nextPageExists": false,
 *     "notify": {
 *         "type": "error",
 *         "text": "could not get logs"
 *     }
 * }
 */

/**
 * @api {get} /{serveURL}/options/request
 * @apiGroup GetRequestLogOptions
 * @apiDescription Get request log filter options
 * ServeURL is the transport serve prefix you specified when created transports
 *
 * @apiParam (query) {Boolean} [scanForNew] Scans for new *available paths, codes, methods
 * (scans if any value passed for param)
 * *available means values that were found in your logs
 * e.g. if you have no request logs with 400 code, this code will not be returned
 *
 * @apiSuccessExample {json} Success response:
 * {
    "filter": {
        "path": [
            {
                "id": "super/secret/data",
                "name": "super/secret/data"
            }
        ],
        "code": [
            {
                "id": 403,
                "name": 403
            }
        ],
        "method": [
            {
                "id": "PUT",
                "name": "PUT"
            }
        ]
    },
    "sort": [
        {
            "id": "createDateAsc",
            "name": "Creation Date (increasing)"
        },
        {
            "id": "createDateDesc",
            "name": "Creation Date (decreasing)"
        },
        {
            "id": "durationAsc",
            "name": "Duration (increasing)"
        },
        {
            "id": "durationDesc",
            "name": "Duration (decreasing)"
        },
        {
            "id": "trafficAsc",
            "name": "Traffic (increasing)"
        },
        {
            "id": "trafficDesc",
            "name": "Traffic (decreasing)"
        }
    ]
}
 */

/**
 * @api {get} /{serveURL}/options/data
 * @apiGroup GetDataLogOptions
 * @apiDescription Get data log filter options
 * ServeURL is the transport serve prefix you specified when created transports
 *
 * @apiParam (query) {Boolean} [scanForNew] Scans for new *available paths, codes, methods
 * (scans if any value passed for param)
 * *available means values that were found in your logs
 *
 * @apiSuccessExample {json} Success response:
 * {
    "filter": {
        "level": [
            {
                "id": "Info",
                "name": "Info"
            },
            {
                "id": "Warning",
                "name": "Warning"
            },
            {
                "id": "Error",
                "name": "Error"
            },
            {
                "id": "Debug",
                "name": "Debug"
            },
            {
                "id": "Fatal",
                "name": "Fatal"
            }
        ],
        "name": [
            {
                "id": "JS_ERROR",
                "name": "JS_ERROR"
            }
        ]
    },
    "sort": [
        {
            "id": "createDateAsc",
            "name": "Creation Date (increasing)"
        },
        {
            "id": "createDateDesc",
            "name": "Creation Date (decreasing)"
        }
    ]
}
 */

/**
 * @api {post} /{serveURL}/geo
 * @apiGroup LoadGeo
 * @apiDescription Load geo info for request log
 * ServeURL is the transport serve prefix you specified when created transports
 *
 * @apiParam (body) {String} ip Requester ip address
 * @apiParam (body) {String} id Id of request log
 *
 * @apiSuccessExample {json} Success response:
 * {
    "geo": {
        "location": {
            "latitude": 51.6592,
            "longitude": 39.2269
        },
        "city": "Voronezh",
        "region": "Voronezhskaya Oblast'"
    }
}
 */
