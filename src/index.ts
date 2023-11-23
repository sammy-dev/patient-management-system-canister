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
    medicalRecords: Vec<MedicalRecord>;
}>;

type MedicalRecord = Record<{
    id: string;
    patientId: string;
    diagnosis: string;
    treatment: string;
    date: nat64;
}>;

const patientStorage = new StableBTreeMap<string, Patient>(0, 44, 1024);

/**
 * Searches for patients based on a query string.
 *
 * @param {string} query - The query string to search for in patient names.
 * @returns {Result<Vec<Patient>, string>} - A Result containing the filtered list of patients or an error message.
 */
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

/**
 * Admits a patient identified by the given ID.
 *
 * @param {string} id - The ID of the patient to be admitted.
 * @returns {Result<Patient, string>} - A Result containing the admitted patient or an error message.
 */
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

/**
 * Discharges a currently admitted patient identified by the given ID.
 *
 * @param {string} id - The ID of the patient to be discharged.
 * @returns {Result<Patient, string>} - A Result containing the discharged patient or an error message.
 */
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

/**
 * Adds a new patient to the system.
 *
 * @param {Patient} patient - The patient object to be added.
 * @returns {Result<Patient, string>} - A Result containing the added patient or an error message.
 */
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

/**
 * Updates the information of an existing patient identified by the given ID.
 *
 * @param {string} id - The ID of the patient to be updated.
 * @param {Patient} patient - The updated patient object.
 * @returns {Result<Patient, string>} - A Result containing the updated patient or an error message.
 */
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

/**
 * Adds a medical record to the patient's records.
 *
 * @param {string} patientId - The ID of the patient.
 * @param {MedicalRecord} medicalRecord - The medical record to be added.
 * @returns {Result<Patient, string>} - A Result containing the patient with the updated records or an error message.
 */
$update
export function addMedicalRecord(patientId: string, medicalRecord: MedicalRecord): Result<Patient, string> {
    return match(patientStorage.get(patientId), {
        Some: (patient) => {
            // Add the medical record to the patient's records
            const updatedPatient: Patient = {
                ...patient,
                medicalRecords: [...patient.medicalRecords, medicalRecord],
            };

            // Update the patient in patientStorage
            patientStorage.insert(patientId, updatedPatient);

            return Result.Ok(updatedPatient);
        },
        None: () => Result.Err<Patient, string>(`Patient with id=${patientId} does not exist`),
    }) as Result<Patient, string>;
}

/**
 * Updates a medical record for a patient identified by the given IDs.
 *
 * @param {string} patientId - The ID of the patient.
 * @param {string} medicalRecordId - The ID of the medical record to be updated.
 * @param {MedicalRecord} updatedMedicalRecord - The updated medical record.
 * @returns {Result<Patient, string>} - A Result containing the patient with the updated records or an error message.
 */
$update
export function updateMedicalRecord(patientId: string, medicalRecordId: string, updatedMedicalRecord: MedicalRecord): Result<Patient, string> {
    return match(patientStorage.get(patientId), {
        Some: (patient) => {
            // Find the index of the medical record to update
            const recordIndex = patient.medicalRecords.findIndex(record => record.id === medicalRecordId);

            // Check if the medical record exists
            if (recordIndex !== -1) {
                // Create a new array with the updated medical record
                const updatedMedicalRecords = [
                    ...patient.medicalRecords.slice(0, recordIndex),
                    updatedMedicalRecord,
                    ...patient.medicalRecords.slice(recordIndex + 1),
                ];

                // Update the patient in patientStorage
                const updatedPatient: Patient = {
                    ...patient,
                    medicalRecords: updatedMedicalRecords,
                };
                patientStorage.insert(patientId, updatedPatient);

                return Result.Ok(updatedPatient);
            } else {
                return Result.Err<Patient, string>(`Medical record with id=${medicalRecordId} not found for patient with id=${patientId}`);
            }
        },
        None: () => Result.Err<Patient, string>(`Patient with id=${patientId} does not exist`),
    }) as Result<Patient, string>;
}

/**
 * Deletes a medical record for a patient identified by the given IDs.
 *
 * @param {string} patientId - The ID of the patient.
 * @param {string} medicalRecordId - The ID of the medical record to be deleted.
 * @returns {Result<Patient, string>} - A Result containing the patient with the updated records or an error message.
 */
$update
export function deleteMedicalRecord(patientId: string, medicalRecordId: string): Result<Patient, string> {
    return match(patientStorage.get(patientId), {
        Some: (patient) => {
            // Find the index of the medical record to delete
            const recordIndex = patient.medicalRecords.findIndex(record => record.id === medicalRecordId);

            // Check if the medical record exists
            if (recordIndex !== -1) {
                // Remove the medical record from the array
                const updatedMedicalRecords = [...patient.medicalRecords.slice(0, recordIndex), ...patient.medicalRecords.slice(recordIndex + 1)];

                // Update the patient in patientStorage
                const updatedPatient: Patient = {
                    ...patient,
                    medicalRecords: updatedMedicalRecords,
                };
                patientStorage.insert(patientId, updatedPatient);

                return Result.Ok(updatedPatient);
            } else {
                return Result.Err<Patient, string>(`Medical record with id=${medicalRecordId} not found for patient with id=${patientId}`);
            }
        },
        None: () => Result.Err<Patient, string>(`Patient with id=${patientId} does not exist`),
    }) as Result<Patient, string>;
}

/**
 * Retrieves a list of all patients in the system.
 *
 * @returns {Result<Vec<Patient>, string>} - A Result containing the list of patients or an error message.
 */
$query
export function getPatients(): Result<Vec<Patient>, string> {
    try {
        const patients = patientStorage.values();
        return Result.Ok(patients);
    } catch (error) {
        return Result.Err(`Error getting patients: ${error}`);
    }
}

/**
 * Retrieves a patient by the given ID.
 *
 * @param {string} id - The ID of the patient to be retrieved.
 * @returns {Result<Patient, string>} - A Result containing the retrieved patient or an error message.
 */
$query
export function getPatient(id: string): Result<Patient, string> {
    return match(patientStorage.get(id), {
        Some: (patient) => Result.Ok<Patient, string>(patient),
        None: () => Result.Err<Patient, string>(`Patient with id=${id} not found`),
    }) as Result<Patient, string>;
}

/**
 * Deletes a patient identified by the given ID.
 *
 * @param {string} id - The ID of the patient to be deleted.
 * @returns {Result<Opt<Patient>, string>} - A Result containing the deleted patient or an error message.
 */
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

/**
 * Validates if the given string is a valid UUID.
 *
 * @param {string} id - The string to be validated as a UUID.
 * @returns {boolean} - True if the string is a valid UUID, false otherwise.
 */
export function isValidUUID(id: string): boolean {
    return /^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}$/i.test(id);
}

// Correct TypeScript declaration for the crypto object
declare global {
    namespace NodeJS {
        interface Global {
            crypto: {
                getRandomValues: (array: Uint8Array) => Uint8Array;
            };
        }
    }
}

// A workaround to make the uuid package work with Azle
globalThis.crypto = {
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    },
};
