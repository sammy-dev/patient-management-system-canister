export const idlFactory = ({ IDL }) => {
  const Device = IDL.Record({
    'id' : IDL.Text,
    'status' : IDL.Text,
    'name' : IDL.Text,
    'createdBy' : IDL.Principal,
    'room' : IDL.Text,
    'type' : IDL.Text,
  });
  const SmartHomeTaskPayload = IDL.Record({
    'title' : IDL.Text,
    'assignedTo' : IDL.Text,
    'tags' : IDL.Vec(IDL.Text),
    'dueDate' : IDL.Text,
    'description' : IDL.Text,
    'devices' : IDL.Vec(Device),
  });
  const SmartHomeTask = IDL.Record({
    'id' : IDL.Text,
    'status' : IDL.Text,
    'title' : IDL.Text,
    'updatedDate' : IDL.Opt(IDL.Nat64),
    'assignedTo' : IDL.Text,
    'tags' : IDL.Vec(IDL.Text),
    'createdDate' : IDL.Nat64,
    'dueDate' : IDL.Text,
    'description' : IDL.Text,
    'priority' : IDL.Text,
    'comments' : IDL.Vec(IDL.Text),
    'devices' : IDL.Vec(Device),
  });
  const _AzleResult = IDL.Variant({ 'Ok' : SmartHomeTask, 'Err' : IDL.Text });
  const _AzleResult_1 = IDL.Variant({
    'Ok' : IDL.Vec(SmartHomeTask),
    'Err' : IDL.Text,
  });
  const _AzleResult_2 = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  return IDL.Service({
    'addSmartHomeTask' : IDL.Func([SmartHomeTaskPayload], [_AzleResult], []),
    'addSmartHomeTaskComment' : IDL.Func(
        [IDL.Text, IDL.Text],
        [_AzleResult],
        [],
      ),
    'addSmartHomeTaskTags' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Text)],
        [_AzleResult],
        [],
      ),
    'assignDeviceToSmartHomeTask' : IDL.Func(
        [IDL.Text, Device],
        [_AzleResult],
        [],
      ),
    'changeSmartHomeTaskStatus' : IDL.Func(
        [IDL.Text, IDL.Text],
        [_AzleResult],
        [],
      ),
    'deleteSmartHomeTask' : IDL.Func([IDL.Text], [_AzleResult], []),
    'getInitialSmartHomeTasks' : IDL.Func([], [_AzleResult_1], ['query']),
    'getOverdueSmartHomeTasks' : IDL.Func([], [_AzleResult_1], ['query']),
    'getSmartHomeTask' : IDL.Func([IDL.Text], [_AzleResult], ['query']),
    'getSmartHomeTasksByCreator' : IDL.Func(
        [IDL.Principal],
        [_AzleResult_1],
        ['query'],
      ),
    'getSmartHomeTasksByStatus' : IDL.Func(
        [IDL.Text],
        [_AzleResult_1],
        ['query'],
      ),
    'getSmartHomeTasksByTags' : IDL.Func(
        [IDL.Text],
        [_AzleResult_1],
        ['query'],
      ),
    'loadMoreSmartHomeTasks' : IDL.Func(
        [IDL.Float64, IDL.Float64],
        [_AzleResult_1],
        ['query'],
      ),
    'searchSmartHomeTasks' : IDL.Func([IDL.Text], [_AzleResult_1], ['query']),
    'sendSmartHomeTaskDueDateReminder' : IDL.Func(
        [IDL.Text],
        [_AzleResult_2],
        [],
      ),
    'setSmartHomeTaskPriority' : IDL.Func(
        [IDL.Text, IDL.Text],
        [_AzleResult],
        [],
      ),
    'updateSmartHomeTask' : IDL.Func(
        [IDL.Text, SmartHomeTaskPayload],
        [_AzleResult],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
