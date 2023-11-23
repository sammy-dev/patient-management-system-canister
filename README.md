# Patient Management System Canister

This document provides comprehensive documentation for the Patient Management System Canister, a repository containing the source code for a patient management system canister on the Internet Computer (IC).

## Table of Contents

- [Functionality](#functionality)
  - [Patient Management](#patient-management)
  - [Helper Functions](#helper-functions)
  - [UUID Package Workaround](#uuid-package-workaround)
- [Deployment on Local Machine](#deployment-on-local-machine)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [GitHub Repository](#github-repository)

## Functionality

The Patient Management System Canister offers a range of functionalities related to managing patient records. These include searching, admitting, discharging, adding, updating, and deleting patients.

### Patient Management

- **Search Patients (`searchPatients`):** This function allows users to search for patients based on a given query. It returns a list of patients matching the query.
  
- **Admit Patient (`admitPatient`):** Admits a patient to the system. It checks if the patient is already admitted and, if not, updates the patient's status, marking the admission time.

- **Discharge Patient (`dischargePatient`):** Discharges a patient from the system. It verifies if the patient is currently admitted and, if so, updates the patient's status and records the discharge time.

- **Add Patient (`addPatient`):** Adds a new patient to the system. This function generates a unique ID for the patient, initializes admission status to false, validates the patient object, and adds it to the patient storage.

- **Update Patient (`updatePatient`):** Updates information about an existing patient. It validates the updated patient object, creates a new patient object with the updated fields, and updates the patient in the storage.

- **Add Medical Record (`addMedicalRecord`):** Adds a medical record to a patient's records. It associates the medical record with the patient and updates the patient in the storage.

- **Update Medical Record (`updateMedicalRecord`):** Updates information about an existing medical record for a patient. It validates the updated medical record object, finds the corresponding record, creates a new array with the updated record, and updates the patient in the storage.

- **Delete Medical Record (`deleteMedicalRecord`):** Deletes a medical record from a patient's records. It finds the corresponding record, removes it from the array, and updates the patient in the storage.

- **Get Patients (`getPatients`):** Retrieves information about all patients in the system. It returns a list of patient records.

- **Get Patient (`getPatient`):** Retrieves information about a specific patient based on the provided patient ID.

- **Delete Patient (`deletePatient`):** Deletes a patient from the system. It validates the patient ID, removes the patient from the storage, and returns the deleted patient record.

### Helper Functions

- **isValidUUID(`isValidUUID`):** This helper function validates whether a given string is a valid UUID.

### UUID Package Workaround

- A workaround is implemented to make the UUID package work with Azle by providing a global implementation of the `crypto` object.

## Deployment on Local Machine

To deploy the Patient Management System Canister locally, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/sirmwilu/patient-management-system-canister.git
   cd patient-management-system-canister
   ```
2. **Start the Canister:**
   ```bash
   dfx start
   ```
3. **Build the Canister:**
   ```bash
   dfx build
   ```

4. **Deploy the Canister:**
   ```bash
   dfx deploy
   ```

5. **Use the Generated Canister Identifier:**
   The deployment process will provide you with a canister identifier. Use this identifier to interact with the deployed canister.

For additional deployment options and configurations, refer to the [Internet Computer SDK documentation](https://sdk.dfinity.org/docs/quickstart/local-quickstart.html).

## Testing

To run tests, use the following command:

```bash
cargo test
```

## Contributing

Feel free to contribute to the project by submitting issues or pull requests. Follow the standard GitHub flow for contributing.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## GitHub Repository

[GitHub Repository](https://github.com/sirmwilu/patient-management-system-canister.git)
