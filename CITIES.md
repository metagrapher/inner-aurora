# CITIES

## How to Add a City

Onboarding a new city follows a specific pattern.

1. We need to know what a city's primary areas are called, both by locals and municipally. This means two pieces of research:
    1. We need to know what the city calls its primary areas, such as precincts, districts, wards, hoods, neighborhoods, boroughs, quadrants, etc. (Some cities may have more than one.)
    2. We need to know what the city calls its districts, the names of the main neighborhoods or districts within each city. We need between 4 and 7 districts. (7 might be too many, in many cases.)

    OUTPUT: A JSON object with the following structure:
    ```json
    { "primaryAreas": 
        { "local": "wards"
        , "municipal": "precincts"
        }
    , "districts": 
        [ "Downtown"
        , "Uptown"
        , "Midtown"
        , "Suburbia"
        , "The City"
        ]
    }
    ```

2. From census data or other municipal / gov source we need to get a polygon for the city itself, geo coordinates for the city center and for its airport, as well as polygons and a centerpoint for each neighborhood we identified in step 1. This is likely already available as a KML or other geodata format. We should either discover or derive the square mileage, though it should be available from census, neighborhood square mileage may not be, and we may have to derive it or source it from local sources.

3. We need to ascertain the city's wealth index. This is information that will come from census data, in most cases. We need to know this for the city as a whole and for each district.

It is calculated from census data, primarily. We use a simple formula that considers population density and median income in that area. The formula is as follows:

population / square mileage of the area = population density (PD) -- for cities we can often find this precalculated, but it may not be for a district/neighborhood.

total income for an area / population = median income (MI) -- this can usually be found precalculated, but be careful, as that value is often by household or by head of household, or may be specific for certain demographics. It's important to consider median income and not mean.

PD * MI / 10**9 = wealth index

We use 10 to the 9th power as our divisor because we want to normalize to a number that is around or less than 1 for an affordable area.

    OUTPUT: A JSON object with the following structure:
```json
    { "population": 1070907
    , "sqmi": 201.49
    , "median_income": 74054
    , "index": 3.9359247098119012
    , "districts": 
        { "Downtown": 
            { "population": 467700
            , "sqmi": 15.1
            , "median_income": 48000
            , "index": 0.9565986754966889 
            }
        , "Uptown":  
            { "population": 244871
            , "sqmi": 15.1
            , "median_income": 48000
            , "index": 0.9565986754966889 
            }
        , "Midtown":   
            { "population": 30446
            , "sqmi": 15.1
            , "median_income": 48000
            , "index": 0.9565986754966889 
            }
        , "Suburbia":   
            { "population": 84705
            , "sqmi": 1614.7
            , "median_income": 48000
            , "index": 0.9565986754966889 
            }
        , "The City":   
            { "population": 300930
            , "sqmi": 15.1
            , "median_income": 48000
            , "index": 0.9565986754966889 
            }
        }
    }
```

4. How many police officers are there per capita in the city and each of its districts? 
This data is harder to find. Sometimes we have to look for police per sqaure mile and then knowing how many people per square mile we can easily find how many police per square mile. Many cities do not publish this data granularly, so we may use the entire city's ratio and then adjust for the square mileage of each district.

I've gotten feedback that we need to define people. Here we define per person as per census registered resident. We are not considering inflow traffic or other temporal influx and outflux, we are considering census residents, which is usually how police departments determine coverage.

HOWEVER, it has recently come to attention that there is Flock Camera data available that may be indicative of police presence, or at least how much the police monitor an area, and we may want to use this data for determining the risk of doing business in a district. This flock camera data should be geo data, too, so if we don't know how many flock cameras are in an area, we can probably count them. We are not using this data, yet, but we should begin collecting it.

Output a map object of neighborhoods to numerical values that is normalized to officers per 1000 residents.

5. We need to know what the top 4 drugs of abuse are for a city. Ideal is if we can discover this information granularly for each neighborhood. This is often harder to discover. Some cities have unique drugs. We need to know if a drug is an upper or a downer. If a drug is new, we need to update our drugs chart, so that we can determine effects and our pricing model.

6. We need to understand transit in the city. 
    1. We need to know what they call their light rail system and their bus system.
    2. We need to know the name of the nearest airport, travel cost to / from, travel times to city parts from the airport, the airport code, any notes about connecting to or from the airport such as taxi only or no light rail etc
    3. We need a travel time and travel cost matrix for each neighborhood to arrive at each neighborhood on each mode of transportation available in the city.
    4. We need average gas prices for the city and gas station density for each neighborhood, and we need a source for this data on a regular basis (gasbuddy may be a good source?)