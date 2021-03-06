import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AppEnvironmentService {
  constructor() {}

  isServerOnLocalhost() {
    return environment.serverHostname === "localhost";
  }
}
