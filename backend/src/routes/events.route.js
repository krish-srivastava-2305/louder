import { Router } from "express";
import getEventsByCity from "../controllers/getEventsByCity.js";

const router = Router();

router.get("/:cityName", getEventsByCity)

export {  router as eventsRouter };