export interface NodeQuries {
  page?: number;
  size?: number;
  ret_count?: boolean;
  free_mru?: number;
  free_hru?: number;
  free_sru?: number;
  free_ips?: number;
  status?: string;
  city?: string;
  country?: string;
  farm_name?: string;
  ipv4?: boolean;
  ipv6?: boolean;
  domain?: boolean;
  farm_ids?: string;
}

export interface FarmQuries {
  page?: number;
  size?: number;
  ret_count?: boolean;
  free_ips?: number;
  total_ips?: number;
  pricing_policy_id?: number;
  version?: number;
  farm_id?: number;
  twin_id?: number;
  name?: string;
  name_contains?: string;
  certification_type?: string;
  stellar_address?: string;
}
