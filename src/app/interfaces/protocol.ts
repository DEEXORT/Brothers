import {IGame} from './game';

export interface IProtocol {
  id?: number;
  game_id?: number;
  name?: string;
}

export interface IProtocolExt extends IProtocol, IGame {

}

