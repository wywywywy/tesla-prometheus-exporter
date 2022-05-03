export interface Vehicle {
  id: number;
  vehicle_id: number;
  vin: string;
  display_name: string;
  option_codes: string;
  color: null;
  tokens: string[];
  state: 'online' | 'asleep';
  in_service: boolean;
  id_s: string;
  calendar_enabled: boolean;
  api_version: number;
  backseat_token: null;
  backseat_token_updated_at: null;
}

export interface VehicleConfig {
  seat_type: number;
  trim_badging: string;
  car_special_type: string;
  spoiler_type: string;
  wheel_type: string;
  has_ludicrous_mode: boolean;
  ece_restrictions: boolean;
  rear_seat_type: number;
  charge_port_type: string;
  use_range_badging: boolean;
  car_type: string;
  sun_roof_installed: number;
  can_actuate_trunks: boolean;
  timestamp: number;
  rear_seat_heaters: number;
  third_row_seats: string;
  plg: boolean;
  default_charge_to_max: boolean;
  eu_vehicle: boolean;
  has_air_suspension: boolean;
  rhd: boolean;
  exterior_color: string;
  roof_color: string;
  can_accept_navigation_requests: boolean;
  motorized_charge_port: boolean;
}

export enum CenterDisplayState {
  'Off',
  'Unknown',
  'On, standby or Camp Mode',
  'On, charging screen',
  'On',
  'On, Big charging screen',
  'On, Ready to unlock',
  'Sentry Mode',
  'Dog Mode',
  'Media',
}

export interface VehicleState {
  autopark_style: string;
  df: number;
  pr: number;
  rt: number;
  fp_window: number;
  is_user_present: boolean;
  dr: number;
  ft: number;
  sentry_mode_available: boolean;
  valet_mode: boolean;
  autopark_state_v2: string;
  sun_roof_percent_open: number;
  homelink_nearby: boolean;
  notifications_supported: boolean;
  sentry_mode: boolean;
  locked: boolean;
  parsed_calendar_supported: boolean;
  timestamp: number;
  media_state: { remote_control_enabled: boolean };
  fd_window: number;
  odometer: number;
  remote_start: boolean;
  sun_roof_state: string;
  rp_window: number;
  speed_limit_mode: {
    current_limit_mph: number;
    pin_code_set: boolean;
    active: boolean;
    max_limit_mph: number;
    min_limit_mph: number;
  };
  last_autopark_error: string;
  api_version: number;
  remote_start_supported: boolean;
  car_version: string;
  software_update: {
    install_perc: number;
    download_perc: number;
    version: string;
    expected_duration_sec: number;
    status: string;
  };
  summon_standby_mode_enabled: boolean;
  center_display_state: CenterDisplayState;
  homelink_device_count: number;
  remote_start_enabled: boolean;
  pf: number;
  rd_window: number;
  valet_pin_needed: boolean;
  calendar_supported: boolean;
  smart_summon_available: boolean;
  vehicle_name: null;
}

export interface GuiSettings {
  gui_distance_units: string;
  gui_range_display: string;
  show_range_units: boolean;
  gui_24_hour_time: boolean;
  gui_charge_rate_units: string;
  gui_temperature_units: string;
  timestamp: number;
}

export interface ChargeState {
  battery_range: number;
  scheduled_charging_pending: boolean;
  charge_current_request: number;
  charge_energy_added: number;
  charging_state: string;
  max_range_charge_counter: number;
  user_charge_enable_request: null;
  managed_charging_active: boolean;
  charge_current_request_max: number;
  charge_port_door_open: boolean;
  charge_miles_added_rated: number;
  charger_phases: number;
  charger_power: number;
  scheduled_charging_start_time: null;
  charge_limit_soc: number;
  charge_port_latch: string;
  charge_port_cold_weather_mode: null;
  est_battery_range: number;
  conn_charge_cable: string;
  timestamp: number;
  battery_level: number;
  charge_miles_added_ideal: number;
  charger_actual_current: number;
  charger_pilot_current: number;
  usable_battery_level: number;
  fast_charger_present: boolean;
  not_enough_power_to_heat: boolean;
  fast_charger_type: string;
  managed_charging_start_time: null;
  trip_charging: boolean;
  charge_rate: number;
  charge_limit_soc_max: number;
  fast_charger_brand: string;
  ideal_battery_range: number;
  charge_limit_soc_std: number;
  charger_voltage: number;
  managed_charging_user_canceled: boolean;
  time_to_full_charge: number;
  charge_to_max_range: boolean;
  charge_limit_soc_min: number;
  minutes_to_full_charge: number;
  battery_heater_on: boolean;
  charge_enable_request: boolean;
}

export interface ClimateState {
  climate_keeper_mode: string;
  driver_temp_setting: number;
  battery_heater_no_power: boolean;
  is_auto_conditioning_on: boolean;
  is_climate_on: boolean;
  right_temp_direction: number;
  outside_temp: number;
  left_temp_direction: number;
  min_avail_temp: number;
  passenger_temp_setting: number;
  max_avail_temp: number;
  fan_status: number;
  remote_heater_control_enabled: boolean;
  is_front_defroster_on: boolean;
  wiper_blade_heater: boolean;
  is_rear_defroster_on: boolean;
  defrost_mode: number;
  inside_temp: number;
  side_mirror_heaters: boolean;
  battery_heater: boolean;
  seat_heater_right: number;
  is_preconditioning: boolean;
  seat_heater_left: number;
  timestamp: number;
}

export interface DriveState {
  shift_state: null;
  native_type: string;
  heading: number;
  native_latitude: number;
  native_location_supported: number;
  latitude: number;
  power: number;
  native_longitude: number;
  gps_as_of: number;
  speed: null;
  longitude: number;
  timestamp: number;
}

export interface VehicleData {
  id: number;
  user_id: number;
  vehicle_id: number;
  vin: string;
  display_name: string;
  option_codes: string;
  color: null;
  access_type: string;
  tokens: string[];
  state: 'online' | 'offline';
  in_service: boolean;
  id_s: string;
  calendar_enabled: boolean;
  api_version: number;
  backseat_token: string;
  backseat_token_updated_at: number;
  drive_state: DriveState;
  climate_state: ClimateState;
  charge_state: ChargeState;
  gui_settings: GuiSettings;
  vehicle_state: VehicleState;
  vehicle_config: VehicleConfig;
}

export interface Response<T> {
  response: T;
  count: number;
}

export interface AuthResponse {
  access_token: string,
  refresh_token: string,
  expires_in: number,
  token_type: string,
  error?: string,
  error_description?: string,
}
