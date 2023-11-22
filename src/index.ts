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

type SmartHomeDevice = Record<{
  isOn: boolean;
  id: string;
  type: string;
  brand: string;
  updatedAt: Opt<nat64>;
}>;

const deviceStorage = new StableBTreeMap<string, SmartHomeDevice>(0, 44, 1024);

$query
export function searchDevices(query: string): Result<Vec<SmartHomeDevice>, string> {
  try {
      const lowerCaseQuery = query.toLowerCase();
      const filteredDevices = deviceStorage.values().filter(
          (device) =>
              device.brand.toLowerCase().includes(lowerCaseQuery) ||
              device.type.toLowerCase().includes(lowerCaseQuery)
      );
      return Result.Ok(filteredDevices);
  } catch (error) {
      return Result.Err(`Error searching for a device: ${error}`);
  }
}

$query
export function getDevices(): Result<Vec<SmartHomeDevice>, string> {
  try {
      const devices = deviceStorage.values();
      return Result.Ok(devices);
  } catch (error) {
      return Result.Err(`Error getting devices: ${error}`);
  }
}

$query
export function getDevice(id: string): Result<SmartHomeDevice, string> {
  return match(deviceStorage.get(id), {
      Some: (device) => Result.Ok<SmartHomeDevice, string>(device),
      None: () => Result.Err<SmartHomeDevice, string>(`Device with id=${id} not found`),
  }) as Result<SmartHomeDevice, string>;
}

$query
export function getDevicesByType(deviceType: string): Result<Vec<SmartHomeDevice>, string> {
  try {
      const devicesByType = deviceStorage
          .values()
          .filter((device) => device.type.toLowerCase() === deviceType.toLowerCase());
      return Result.Ok(devicesByType);
  } catch (error) {
      return Result.Err(`Error getting devices by type: ${error}`);
  }
}

$query
export function getActiveDevices(): Result<Vec<SmartHomeDevice>, string> {
  try {
      const activeDevices = deviceStorage.values().filter((device) => device.isOn);
      return Result.Ok(activeDevices);
  } catch (error) {
      return Result.Err(`Error getting active devices: ${error}`);
  }
}

$update
export function turnOnDevice(id: string): Result<SmartHomeDevice, string> {
  return match(deviceStorage.get(id), {
      Some: (device) => {
          if (device.isOn) {
              return Result.Err<SmartHomeDevice, string>(`Device with id=${id} is already on`);
          }

          const newDevice: SmartHomeDevice = { ...device, isOn: true };
          deviceStorage.insert(id, newDevice);

          return Result.Ok(newDevice);
      },
      None: () => Result.Err<SmartHomeDevice, string>(`Device with id=${id} not found`),
  }) as Result<SmartHomeDevice, string>;
}

$update
export function turnOffDevice(id: string): Result<SmartHomeDevice, string> {
  return match(deviceStorage.get(id), {
      Some: (device) => {
          if (!device.isOn) {
              return Result.Err<SmartHomeDevice, string>(`Device with id=${id} is already off`);
          }

          const newDevice: SmartHomeDevice = { ...device, isOn: false };
          deviceStorage.insert(id, newDevice);

          return Result.Ok(newDevice);
      },
      None: () => Result.Err<SmartHomeDevice, string>(`Device with id=${id} not found`),
  }) as Result<SmartHomeDevice, string>;
}

$update
export function addDevice(device: SmartHomeDevice): Result<SmartHomeDevice, string> {
  try {
      // Generate a unique ID for the device
      device.id = uuidv4();
      // Initialize isOn to false when adding a new device
      device.isOn = false;

      // Validate the device object
      if (!device.type || !device.brand) {
          return Result.Err('Missing required fields in the device object');
      }

      // Update the updatedAt field with the current timestamp
      device.updatedAt = Opt.Some(ic.time());

      // Add the device to deviceStorage
      deviceStorage.insert(device.id, device);

      return Result.Ok(device);
  } catch (error) {
      return Result.Err(`Error adding device: ${error}`);
  }
}

$update
export function updateDevice(id: string, device: SmartHomeDevice): Result<SmartHomeDevice, string> {
  return match(deviceStorage.get(id), {
      Some: (existingDevice) => {
          // Validate the updated device object
          if (!device.type || !device.brand) {
              return Result.Err('Missing required fields in the device object');
          }

          // Create a new device object with the updated fields
          const updatedDevice: SmartHomeDevice = {
              ...existingDevice,
              ...device,
              updatedAt: Opt.Some(ic.time()),
          };

          // Update the device in deviceStorage
          deviceStorage.insert(id, updatedDevice);

          return Result.Ok(updatedDevice);
      },
      None: () => Result.Err<SmartHomeDevice, string>(`Device with id=${id} does not exist`),
  }) as Result<SmartHomeDevice, string>;
}

$update
export function toggleDevice(id: string): Result<SmartHomeDevice, string> {
  return match(deviceStorage.get(id), {
      Some: (device) => {
          const newDevice: SmartHomeDevice = { ...device, isOn: !device.isOn };
          deviceStorage.insert(id, newDevice);

          return Result.Ok(newDevice);
      },
      None: () => Result.Err<SmartHomeDevice, string>(`Device with id=${id} not found`),
  }) as Result<SmartHomeDevice, string>;
}

$update
export function deleteDevice(id: string): Result<Opt<SmartHomeDevice>, string> {
  try {
      // Validate the id parameter
      if (!isValidUUID(id)) {
          return Result.Err('Invalid device ID');
      }

      // Delete the device from deviceStorage
      const deletedDevice = deviceStorage.remove(id);
      if (!deletedDevice) {
          return Result.Err(`Device with ID ${id} does not exist`);
      }

      return Result.Ok(deletedDevice);
  } catch (error) {
      return Result.Err(`Error deleting device: ${error}`);
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
