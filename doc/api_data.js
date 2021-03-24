define({ "api": [
  {
    "type": "get",
    "url": "/{serveURL}/options/data",
    "title": "",
    "group": "GetDataLogOptions",
    "description": "<p>Get data log filter options ServeURL is the transport serve prefix you specified when created transports</p>",
    "parameter": {
      "fields": {
        "query": [
          {
            "group": "query",
            "type": "Boolean",
            "optional": true,
            "field": "scanForNew",
            "description": "<p>Scans for new *available paths, codes, methods (scans if any value passed for param) *available means values that were found in your logs</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success response:",
          "content": "{\n    \"filter\": {\n        \"level\": [\n            {\n                \"id\": \"Info\",\n                \"name\": \"Info\"\n            },\n            {\n                \"id\": \"Warning\",\n                \"name\": \"Warning\"\n            },\n            {\n                \"id\": \"Error\",\n                \"name\": \"Error\"\n            },\n            {\n                \"id\": \"Debug\",\n                \"name\": \"Debug\"\n            },\n            {\n                \"id\": \"Fatal\",\n                \"name\": \"Fatal\"\n            }\n        ],\n        \"name\": [\n            {\n                \"id\": \"JS_ERROR\",\n                \"name\": \"JS_ERROR\"\n            }\n        ]\n    },\n    \"sort\": [\n        {\n            \"id\": \"createDateAsc\",\n            \"name\": \"Creation Date (increasing)\"\n        },\n        {\n            \"id\": \"createDateDesc\",\n            \"name\": \"Creation Date (decreasing)\"\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/apidoc.js",
    "groupTitle": "GetDataLogOptions",
    "name": "GetServeurlOptionsData"
  },
  {
    "type": "get",
    "url": "/{serveURL}/logs/data",
    "title": "",
    "group": "GetDataLogs",
    "description": "<p>Get paginated data logs by specified filter. ServeURL is the transport serve prefix you specified when created transports</p>",
    "parameter": {
      "fields": {
        "query": [
          {
            "group": "query",
            "type": "String",
            "allowedValues": [
              "Info",
              "Warning",
              "Error",
              "Debug",
              "Fatal"
            ],
            "optional": true,
            "field": "level",
            "description": "<p>Filter logs by severity level</p>"
          },
          {
            "group": "query",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>Filter logs by name</p>"
          },
          {
            "group": "query",
            "type": "Number",
            "optional": true,
            "field": "pageSize",
            "description": "<p>Specifies logs count for page</p>"
          },
          {
            "group": "query",
            "type": "Number",
            "optional": true,
            "field": "pageIndex",
            "description": "<p>Specifies page index</p>"
          },
          {
            "group": "query",
            "type": "Date",
            "optional": true,
            "field": "dateFrom",
            "description": "<p>Filter logs by date from</p>"
          },
          {
            "group": "query",
            "type": "Date",
            "optional": true,
            "field": "dateTo",
            "description": "<p>Filter logs by date to</p>"
          },
          {
            "group": "query",
            "type": "String",
            "allowedValues": [
              "createDateAsc",
              "createDateDesc"
            ],
            "optional": true,
            "field": "sort",
            "description": "<p>Sorts logs by specified field</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success response:",
          "content": "{\n   \"result\": [\n       {\n            \"_id\": \"Wed Mar 24 2021 00:42:12 GMT+0300 (Moscow Standard Time)@6660408323.json\",\n            \"level\": 4,\n            \"levelHumanized\": \"Info\",\n            \"time\": \"2021-03-23T21:42:12.301Z\",\n            \"step\": \"getting data from db\",\n            \"name\": \"JS_ERROR\",\n            \"description\": \"table does not exist\",\n            \"data\": {\n                \"some\": {\n                    \"random\": {\n                        \"useful\": {\n                            \"data\": 123\n                        }\n                    }\n                }\n            }\n        }\n   ],\n   \"nextPageExists\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error response",
          "content": "{\n    \"result\": [],\n    \"nextPageExists\": false,\n    \"notify\": {\n        \"type\": \"error\",\n        \"text\": \"could not get logs\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/apidoc.js",
    "groupTitle": "GetDataLogs",
    "name": "GetServeurlLogsData"
  },
  {
    "type": "get",
    "url": "/{serveURL}/options/request",
    "title": "",
    "group": "GetRequestLogOptions",
    "description": "<p>Get request log filter options ServeURL is the transport serve prefix you specified when created transports</p>",
    "parameter": {
      "fields": {
        "query": [
          {
            "group": "query",
            "type": "Boolean",
            "optional": true,
            "field": "scanForNew",
            "description": "<p>Scans for new *available paths, codes, methods (scans if any value passed for param) *available means values that were found in your logs e.g. if you have no request logs with 400 code, this code will not be returned</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success response:",
          "content": "{\n    \"filter\": {\n        \"path\": [\n            {\n                \"id\": \"super/secret/data\",\n                \"name\": \"super/secret/data\"\n            }\n        ],\n        \"code\": [\n            {\n                \"id\": 403,\n                \"name\": 403\n            }\n        ],\n        \"method\": [\n            {\n                \"id\": \"PUT\",\n                \"name\": \"PUT\"\n            }\n        ]\n    },\n    \"sort\": [\n        {\n            \"id\": \"createDateAsc\",\n            \"name\": \"Creation Date (increasing)\"\n        },\n        {\n            \"id\": \"createDateDesc\",\n            \"name\": \"Creation Date (decreasing)\"\n        },\n        {\n            \"id\": \"durationAsc\",\n            \"name\": \"Duration (increasing)\"\n        },\n        {\n            \"id\": \"durationDesc\",\n            \"name\": \"Duration (decreasing)\"\n        },\n        {\n            \"id\": \"trafficAsc\",\n            \"name\": \"Traffic (increasing)\"\n        },\n        {\n            \"id\": \"trafficDesc\",\n            \"name\": \"Traffic (decreasing)\"\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/apidoc.js",
    "groupTitle": "GetRequestLogOptions",
    "name": "GetServeurlOptionsRequest"
  },
  {
    "type": "get",
    "url": "/{serveURL}/logs/request",
    "title": "",
    "group": "GetRequestLogs",
    "description": "<p>Get paginated request logs by specified filter. ServeURL is the transport serve prefix you specified when created transports</p>",
    "parameter": {
      "fields": {
        "query": [
          {
            "group": "query",
            "type": "String",
            "allowedValues": [
              "GET",
              "POST",
              "PUT",
              "PATCH",
              "DELETE"
            ],
            "optional": true,
            "field": "method",
            "description": "<p>Filter logs by request method</p>"
          },
          {
            "group": "query",
            "type": "Number",
            "optional": true,
            "field": "code",
            "description": "<p>Filter logs by status code</p>"
          },
          {
            "group": "query",
            "type": "String",
            "optional": true,
            "field": "path",
            "description": "<p>Filter logs by base path (without query params)</p>"
          },
          {
            "group": "query",
            "type": "Number",
            "optional": true,
            "field": "pageSize",
            "description": "<p>Specifies logs count for page</p>"
          },
          {
            "group": "query",
            "type": "Number",
            "optional": true,
            "field": "pageIndex",
            "description": "<p>Specifies page index</p>"
          },
          {
            "group": "query",
            "type": "Date",
            "optional": true,
            "field": "dateFrom",
            "description": "<p>Filter logs by date from</p>"
          },
          {
            "group": "query",
            "type": "Date",
            "optional": true,
            "field": "dateTo",
            "description": "<p>Filter logs by date to</p>"
          },
          {
            "group": "query",
            "type": "String",
            "allowedValues": [
              "createDateAsc",
              "createDateDesc",
              "durationAsc",
              "durationDesc",
              "trafficAsc",
              "trafficDesc"
            ],
            "optional": true,
            "field": "sort",
            "description": "<p>Sorts logs by specified field</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success response:",
          "content": "{\n   \"result\": [\n       {\n            \"_id\": \"Tue Mar 23 2021 14:37:12 GMT+0300 (Moscow Standard Time)@4610315640.json\",\n            \"traffic\": {\n                \"incoming\": 2000,\n                \"outgoing\": 3000,\n                \"total\": 5000\n            },\n            \"time\": {\n                \"started\": \"2021-03-23T11:37:12.301Z\",\n                \"finished\": \"2021-03-23T11:37:12.301Z\",\n                \"duration\": 0\n            },\n            \"geo\": {\n                \"location\": {\n                    \"latitude\": 0,\n                    \"longitude\": 0\n                },\n                \"city\": \"\",\n                \"region\": \"\"\n            },\n            \"request\": {\n                \"body\": {\n                    \"access_token\": \"Basic auth\"\n                },\n                \"headers\": {\n                    \"content-type\": \"application/json\"\n                },\n                \"ip\": \"176.59.71.118\",\n                \"path\": \"super/secret/data\",\n                \"method\": \"PUT\",\n                \"params\": {},\n                \"query\": {}\n            },\n            \"response\": {\n                \"code\": 403,\n                \"headers\": {\n                    \"content-type\": \"application/json\"\n                },\n                \"data\": {\n                    \"message\": \"Access forbidden\"\n                }\n            },\n            \"extra\": {\n                \"user\": {\n                    \"id\": \"qwerty123456\"\n                }\n            },\n            \"dataLogs\": [\n                {\n                    \"level\": 2,\n                    \"levelHumanized\": \"Info\",\n                    \"step\": \"getting data from db\",\n                    \"name\": \"JS_ERROR\",\n                    \"description\": \"table does not exist\",\n                    \"time\": \"2021-02-13T20:06:05.118Z\",\n                    \"data\": {\n                        \"some\": {\n                            \"random\": {\n                                \"useful\": {\n                                    \"data\": 123\n                                }\n                            }\n                        }\n                    }\n                }\n            ]\n        }\n   ],\n   \"nextPageExists\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error response",
          "content": "{\n    \"result\": [],\n    \"nextPageExists\": false,\n    \"notify\": {\n        \"type\": \"error\",\n        \"text\": \"could not get logs\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/apidoc.js",
    "groupTitle": "GetRequestLogs",
    "name": "GetServeurlLogsRequest"
  },
  {
    "type": "post",
    "url": "/{serveURL}/geo",
    "title": "",
    "group": "LoadGeo",
    "description": "<p>Load geo info for request log ServeURL is the transport serve prefix you specified when created transports</p>",
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "ip",
            "description": "<p>Requester ip address</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of request log</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success response:",
          "content": "{\n    \"geo\": {\n        \"location\": {\n            \"latitude\": 51.6592,\n            \"longitude\": 39.2269\n        },\n        \"city\": \"Voronezh\",\n        \"region\": \"Voronezhskaya Oblast'\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/apidoc.js",
    "groupTitle": "LoadGeo",
    "name": "PostServeurlGeo"
  }
] });
