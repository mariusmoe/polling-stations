import express from "express";
import validateSearch from "./validation/validateSearchParams";
import SearchController from "./controllers/SearchController";
import SimpleDataController from "./controllers/simpleDataController";

const searchController = new SearchController();
const simpleDataController = new SimpleDataController();

const router = express.Router();

router.post("/search", [validateSearch, searchController.search]);
router.get("/municipality_name", [ simpleDataController.municipalityName]);

export default router;
