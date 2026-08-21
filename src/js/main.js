/**
 * CHRONOS — entry point.
 * Styles are imported here so webpack owns the whole dependency graph.
 */
import "../styles/main.scss";
import { startApp } from "./core/app";

startApp();
