export const idlFactory = ({ IDL }) => {
  const Task = IDL.Record({
    'id' : IDL.Text,
    'status' : IDL.Text,
    'title' : IDL.Text,
    'updated_at' : IDL.Opt(IDL.Nat64),
    'creator' : IDL.Principal,
    'tags' : IDL.Vec(IDL.Text),
    'description' : IDL.Text,
    'assigned_to' : IDL.Text,
    'due_date' : IDL.Text,
    'priority' : IDL.Text,
    'comments' : IDL.Vec(IDL.Text),
    'created_date' : IDL.Nat64,
  });
  const _AzleResult = IDL.Variant({ 'Ok' : Task, 'Err' : IDL.Text });
  const TaskPayload = IDL.Record({
    'title' : IDL.Text,
    'description' : IDL.Text,
    'assigned_to' : IDL.Text,
    'due_date' : IDL.Text,
  });
  const _AzleResult_1 = IDL.Variant({ 'Ok' : IDL.Vec(Task), 'Err' : IDL.Text });
  const _AzleResult_2 = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  return IDL.Service({
    'addTags' : IDL.Func([IDL.Text, IDL.Vec(IDL.Text)], [_AzleResult], []),
    'addTask' : IDL.Func([TaskPayload], [_AzleResult], []),
    'addTaskComment' : IDL.Func([IDL.Text, IDL.Text], [_AzleResult], []),
    'assignTask' : IDL.Func([IDL.Text, IDL.Text], [_AzleResult], []),
    'changeTaskStatus' : IDL.Func([IDL.Text, IDL.Text], [_AzleResult], []),
    'completedTask' : IDL.Func([IDL.Text], [_AzleResult], []),
    'deleteTask' : IDL.Func([IDL.Text], [_AzleResult], []),
    'getInitialTasks' : IDL.Func([], [_AzleResult_1], ['query']),
    'getOverdueTasks' : IDL.Func([], [_AzleResult_1], ['query']),
    'getTask' : IDL.Func([IDL.Text], [_AzleResult], ['query']),
    'getTaskByTags' : IDL.Func([IDL.Text], [_AzleResult_1], ['query']),
    'getTasksByCreator' : IDL.Func([IDL.Principal], [_AzleResult_1], ['query']),
    'getTasksByStatus' : IDL.Func([IDL.Text], [_AzleResult_1], ['query']),
    'loadMoreTasks' : IDL.Func(
        [IDL.Float64, IDL.Float64],
        [_AzleResult_1],
        ['query'],
      ),
    'searchTasks' : IDL.Func([IDL.Text], [_AzleResult_1], ['query']),
    'sendDueDateReminder' : IDL.Func([IDL.Text], [_AzleResult_2], []),
    'setTaskPriority' : IDL.Func([IDL.Text, IDL.Text], [_AzleResult], []),
    'updateTask' : IDL.Func([IDL.Text, TaskPayload], [_AzleResult], []),
  });
};
export const init = ({ IDL }) => { return []; };
