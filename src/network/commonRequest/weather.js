import { request } from "./request";
import { APIs } from "@/api/API.js";
export function getWeatherInfo(){
  return request({
    url:APIs.weatherAPI
  })
}