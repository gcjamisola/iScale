import { api } from "./";
import axios from "axios";

export const getOptins = query => api().get("/api/reports/optins.json", query);

export const getRecipients = query =>
  api().get("/api/reports/recipients.json", query);
