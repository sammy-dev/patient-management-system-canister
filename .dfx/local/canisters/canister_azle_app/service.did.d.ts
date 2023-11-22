import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface SmartHomeDevice {
  'id' : string,
  'isOn' : boolean,
  'type' : string,
  'updatedAt' : [] | [bigint],
  'brand' : string,
}
export type _AzleResult = { 'Ok' : SmartHomeDevice } |
  { 'Err' : string };
export type _AzleResult_1 = { 'Ok' : [] | [SmartHomeDevice] } |
  { 'Err' : string };
export type _AzleResult_2 = { 'Ok' : Array<SmartHomeDevice> } |
  { 'Err' : string };
export interface _SERVICE {
  'addDevice' : ActorMethod<[SmartHomeDevice], _AzleResult>,
  'deleteDevice' : ActorMethod<[string], _AzleResult_1>,
  'getActiveDevices' : ActorMethod<[], _AzleResult_2>,
  'getDevice' : ActorMethod<[string], _AzleResult>,
  'getDevices' : ActorMethod<[], _AzleResult_2>,
  'getDevicesByType' : ActorMethod<[string], _AzleResult_2>,
  'searchDevices' : ActorMethod<[string], _AzleResult_2>,
  'toggleDevice' : ActorMethod<[string], _AzleResult>,
  'turnOffDevice' : ActorMethod<[string], _AzleResult>,
  'turnOnDevice' : ActorMethod<[string], _AzleResult>,
  'updateDevice' : ActorMethod<[string, SmartHomeDevice], _AzleResult>,
}
