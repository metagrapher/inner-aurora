import type { City } from './types'

export const CITIES: City[] =
    [{
        id: "atl"
        , name: "Atlanta"
        , districts: ["Buckhead", "Midtown", "Little Five Points", "Old Fourth Ward", "Bankhead"]
        , areaTerm: "Hood"
        , hub: "Hartsfield-Jackson"
        , coords: { lat: 33.7490, lon: -84.3880 }
        , timezone: -5
        , wealthFactor: 1.1
        , availableResources: ["meth", "coke", "fent", "heroin"]
        , busFare: 2.50
        , railFare: 2.50
        , railConnectivity: { "Midtown": true, "Buckhead": true, "Bankhead": true, "Little Five Points": true, "Old Fourth Ward": true, "Hartsfield-Jackson": true }
        , transitTimes: {
            "Hartsfield-Jackson": { "Midtown": { rail: 25 }, "Buckhead": { rail: 35 }, "Bankhead": { rail: 30 }, "Old Fourth Ward": { rail: 45 } },
            "Midtown": { "Buckhead": { rail: 12 }, "Bankhead": { rail: 20 }, "Little Five Points": { rail: 15 }, "Old Fourth Ward": { rail: 15 } },
            "Buckhead": { "Midtown": { rail: 12 }, "Bankhead": { rail: 30 }, "Little Five Points": { rail: 25 }, "Old Fourth Ward": { rail: 25 } },
            "Bankhead": { "Midtown": { rail: 20 }, "Buckhead": { rail: 30 }, "Little Five Points": { rail: 25 }, "Old Fourth Ward": { rail: 25 } },
            "Little Five Points": { "Midtown": { rail: 15 }, "Buckhead": { rail: 25 }, "Bankhead": { rail: 25 } }
        }
        , districtData: {
            "Buckhead": { wealthFactor: 1.6428, coords: { lat: 33.8392, lon: -84.3791 } },
            "Midtown": { wealthFactor: 3.9835, coords: { lat: 33.7833, lon: -84.3831 } },
            "Little Five Points": { wealthFactor: 0.8083, coords: { lat: 33.7651, lon: -84.3493 } },
            "Old Fourth Ward": { wealthFactor: 0.8146, coords: { lat: 33.7611, lon: -84.3681 } },
            "Bankhead": { wealthFactor: 0.175, coords: { lat: 33.7744, lon: -84.4419 } }
        }
    }
        , {
        id: "chi"
        , name: "Chicago"
        , districts: ["The Loop", "Wicker Park", "South Side", "Logan Square", "Lincoln Park"]
        , areaTerm: "Ward"
        , hub: "Union Station"
        , coords: { lat: 41.8781, lon: -87.6298 }
        , timezone: -6
        , wealthFactor: 1.2
        , availableResources: ["heroin", "fent", "coke", "weed"]
        , busFare: 2.50
        , railFare: 2.50
        , railConnectivity: { "The Loop": true, "Wicker Park": true, "Logan Square": true, "South Side": true, "Lincoln Park": true, "Union Station": true }
        , transitTimes: {
            "Union Station": { "The Loop": { rail: 7 }, "Wicker Park": { rail: 22 }, "Logan Square": { rail: 27 }, "South Side": { rail: 40 }, "Lincoln Park": { rail: 25 } },
            "The Loop": { "Wicker Park": { rail: 15 }, "Logan Square": { rail: 20 }, "Lincoln Park": { rail: 15 }, "South Side": { rail: 25 } },
            "Wicker Park": { "The Loop": { rail: 15 }, "Logan Square": { rail: 10 }, "Lincoln Park": { rail: 30 }, "South Side": { rail: 45 } },
            "Logan Square": { "The Loop": { rail: 20 }, "Wicker Park": { rail: 10 }, "Lincoln Park": { rail: 35 }, "South Side": { rail: 50 } },
            "Lincoln Park": { "The Loop": { rail: 15 }, "Wicker Park": { rail: 30 }, "Logan Square": { rail: 35 }, "South Side": { rail: 40 } },
            "South Side": { "The Loop": { rail: 25 }, "Wicker Park": { rail: 45 }, "Logan Square": { rail: 50 }, "Lincoln Park": { rail: 40 } }
        }
        , districtData:
        {
            "The Loop": { wealthFactor: 3.5, coords: { lat: 41.8827, lon: -87.6233 } }
            , "South Side": { wealthFactor: 0.5, coords: { lat: 41.7821, lon: -87.6186 } }
            , "Wicker Park": { wealthFactor: 2.04, coords: { lat: 41.9088, lon: -87.6774 } }
            , "Logan Square": { wealthFactor: 1.9706, coords: { lat: 41.9288, lon: -87.7088 } }
            , "Lincoln Park": { wealthFactor: 5.499, coords: { lat: 41.9250, lon: -87.6417 } }
        }
    }
        , {
        id: "dfw"
        , name: "Dallas / Ft. Worth"
        , districts: ["Deep Ellum", "Uptown", "Bishop Arts", "Stockyards", "Arlington"]
        , areaTerm: "District"
        , hub: "DFW Terminal"
        , coords: { lat: 32.7767, lon: -96.7970 }
        , timezone: -6
        , wealthFactor: 1.2
        , availableResources: ["meth", "weed", "coke", "fent"]
        , busFare: 3.00
        , railFare: 3.00
        , railConnectivity: { "Deep Ellum": true, "Uptown": true, "Bishop Arts": true, "Stockyards": false, "Arlington": false, "DFW Terminal": true }
        , transitTimes: {
            "DFW Terminal": { "Deep Ellum": { rail: 75 }, "Uptown": { rail: 65 }, "Bishop Arts": { rail: 85 } },
            "Uptown": { "Deep Ellum": { rail: 15 }, "Bishop Arts": { rail: 30 } },
            "Deep Ellum": { "Uptown": { rail: 15 }, "Bishop Arts": { rail: 25 } },
            "Bishop Arts": { "Uptown": { rail: 30 }, "Deep Ellum": { rail: 25 } }
        }
        , districtData: {
            "Uptown": { wealthFactor: 1.95, coords: { lat: 32.7981, lon: -96.8043 } },
            "Deep Ellum": { wealthFactor: 0.7092, coords: { lat: 32.7831, lon: -96.7843 } },
            "Bishop Arts": { wealthFactor: 0.8, coords: { lat: 32.7424, lon: -96.8272 } },
            "Arlington": { wealthFactor: 0.3, coords: { lat: 32.7357, lon: -97.1081 } },
            "Stockyards": { wealthFactor: 0.15, coords: { lat: 32.7885, lon: -97.3458 } }
        }
    }
        , {
        id: "hou"
        , name: "Houston"
        , districts: ["Third Ward", "Fifth Ward", "River Oaks", "Montrose", "Memorial", "The Heights"]
        , areaTerm: "Ward"
        , hub: "Bush Intercontinental"
        , coords: { lat: 29.7604, lon: -95.3698 }
        , timezone: -6
        , wealthFactor: 1.1
        , availableResources: ["lean", "meth", "weed", "coke"]
        , busFare: 1.25
        , railFare: 1.25
        , railConnectivity: { "Third Ward": true, "Fifth Ward": false, "River Oaks": false, "Montrose": false, "Memorial": false, "The Heights": false, "Bush Intercontinental": false }
        , transitTimes: {
            "Bush Intercontinental": { "Third Ward": { rail: 80 } }
        }
        , districtData:
        {
            "River Oaks": { wealthFactor: 1.3109, coords: { lat: 29.7544, lon: -95.4211 } }
            , "Memorial": { wealthFactor: 0.72, coords: { lat: 29.7601, lon: -95.5312 } }
            , "The Heights": { wealthFactor: 0.98, coords: { lat: 29.8016, lon: -95.3952 } }
            , "Montrose": { wealthFactor: 1.32, coords: { lat: 29.7458, lon: -95.3912 } }
            , "Third Ward": { wealthFactor: 0.5426, coords: { lat: 29.7183, lon: -95.3533 } }
            , "Fifth Ward": { wealthFactor: 0.3514, coords: { lat: 29.7783, lon: -95.3333 } }
        }
    }
        , {
        id: "lax"
        , name: "Los Angeles"
        , districts: ["Venice Beach", "Hollywood", "South Central", "Silver Lake", "Compton"]
        , areaTerm: "Hood"
        , hub: "LAX Terminal"
        , coords: { lat: 34.0522, lon: -118.2437 }
        , timezone: -8
        , wealthFactor: 1.4
        , availableResources: ["meth", "fent", "coke", "weed"]
        , busFare: 1.75
        , railFare: 1.75
        , railConnectivity: { "Hollywood": true, "South Central": true, "Compton": true, "Venice Beach": false, "Silver Lake": false, "LAX Terminal": true }
        , transitTimes: {
            "LAX Terminal": { "Hollywood": { rail: 85 }, "South Central": { rail: 52 }, "Compton": { rail: 57 } },
            "Hollywood": { "South Central": { rail: 45 }, "Compton": { rail: 60 } },
            "South Central": { "Hollywood": { rail: 45 }, "Compton": { rail: 20 } },
            "Compton": { "Hollywood": { rail: 60 }, "South Central": { rail: 20 } }
        }
        , districtData:
        {
            "Hollywood": { wealthFactor: 1.54, coords: { lat: 34.0928, lon: -118.3287 } }
            , "Venice Beach": { wealthFactor: 1.5, coords: { lat: 33.9850, lon: -118.4695 } }
            , "Silver Lake": { wealthFactor: 1.69, coords: { lat: 34.0868, lon: -118.2702 } }
            , "South Central": { wealthFactor: 0.81, coords: { lat: 34.0200, lon: -118.2437 } }
            , "Compton": { wealthFactor: 0.65, coords: { lat: 33.8958, lon: -118.2201 } }
        }
    }
        , {
        id: "msy"
        , name: "New Orleans"
        , districts: ["French Quarter", "Garden District", "Tremé", "Marigny", "Uptown"]
        , areaTerm: "Ward"
        , hub: "Louis Armstrong Int'l"
        , coords: { lat: 29.9511, lon: -90.0715 }
        , timezone: -6
        , wealthFactor: 0.9
        , availableResources: ["heroin", "fent", "coke", "alcohol"]
        , busFare: 1.25
        , railFare: 1.25
        , railConnectivity: { "French Quarter": true, "Garden District": true, "Tremé": true, "Marigny": true, "Uptown": true, "Louis Armstrong Int'l": false }
        , transitTimes: {
            "Louis Armstrong Int'l": { "French Quarter": { rail: 60 } },
            "French Quarter": { "Garden District": { rail: 20 }, "Uptown": { rail: 40 }, "Tremé": { rail: 10 }, "Marigny": { rail: 15 } },
            "Garden District": { "French Quarter": { rail: 20 }, "Uptown": { rail: 20 }, "Tremé": { rail: 30 }, "Marigny": { rail: 35 } },
            "Uptown": { "French Quarter": { rail: 40 }, "Garden District": { rail: 20 }, "Tremé": { rail: 50 }, "Marigny": { rail: 55 } },
            "Tremé": { "French Quarter": { rail: 10 }, "Garden District": { rail: 30 }, "Uptown": { rail: 50 }, "Marigny": { rail: 20 } },
            "Marigny": { "French Quarter": { rail: 15 }, "Garden District": { rail: 35 }, "Uptown": { rail: 55 }, "Tremé": { rail: 20 } }
        }
        , districtData: {
            "Uptown": { wealthFactor: 1.1, coords: { lat: 29.9322, lon: -90.1111 } },
            "Garden District": { wealthFactor: 1.44, coords: { lat: 29.9288, lon: -90.0847 } },
            "French Quarter": { wealthFactor: 1, coords: { lat: 29.9583, lon: -90.0642 } },
            "Marigny": { wealthFactor: 0.84, coords: { lat: 29.9634, lon: -90.0519 } },
            "Tremé": { wealthFactor: 0.4, coords: { lat: 29.9667, lon: -90.0750 } }
        }
    }
        , {
        id: "nyc"
        , name: "New York"
        , districts: ["Brooklyn", "Bronx", "Manhattan", "Queens", "Staten Island"]
        , areaTerm: "Borough"
        , hub: "Penn Station"
        , coords: { lat: 40.7128, lon: -74.0060 }
        , timezone: -5
        , wealthFactor: 1.5
        , availableResources: ["fent", "coke", "heroin", "weed"]
        , busFare: 3.00
        , railFare: 3.00
        , railConnectivity: { "Manhattan": true, "Brooklyn": true, "Bronx": true, "Queens": true, "Staten Island": true, "Penn Station": true }
        , transitTimes: {
            "Penn Station": { "Manhattan": { rail: 6 }, "Brooklyn": { rail: 30 }, "Bronx": { rail: 45 }, "Queens": { rail: 37 }, "Staten Island": { rail: 60 } },
            "Manhattan": { "Brooklyn": { rail: 25 }, "Bronx": { rail: 30 }, "Queens": { rail: 25 }, "Staten Island": { rail: 60 } },
            "Brooklyn": { "Manhattan": { rail: 25 }, "Bronx": { rail: 55 }, "Queens": { rail: 40 }, "Staten Island": { rail: 75 } },
            "Bronx": { "Manhattan": { rail: 30 }, "Brooklyn": { rail: 55 }, "Queens": { rail: 50 }, "Staten Island": { rail: 90 } },
            "Queens": { "Manhattan": { rail: 25 }, "Brooklyn": { rail: 40 }, "Bronx": { rail: 50 }, "Staten Island": { rail: 80 } },
            "Staten Island": { "Manhattan": { rail: 60 }, "Brooklyn": { rail: 75 }, "Bronx": { rail: 90 }, "Queens": { rail: 80 } }
        }
        , districtData:
        {
            "Manhattan": { wealthFactor: 11.2172, coords: { lat: 40.7831, lon: -73.9712 } }
            , "Brooklyn": { wealthFactor: 3.9438, coords: { lat: 40.6782, lon: -73.9442 } }
            , "Queens": { wealthFactor: 2.2125, coords: { lat: 40.7282, lon: -73.7949 } }
            , "Staten Island": { wealthFactor: 0.96, coords: { lat: 40.5795, lon: -74.1502 } }
            , "Bronx": { wealthFactor: 2.0952, coords: { lat: 40.8448, lon: -73.8648 } }
        }
    }
        , {
        id: "sea"
        , name: "Seattle"
        , districts: ["Capitol Hill", "Ballard", "Belltown", "Pioneer Square", "Fremont"]
        , areaTerm: "Hood"
        , hub: "Sea-Tac Terminal"
        , coords: { lat: 47.6062, lon: -122.3321 }
        , timezone: -8
        , wealthFactor: 1.3
        , availableResources: ["fent", "meth", "heroin", "weed"]
        , busFare: 3.00
        , railFare: 3.00
        , railConnectivity: { "Capitol Hill": true, "Pioneer Square": true, "Ballard": false, "Belltown": false, "Fremont": false, "Sea-Tac Terminal": true }
        , transitTimes: {
            "Sea-Tac Terminal": { "Pioneer Square": { rail: 40 }, "Capitol Hill": { rail: 50 } },
            "Pioneer Square": { "Capitol Hill": { rail: 8 } },
            "Capitol Hill": { "Pioneer Square": { rail: 8 } }
        }
        , districtData: {
            "Capitol Hill": { wealthFactor: 2.8917, coords: { lat: 47.6222, lon: -122.3211 } },
            "Ballard": { wealthFactor: 1.6907, coords: { lat: 47.6687, lon: -122.3842 } },
            "Fremont": { wealthFactor: 1.69, coords: { lat: 47.6515, lon: -122.3501 } },
            "Belltown": { wealthFactor: 8.8631, coords: { lat: 47.6144, lon: -122.3456 } },
            "Pioneer Square": { wealthFactor: 2.4438, coords: { lat: 47.6014, lon: -122.3339 } }
        }
        , areaTermMap: { "Police": "Precinct" }
    }
        , {
        id: "sfo"
        , name: "SF / Oakland"
        , districts: ["The Mission", "Haight-Ashbury", "Tenderloin", "West Oakland", "Fruitvale"]
        , areaTerm: "Neighborhood"
        , hub: "SFO Terminal"
        , coords: { lat: 37.7749, lon: -122.4194 }
        , timezone: -8
        , wealthFactor: 1.6
        , availableResources: ["fent", "meth", "heroin", "pills"]
        , busFare: 2.85
        , railFare: 'distance'
        , railConnectivity: { "The Mission": true, "Tenderloin": true, "West Oakland": true, "Fruitvale": true, "Haight-Ashbury": false, "SFO Terminal": true }
        , transitTimes: {
            "SFO Terminal": { "The Mission": { rail: 30 }, "Tenderloin": { rail: 35 }, "West Oakland": { rail: 40 }, "Fruitvale": { rail: 45 } },
            "The Mission": { "Tenderloin": { rail: 10 }, "West Oakland": { rail: 15 }, "Fruitvale": { rail: 25 } },
            "Tenderloin": { "The Mission": { rail: 10 }, "West Oakland": { rail: 10 }, "Fruitvale": { rail: 20 } },
            "West Oakland": { "The Mission": { rail: 15 }, "Tenderloin": { rail: 10 }, "Fruitvale": { rail: 12 } },
            "Production/Frtv": { "The Mission": { rail: 25 }, "Tenderloin": { rail: 20 }, "West Oakland": { rail: 12 } }
        }
        , districtData: {
            "Haight-Ashbury": { wealthFactor: 9.164, coords: { lat: 37.7699, lon: -122.4471 } },
            "The Mission": { wealthFactor: 3.9, coords: { lat: 37.7599, lon: -122.4148 } },
            "Fruitvale": { wealthFactor: 1.6137, coords: { lat: 37.7749, lon: -122.2241 } },
            "West Oakland": { wealthFactor: 0.48, coords: { lat: 37.8044, lon: -122.2981 } },
            "Tenderloin": { wealthFactor: 2.03, coords: { lat: 37.7833, lon: -122.4121 } }
        }
    }
        , {
        id: "dc"
        , name: "Washington DC"
        , districts: ["Georgetown", "Adams Morgan", "Capitol Hill", "Anacostia", "Dupont Circle"]
        , areaTerm: "Ward"
        , hub: "Union Station"
        , coords: { lat: 38.9072, lon: -77.0369 }
        , timezone: -5
        , wealthFactor: 1.5
        , availableResources: ["pcp", "fent", "k2", "coke"]
        , busFare: 2.00
        , railFare: 'distance'
        , railConnectivity: { "Capitol Hill": true, "Dupont Circle": true, "Anacostia": true, "Georgetown": false, "Adams Morgan": false, "Union Station": true }
        , transitTimes: {
            "Union Station": { "Capitol Hill": { rail: 5, walk: 12 }, "Dupont Circle": { rail: 10 }, "Anacostia": { rail: 27 }, 'National Mall': { rail: 8, walk: 20 }, 'The Wharf': { rail: 15 } },
            "Capitol Hill": { "Union Station": { rail: 5, walk: 12 }, "Dupont Circle": { rail: 15 }, "Anacostia": { rail: 20 }, 'National Mall': { rail: 10, walk: 15 } },
            "Dupont Circle": { "Capitol Hill": { rail: 15 }, "Anacostia": { rail: 30 } },
            "Anacostia": { "Capitol Hill": { rail: 20 }, "Dupont Circle": { rail: 30 } }
        }
        , districtData: {
            "Georgetown": { wealthFactor: 1.8346, coords: { lat: 38.9097, lon: -77.0654 } },
            "Dupont Circle": { wealthFactor: 4.1004, coords: { lat: 38.9097, lon: -77.0433 } },
            "Adams Morgan": { wealthFactor: 6.2718, coords: { lat: 38.9222, lon: -77.0422 } },
            "Capitol Hill": { wealthFactor: 3.8403, coords: { lat: 38.8897, lon: -77.0089 } },
            "Anacostia": { wealthFactor: 0.4024, coords: { lat: 38.8654, lon: -76.9814 } }
        }
    }
    ]

