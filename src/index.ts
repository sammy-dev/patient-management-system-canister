import {
    $query,
    $update,
    Record,
    StableBTreeMap,
    Vec,
    match,
    Result,
    nat64,
    ic,
    Opt,
} from 'azle';
import { v4 as uuidv4 } from 'uuid';

type Patient = Record<{
    id: string;
    name: string;
    age: number;
    gender: string;
    admittedAt: Opt<nat64>;
    dischargedAt: Opt<nat64>;
    isAdmitted: boolean;
}>;

const patientStorage = new StableBTreeMap<string, Patient>(0, 44, 1024);

$query
export function searchPatients(query: string): Result<Vec<Patient>, string> {
    try {
        const lowerCaseQuery = query.toLowerCase();
        const filteredPatients = patientStorage.values().filter(
            (patient) =>
                patient.name.toLowerCase().includes(lowerCaseQuery)
        );
        return Result.Ok(filteredPatients);
    } catch (error) {
        return Result.Err(`Error searching for patients: ${error}`);
    }
}

$update
export function admitPatient(id: string): Result<Patient, string> {
    return match(patientStorage.get(id), {
        Some: (patient) => {
            if (patient.isAdmitted) {
                return Result.Err<Patient, string>(`Patient with id=${id} is already admitted`);
            }

            const newPatient: Patient = { ...patient, isAdmitted: true, admittedAt: Opt.Some(ic.time()) };
            patientStorage.insert(id, newPatient);

            return Result.Ok(newPatient);
        },
        None: () => Result.Err<Patient, string>(`Patient with id=${id} not found`),
    }) as Result<Patient, string>;
}

$update
export function dischargePatient(id: string): Result<Patient, string> {
    return match(patientStorage.get(id), {
        Some: (patient) => {
            if (!patient.isAdmitted) {
                return Result.Err<Patient, string>(`Patient with id=${id} is not currently admitted`);
            }

            const newPatient: Patient = { ...patient, isAdmitted: false, dischargedAt: Opt.Some(ic.time()) };
            patientStorage.insert(id, newPatient);

            return Result.Ok(newPatient);
        },
        None: () => Result.Err<Patient, string>(`Patient with id=${id} not found`),
    }) as Result<Patient, string>;
}

$update
export function addPatient(patient: Patient): Result<Patient, string> {
    try {
        // Generate a unique ID for the patient
        patient.id = uuidv4();
        // Initialize isAdmitted to false when adding a new patient
        patient.isAdmitted = false;

        // Validate the patient object
        if (!patient.name || !patient.age || !patient.gender) {
            return Result.Err('Missing required fields in the patient object');
        }

        // Add the patient to patientStorage
        patientStorage.insert(patient.id, patient);

        return Result.Ok(patient);
    } catch (error) {
        return Result.Err(`Error adding patient: ${error}`);
    }
}

$update
export function updatePatient(id: string, patient: Patient): Result<Patient, string> {
    return match(patientStorage.get(id), {
        Some: (existingPatient) => {
            // Validate the updated patient object
            if (!patient.name || !patient.age || !patient.gender) {
                return Result.Err('Missing required fields in the patient object');
            }

            // Create a new patient object with the updated fields
            const updatedPatient: Patient = {
                ...existingPatient,
                ...patient,
            };

            // Update the patient in patientStorage
            patientStorage.insert(id, updatedPatient);

            return Result.Ok(updatedPatient);
        },
        None: () => Result.Err<Patient, string>(`Patient with id=${id} does not exist`),
    }) as Result<Patient, string>;
}

$query
export function getPatients(): Result<Vec<Patient>, string> {
    try {
        const patients = patientStorage.values();
        return Result.Ok(patients);
    } catch (error) {
        return Result.Err(`Error getting patients: ${error}`);
    }
}

$query
export function getPatient(id: string): Result<Patient, string> {
    return match(patientStorage.get(id), {
        Some: (patient) => Result.Ok<Patient, string>(patient),
        None: () => Result.Err<Patient, string>(`Patient with id=${id} not found`),
    }) as Result<Patient, string>;
}

$update
export function deletePatient(id: string): Result<Opt<Patient>, string> {
    try {
        // Validate the id parameter
        if (!isValidUUID(id)) {
            return Result.Err('Invalid patient ID');
        }

        // Delete the patient from patientStorage
        const deletedPatient = patientStorage.remove(id);
        if (!deletedPatient) {
            return Result.Err(`Patient with ID ${id} does not exist`);
        }

        return Result.Ok(deletedPatient);
    } catch (error) {
        return Result.Err(`Error deleting patient: ${error}`);
    }
}

export function isValidUUID(id: string): boolean {
    return /^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}$/i.test(id);
}

// A workaround to make the uuid package work with Azle
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    },
};
