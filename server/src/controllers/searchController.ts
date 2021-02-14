import { Request, Response, NextFunction } from "express";
import { ApiError, ApiResponse, Client as ElasticClient } from "@elastic/elasticsearch";
import {Client as GoogleClient} from "@googlemaps/google-maps-services-js";

import bodybuilder from "bodybuilder";
const client = new ElasticClient({ node: "http://localhost:9200" });

class SearchController {
  async search(req: Request, res: Response, next: NextFunction) {
    const searchParams = req.body;

    const googleClient = new GoogleClient({});

    // Could we use the user search to find a posible location and expand the search result with polling stations around this area
    googleClient.geocode({
      params: {
        key: process.env.GOOGLE_API || "",
        address: "oslo",
        region: "NO"
      },
      timeout: 1000,
    }).then(r => {
      console.log(r.data.results[0].geometry.location);
      
    }).catch((e) => {
    console.log(e.response.data.error_message);
  });


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
        "postal_code^9",
      ],
      {
        query: searchParams.query,
        lenient: true,
        zero_terms_query: "all",
      }
    );

    if (searchParams.filter?.locationFilter) {
      builder.filter("geo_distance", {
        distance: searchParams.filter.locationFilter.distance,
        location: {
          lat: searchParams.filter.locationFilter.location.lat,
          lon: searchParams.filter.locationFilter.location.lon,
        },
      });
    }

    if (searchParams.filter?.municipalityName) {
      builder.filter("term", "municipality_name", "Halden");
    }

    const body = builder.build();

    console.log(body);

    client.search(
      {
        index: "polling-station",
        body: body,
      },
      (error: ApiError, result: ApiResponse) => {
        if (error) {
          console.log(error);
          res.end();
        }
        res.send({ data: result.body.hits });
      }
    );
  }
}

export default SearchController;
