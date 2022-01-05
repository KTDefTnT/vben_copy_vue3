interface ListState {
  name: string;
  type: string;
}
export interface OrganState {
  organId: string;
  organName: string;
  type: string;
  weekday: string[];
  time: string;
  phone: string;
  address: string;
  isChecked: boolean;
  isFree: boolean;
  list: ListState[];
  distance: string;
}
