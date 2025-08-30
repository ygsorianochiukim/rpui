export interface Position {
  position_id: number;
  position: string;
  department: string;
  function: string;
  date_created: string;
  created_by: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface UserAccess {
  emp_i_user_access_id: string;
  s_bpartner_employee_id: number;
  position_id: number;
  date_created: string;
  is_active: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  position: Position | null;
}

export interface User {
  s_bpartner_employee_id: number;
  firstname: string;
  middlename: string;
  lastname: string;
  companyname: string;
  sex: string;
  employee_no: string;
  marital_status: string;
  birthdate: string;
  image_location: string;
  remaining_leave: number;
  created: string;
  date_created: string;
  date_updated: string;
  updated: string;
  is_active: boolean;
  s_bpartner_id: number;
  s_bpartner_employee_group_id: number;
  s_bpartner_employee_id_apprived1st: number;
  s_bpartner_employee_id_apprived2nd: number;
  sss_no: number;
  hdmf_no: number;
  phic_no: number;
  tin_no: number;
  contact_no: number;
  address: string;
  s_bpartner_employee_id_revision: number;
  is_for_approval: string;
  email: string;
  username: string;
  paf_i_company_id: number;
  created_by: number | null;
  OTP: number;
  user_verify: string | null;
  position: Position | null;
}

export interface TeamList {
  team_access_id: number;
  s_bpartner_employee_id: number;
  supervisor_id: number;
  is_active: number;
  created_by: number;
  created_date: string;
  created_at: string;
  updated_at: string;
  name : string,
  user: User;
  user_access: UserAccess;
}