export const getClosestCity =
    (lat: number
        , lon: number
    ) => CITIES.reduce((closest, city) => {
        const d = Math.sqrt((city.coords.lat - lat) ** 2 + (city.coords.lon - lon) ** 2)
        const dClosest = Math.sqrt((closest.coords.lat - lat) ** 2 + (closest.coords.lon - lon) ** 2)
        return d < dClosest ? city : closest
    })
    ;
export const districts =
    [{
        name: "Atlanta"
        , districts: ["Buckhead", "Midtown", "Little Five Points", "Old Fourth Ward", "Bankhead"]
    }
        , {
        name: "Chicago"
        , districts: ["The Loop", "Wicker Park", "South Side", "Logan Square", "Lincoln Park"]
    }
        , {
        name: "Dallas / Ft. Worth"
        , districts: ["Deep Ellum", "Uptown", "Bishop Arts", "Stockyards", "Arlington"]
    }
        , {
        name: "Houston"
        , districts: ["Third Ward", "Fifth Ward", "River Oaks", "Montrose", "Memorial", "The Heights"]
    }
        , {
        name: "Los Angeles"
        , districts: ["Venice Beach", "Hollywood", "South Central", "Silver Lake", "Compton"]
    }
        , {
        name: "New Orleans"
        , districts: ["French Quarter", "Garden District", "Tremé", "Marigny", "Uptown"]
    }
        , {
        name: "New York"
        , districts: ["Brooklyn", "Bronx", "Manhattan", "Queens", "Staten Island"]
    }
        , {
        name: "Seattle"
        , districts: ["Capitol Hill", "Ballard", "Belltown", "Pioneer Square", "Fremont"]
    }
        , {
        name: "SF / Oakland"
        , districts: ["The Mission", "Haight-Ashbury", "Tenderloin", "West Oakland", "Fruitvale"]
    }
        , {
        name: "Washington DC"
        , districts: ["Georgetown", "Adams Morgan", "Capitol Hill", "Anacostia", "Dupont Circle"]
    }
    ]