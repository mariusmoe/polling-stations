import { Request, Response, NextFunction } from "express";
import { ApiError, ApiResponse, Client } from "@elastic/elasticsearch";

const client = new Client({ node: "http://localhost:9200" });

class SimpleDataController {
  async municipalityName(_req: Request, res: Response, next: NextFunction) {
    const body = {
      size: 0,
      aggs: {
        unique_municipality_name: {
          terms: {
            field: "municipality_name",
            size: 2000,
          },
        },
      },
    };

    client.search(
      {
        index: "polling-station",
        body: body,
      },
      (error: ApiError, result: ApiResponse) => {
        if (error) {
          console.log(error);
          next(error);
        }
        res.send({
          data: result.body?.aggregations?.unique_municipality_name?.buckets,
        });
      }
    );
  }
}

export default SimpleDataController;
