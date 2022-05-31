export interface IGame {
  id?: number;
  name?: string;
  date?: string;
  visitor_id?: number; // id команды из таблицы teams
  host_id?: number; // id команды из таблицы teams
  visitor_innings?: string;
  host_innings?: string;
  visitor_sum_runs?: number;
  host_sum_runs?: number;
}
