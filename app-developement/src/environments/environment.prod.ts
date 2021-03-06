import { Environment } from "src/app/shared/types/custom.types";

export const environment: Environment = {
  production: true,
  serverWsUrl: window.location.protocol === 'http:' ?
    'ws://' +  window.location.hostname + ':' + window.location.port + '/' :
    'wss://' +  window.location.hostname + ':' + window.location.port + '/',
  serverHttpUrl: window.location.origin,
  serverHostname: window.location.hostname,
};
