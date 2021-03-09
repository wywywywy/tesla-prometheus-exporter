import fetch, { Response as FetchResponse } from 'node-fetch';
import {
  ChargeState,
  ClimateState,
  DriveState,
  GuiSettings,
  Response,
  Vehicle,
  VehicleConfig,
  VehicleData,
  VehicleState,
} from './types';

const DEFAULT_URI = 'https://owner-api.teslamotors.com/';

export class TeslaAPI {
  private readonly token: string;
  private readonly baseURI: string;

  constructor(token: string, baseURI?: string) {
    this.token = token;
    this.baseURI = baseURI || DEFAULT_URI;
  }

  private fetch(url: string): Promise<FetchResponse> {
    return fetch(`${this.baseURI}${url}`, { headers: { Authorization: `Bearer ${this.token}` } });
  }

  async vehicles(): Promise<Vehicle[]> {
    const response = await this.fetch('/api/1/vehicles');
    const apiResponse: Response<Vehicle[]> = await response.json();
    return apiResponse.response;
  }

  async vehicle(id: number): Promise<Vehicle> {
    const response = await this.fetch(`/api/1/vehicles/${id}/`);
    const apiResponse: Response<Vehicle> = await response.json();
    return apiResponse.response;
  }

  async data(id: number): Promise<VehicleData> {
    const response = await this.fetch(`/api/1/vehicles/${id}/vehicle_data`);
    const apiResponse: Response<VehicleData> = await response.json();
    return apiResponse.response;
  }

  async chargeState(id: number): Promise<ChargeState> {
    const response = await this.fetch(`/api/1/vehicles/${id}/data_request/charge_state`);
    const apiResponse: Response<ChargeState> = await response.json();
    return apiResponse.response;
  }

  async climateState(id: number): Promise<ClimateState> {
    const response = await this.fetch(`/api/1/vehicles/${id}/data_request/climate_state`);
    const apiResponse: Response<ClimateState> = await response.json();
    return apiResponse.response;
  }

  async driveState(id: number): Promise<DriveState> {
    const response = await this.fetch(`/api/1/vehicles/${id}/data_request/drive_state`);
    const apiResponse: Response<DriveState> = await response.json();
    return apiResponse.response;
  }

  async guiSettings(id: number): Promise<GuiSettings> {
    const response = await this.fetch(`/api/1/vehicles/${id}/data_request/gui_settings`);
    const apiResponse: Response<GuiSettings> = await response.json();
    return apiResponse.response;
  }

  async vehicleState(id: number): Promise<VehicleState> {
    const response = await this.fetch(`/api/1/vehicles/${id}/data_request/vehicle_state`);
    const apiResponse: Response<VehicleState> = await response.json();
    return apiResponse.response;
  }

  async vehicleConfig(id: number): Promise<VehicleConfig> {
    const response = await this.fetch(`/api/1/vehicles/${id}/data_request/vehicle_config`);
    const apiResponse: Response<VehicleConfig> = await response.json();
    return apiResponse.response;
  }

  async mobileEnabled(id: number): Promise<boolean> {
    const response = await this.fetch(`/api/1/vehicles/${id}/mobile_enabled`);
    const apiResponse: Response<boolean> = await response.json();
    return apiResponse.response;
  }
}
