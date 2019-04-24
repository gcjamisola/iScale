import axios from "axios";

export const api = () => {
  const instance = axios.create();

  return instance;
};
