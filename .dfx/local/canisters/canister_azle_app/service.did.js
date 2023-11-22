export const idlFactory = ({ IDL }) => {
  const SmartHomeDevice = IDL.Record({
    'id' : IDL.Text,
    'isOn' : IDL.Bool,
    'type' : IDL.Text,
    'updatedAt' : IDL.Opt(IDL.Nat64),
    'brand' : IDL.Text,
  });
  const _AzleResult = IDL.Variant({ 'Ok' : SmartHomeDevice, 'Err' : IDL.Text });
  const _AzleResult_1 = IDL.Variant({
    'Ok' : IDL.Opt(SmartHomeDevice),
    'Err' : IDL.Text,
  });
  const _AzleResult_2 = IDL.Variant({
    'Ok' : IDL.Vec(SmartHomeDevice),
    'Err' : IDL.Text,
  });
  return IDL.Service({
    'addDevice' : IDL.Func([SmartHomeDevice], [_AzleResult], []),
    'deleteDevice' : IDL.Func([IDL.Text], [_AzleResult_1], []),
    'getActiveDevices' : IDL.Func([], [_AzleResult_2], ['query']),
    'getDevice' : IDL.Func([IDL.Text], [_AzleResult], ['query']),
    'getDevices' : IDL.Func([], [_AzleResult_2], ['query']),
    'getDevicesByType' : IDL.Func([IDL.Text], [_AzleResult_2], ['query']),
    'searchDevices' : IDL.Func([IDL.Text], [_AzleResult_2], ['query']),
    'toggleDevice' : IDL.Func([IDL.Text], [_AzleResult], []),
    'turnOffDevice' : IDL.Func([IDL.Text], [_AzleResult], []),
    'turnOnDevice' : IDL.Func([IDL.Text], [_AzleResult], []),
    'updateDevice' : IDL.Func([IDL.Text, SmartHomeDevice], [_AzleResult], []),
  });
};
export const init = ({ IDL }) => { return []; };
