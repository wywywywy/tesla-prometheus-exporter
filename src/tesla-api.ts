import fetch, { Response as FetchResponse } from 'node-fetch';
import {
  ChargeState,
  ClimateState,
  DriveState,
  GuiSettings,
  Response,
  AuthResponse,
  Vehicle,
  VehicleConfig,
  VehicleData,
  VehicleState,
} from './types';

const DEFAULT_URI = 'https://owner-api.teslamotors.com/';
const AUTH_URI = 'https://auth.tesla.com/';
const USER_AGENT = 'Tesla-Prometheus-Exporter';
const TOKEN_TIMEOUT_MS = 1000 * 60 * 60 * 24; // 24 hours

export class TeslaAPI {
  private readonly refreshToken: string;
  private readonly baseURI: string;
  private readonly authURI: string;

  accessToken: string;
  lastTokenRefreshDate: Date;

  constructor(refreshToken: string, baseURI?: string, authURI?: string) {
    this.refreshToken = refreshToken;
    this.baseURI = baseURI || DEFAULT_URI;
    this.authURI = authURI || AUTH_URI;
  }

  private fetch(url: string): Promise<FetchResponse> {
    return fetch(`${this.baseURI}${url}`, { headers: { Authorization: `Bearer ${this.accessToken}` } });
  }

  async getAccessToken(): Promise<string> {
    const response = await fetch(`${this.authURI}oauth2/v3/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT,
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: 'ownerapi',
        refresh_token: this.refreshToken,
        scope: 'openid email offline_access',
      }),
    });
    const authResponse: AuthResponse = await response.json();
    if (authResponse.error) {
      throw new Error(authResponse.error_description || authResponse.error);
    }
    return authResponse.access_token;
  }

  async refreshAccessToken(): Promise<void> {
    // Only refresh if token is older than timeout
    if (!this.lastTokenRefreshDate || !this.accessToken || Date.now() - this.lastTokenRefreshDate.getTime() > TOKEN_TIMEOUT_MS) {
      this.accessToken = await this.getAccessToken();
      this.lastTokenRefreshDate = new Date();
    }
  }

  async vehicles(): Promise<Vehicle[]> {
    await this.refreshAccessToken();
    const response = await this.fetch('/api/1/vehicles');
    const apiResponse: Response<Vehicle[]> = await response.json();
    return apiResponse.response;
  }

  async vehicle(id: number): Promise<Vehicle> {
    await this.refreshAccessToken();
    const response = await this.fetch(`/api/1/vehicles/${id}/`);
    const apiResponse: Response<Vehicle> = await response.json();
    return apiResponse.response;
  }

  async data(id: number): Promise<VehicleData> {
    await this.refreshAccessToken();
    const response = await this.fetch(`/api/1/vehicles/${id}/vehicle_data`);
    const apiResponse: Response<VehicleData> = await response.json();
    return apiResponse.response;
  }

  async chargeState(id: number): Promise<ChargeState> {
    await this.refreshAccessToken();
    const response = await this.fetch(`/api/1/vehicles/${id}/data_request/charge_state`);
    const apiResponse: Response<ChargeState> = await response.json();
    return apiResponse.response;
  }

  async climateState(id: number): Promise<ClimateState> {
    await this.refreshAccessToken();
    const response = await this.fetch(`/api/1/vehicles/${id}/data_request/climate_state`);
    const apiResponse: Response<ClimateState> = await response.json();
    return apiResponse.response;
  }

  async driveState(id: number): Promise<DriveState> {
    await this.refreshAccessToken();
    const response = await this.fetch(`/api/1/vehicles/${id}/data_request/drive_state`);
    const apiResponse: Response<DriveState> = await response.json();
    return apiResponse.response;
  }

  async guiSettings(id: number): Promise<GuiSettings> {
    await this.refreshAccessToken();
    const response = await this.fetch(`/api/1/vehicles/${id}/data_request/gui_settings`);
    const apiResponse: Response<GuiSettings> = await response.json();
    return apiResponse.response;
  }

  async vehicleState(id: number): Promise<VehicleState> {
    await this.refreshAccessToken();
    const response = await this.fetch(`/api/1/vehicles/${id}/data_request/vehicle_state`);
    const apiResponse: Response<VehicleState> = await response.json();
    return apiResponse.response;
  }

  async vehicleConfig(id: number): Promise<VehicleConfig> {
    await this.refreshAccessToken();
    const response = await this.fetch(`/api/1/vehicles/${id}/data_request/vehicle_config`);
    const apiResponse: Response<VehicleConfig> = await response.json();
    return apiResponse.response;
  }

  async mobileEnabled(id: number): Promise<boolean> {
    await this.refreshAccessToken();
    const response = await this.fetch(`/api/1/vehicles/${id}/mobile_enabled`);
    const apiResponse: Response<boolean> = await response.json();
    return apiResponse.response;
  }
}
