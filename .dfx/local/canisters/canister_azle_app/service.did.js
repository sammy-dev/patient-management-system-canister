export const idlFactory = ({ IDL }) => {
  const Patient = IDL.Record({
    'id' : IDL.Text,
    'age' : IDL.Float64,
    'admittedAt' : IDL.Opt(IDL.Nat64),
    'name' : IDL.Text,
    'gender' : IDL.Text,
    'dischargedAt' : IDL.Opt(IDL.Nat64),
    'isAdmitted' : IDL.Bool,
  });
  const _AzleResult = IDL.Variant({ 'Ok' : Patient, 'Err' : IDL.Text });
  const _AzleResult_1 = IDL.Variant({
    'Ok' : IDL.Opt(Patient),
    'Err' : IDL.Text,
  });
  const _AzleResult_2 = IDL.Variant({
    'Ok' : IDL.Vec(Patient),
    'Err' : IDL.Text,
  });
  return IDL.Service({
    'addPatient' : IDL.Func([Patient], [_AzleResult], []),
    'admitPatient' : IDL.Func([IDL.Text], [_AzleResult], []),
    'deletePatient' : IDL.Func([IDL.Text], [_AzleResult_1], []),
    'dischargePatient' : IDL.Func([IDL.Text], [_AzleResult], []),
    'getPatient' : IDL.Func([IDL.Text], [_AzleResult], ['query']),
    'getPatients' : IDL.Func([], [_AzleResult_2], ['query']),
    'searchPatients' : IDL.Func([IDL.Text], [_AzleResult_2], ['query']),
    'updatePatient' : IDL.Func([IDL.Text, Patient], [_AzleResult], []),
  });
};
export const init = ({ IDL }) => { return []; };
