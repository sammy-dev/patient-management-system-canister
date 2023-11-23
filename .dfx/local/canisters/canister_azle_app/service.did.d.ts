import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Patient {
  'id' : string,
  'age' : number,
  'admittedAt' : [] | [bigint],
  'name' : string,
  'gender' : string,
  'dischargedAt' : [] | [bigint],
  'isAdmitted' : boolean,
}
export type _AzleResult = { 'Ok' : Patient } |
  { 'Err' : string };
export type _AzleResult_1 = { 'Ok' : [] | [Patient] } |
  { 'Err' : string };
export type _AzleResult_2 = { 'Ok' : Array<Patient> } |
  { 'Err' : string };
export interface _SERVICE {
  'addPatient' : ActorMethod<[Patient], _AzleResult>,
  'admitPatient' : ActorMethod<[string], _AzleResult>,
  'deletePatient' : ActorMethod<[string], _AzleResult_1>,
  'dischargePatient' : ActorMethod<[string], _AzleResult>,
  'getPatient' : ActorMethod<[string], _AzleResult>,
  'getPatients' : ActorMethod<[], _AzleResult_2>,
  'searchPatients' : ActorMethod<[string], _AzleResult_2>,
  'updatePatient' : ActorMethod<[string, Patient], _AzleResult>,
}
