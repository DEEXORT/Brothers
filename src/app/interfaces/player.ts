import {IStat} from './stats';

export interface IPlayer {
  id?: number;
  name?: string;
  bat?: any;
  throw?: string;
  photo?: any;
  game_number?: string;
}

export interface IPlayerExt extends IPlayer, IStat {

}
