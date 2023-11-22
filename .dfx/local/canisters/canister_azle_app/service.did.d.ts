import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Task {
  'id' : string,
  'status' : string,
  'title' : string,
  'updated_at' : [] | [bigint],
  'creator' : Principal,
  'tags' : Array<string>,
  'description' : string,
  'assigned_to' : string,
  'due_date' : string,
  'priority' : string,
  'comments' : Array<string>,
  'created_date' : bigint,
}
export interface TaskPayload {
  'title' : string,
  'description' : string,
  'assigned_to' : string,
  'due_date' : string,
}
export type _AzleResult = { 'Ok' : Task } |
  { 'Err' : string };
export type _AzleResult_1 = { 'Ok' : Array<Task> } |
  { 'Err' : string };
export type _AzleResult_2 = { 'Ok' : string } |
  { 'Err' : string };
export interface _SERVICE {
  'addTags' : ActorMethod<[string, Array<string>], _AzleResult>,
  'addTask' : ActorMethod<[TaskPayload], _AzleResult>,
  'addTaskComment' : ActorMethod<[string, string], _AzleResult>,
  'assignTask' : ActorMethod<[string, string], _AzleResult>,
  'changeTaskStatus' : ActorMethod<[string, string], _AzleResult>,
  'completedTask' : ActorMethod<[string], _AzleResult>,
  'deleteTask' : ActorMethod<[string], _AzleResult>,
  'getInitialTasks' : ActorMethod<[], _AzleResult_1>,
  'getOverdueTasks' : ActorMethod<[], _AzleResult_1>,
  'getTask' : ActorMethod<[string], _AzleResult>,
  'getTaskByTags' : ActorMethod<[string], _AzleResult_1>,
  'getTasksByCreator' : ActorMethod<[Principal], _AzleResult_1>,
  'getTasksByStatus' : ActorMethod<[string], _AzleResult_1>,
  'loadMoreTasks' : ActorMethod<[number, number], _AzleResult_1>,
  'searchTasks' : ActorMethod<[string], _AzleResult_1>,
  'sendDueDateReminder' : ActorMethod<[string], _AzleResult_2>,
  'setTaskPriority' : ActorMethod<[string, string], _AzleResult>,
  'updateTask' : ActorMethod<[string, TaskPayload], _AzleResult>,
}
