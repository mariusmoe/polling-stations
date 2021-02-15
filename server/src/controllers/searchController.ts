import { Request, Response, NextFunction } from "express";
import {
  ApiError,
  ApiResponse,
  Client as ElasticClient,
} from "@elastic/elasticsearch";
import { Client as GoogleClient } from "@googlemaps/google-maps-services-js";

import bodybuilder from "bodybuilder";
const client = new ElasticClient({ node: "http://localhost:9200" });

class SearchController {
  async search(req: Request, res: Response, next: NextFunction) {
    const searchParams = req.body;

    const googleClient = new GoogleClient({});

    // Could we use the user search to find a posible location and expand the search result with polling stations around this area

    let customPlace: { lat: number; lng: number } | undefined = undefined;
    if (searchParams.place) {
      try {
        const googleLocationResult = await googleClient.geocode({
          params: {
            key: process.env.GOOGLE_API || "",
            address: searchParams.place,
            region: "NO",
          },
          timeout: 1000,
        });

        console.log(googleLocationResult.data.results[0].geometry.location);
        customPlace = googleLocationResult.data.results[0].geometry.location;
      } catch (error) {
        console.log(error);
      }
    }

    const builder = bodybuilder();

    builder.from(searchParams.from || 0);
    builder.size(searchParams.size || 0);
    builder.query(
      "multi_match",
      "fields",
      [
        "area^2",
        "address_line",
        "county_name",
        "polling_place_name",
        "municipality_name",
        "info_text",
        "postal_code^4",
      ],
      {
        query: searchParams.query,
        lenient: true,
        zero_terms_query: "all",
      }
    );

    
    if (searchParams.filter?.locationFilter?.location?.lat || customPlace) {
      builder.filter("geo_distance", {
        distance: searchParams.filter.locationFilter.distance,
        location: {
          lat:
            customPlace?.lat || searchParams.filter.locationFilter.location.lat,
          lon:
            customPlace?.lng || searchParams.filter.locationFilter.location.lon,
        },
      });

      builder.sort([
        {
          _geo_distance: {
            location: {
              lat:
                customPlace?.lat ||
                searchParams.filter.locationFilter.location.lat,
              lon:
                customPlace?.lng ||
                searchParams.filter.locationFilter.location.lon,
            },
            order: "asc",
            unit: "km",
            mode: "min",
          },
        },
      ]);
    }

    if (searchParams.filter?.municipalityName) {
      builder.filter("term", "municipality_name", "Halden");
    }

    const body = builder.build();

    console.log("Search: \n", JSON.stringify(body, null, 2));

    client.search(
      {
        index: "polling-station",
        body: body,
      },
      (error: ApiError, result: ApiResponse) => {
        if (error) {
          console.log("error >>>>", error);
          const errorBody = (error as any)?.meta?.body
          console.log("error >>>>", errorBody);
          return res.status(400).json({
            status: "error",
            error: error.message,
          });
        }
        res.send({ data: result.body.hits });
      }
    );
  }
}

export default SearchController;
