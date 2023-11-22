import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Device {
  'id' : string,
  'status' : string,
  'name' : string,
  'createdBy' : Principal,
  'room' : string,
  'type' : string,
}
export interface SmartHomeTask {
  'id' : string,
  'status' : string,
  'title' : string,
  'updatedDate' : [] | [bigint],
  'assignedTo' : string,
  'tags' : Array<string>,
  'createdDate' : bigint,
  'dueDate' : string,
  'description' : string,
  'priority' : string,
  'comments' : Array<string>,
  'devices' : Array<Device>,
}
export interface SmartHomeTaskPayload {
  'title' : string,
  'assignedTo' : string,
  'tags' : Array<string>,
  'dueDate' : string,
  'description' : string,
  'devices' : Array<Device>,
}
export type _AzleResult = { 'Ok' : SmartHomeTask } |
  { 'Err' : string };
export type _AzleResult_1 = { 'Ok' : Array<SmartHomeTask> } |
  { 'Err' : string };
export type _AzleResult_2 = { 'Ok' : string } |
  { 'Err' : string };
export interface _SERVICE {
  'addSmartHomeTask' : ActorMethod<[SmartHomeTaskPayload], _AzleResult>,
  'addSmartHomeTaskComment' : ActorMethod<[string, string], _AzleResult>,
  'addSmartHomeTaskTags' : ActorMethod<[string, Array<string>], _AzleResult>,
  'assignDeviceToSmartHomeTask' : ActorMethod<[string, Device], _AzleResult>,
  'changeSmartHomeTaskStatus' : ActorMethod<[string, string], _AzleResult>,
  'deleteSmartHomeTask' : ActorMethod<[string], _AzleResult>,
  'getInitialSmartHomeTasks' : ActorMethod<[], _AzleResult_1>,
  'getOverdueSmartHomeTasks' : ActorMethod<[], _AzleResult_1>,
  'getSmartHomeTask' : ActorMethod<[string], _AzleResult>,
  'getSmartHomeTasksByCreator' : ActorMethod<[Principal], _AzleResult_1>,
  'getSmartHomeTasksByStatus' : ActorMethod<[string], _AzleResult_1>,
  'getSmartHomeTasksByTags' : ActorMethod<[string], _AzleResult_1>,
  'loadMoreSmartHomeTasks' : ActorMethod<[number, number], _AzleResult_1>,
  'searchSmartHomeTasks' : ActorMethod<[string], _AzleResult_1>,
  'sendSmartHomeTaskDueDateReminder' : ActorMethod<[string], _AzleResult_2>,
  'setSmartHomeTaskPriority' : ActorMethod<[string, string], _AzleResult>,
  'updateSmartHomeTask' : ActorMethod<
    [string, SmartHomeTaskPayload],
    _AzleResult
  >,
}
