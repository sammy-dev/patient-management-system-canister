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
  Principal,
} from 'azle';
import { v4 as uuidv4 } from 'uuid';

type Device = Record<{
  id: string;
  name: string;
  type: string;
  status: string;
  room: string;
  createdBy: Principal;
}>;

type SmartHomeTask = Record<{
  id: string;
  title: string;
  description: string;
  createdDate: nat64;
  updatedDate: Opt<nat64>;
  dueDate: string;
  assignedTo: string;
  tags: Vec<string>;
  status: string;
  priority: string;
  comments: Vec<string>;
  devices: Vec<Device>;
}>;

type SmartHomeTaskPayload = Record<{
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  tags: Vec<string>;
  devices: Vec<Device>;
}>;

const smartHomeTaskStorage = new StableBTreeMap<string, SmartHomeTask>(0, 44, 512);

// Number of Smart Home Tasks to load initially
const initialLoadSize = 4;

// Load the Initial batch of Smart Home Tasks
$query
export function getInitialSmartHomeTasks(): Result<Vec<SmartHomeTask>, string> {
  const initialTasks = smartHomeTaskStorage.values().slice(0, initialLoadSize);
  return Result.Ok(initialTasks);
}

// Load more Smart Home Tasks as the user scrolls down
$query
export function loadMoreSmartHomeTasks(offset: number, limit: number): Result<Vec<SmartHomeTask>, string> {
  const moreTasks = smartHomeTaskStorage.values().slice(offset, offset + limit);
  return Result.Ok(moreTasks);
}

// Loading a Specific Smart Home Task
$query
export function getSmartHomeTask(id: string): Result<SmartHomeTask, string> {
  return match(smartHomeTaskStorage.get(id), {
    Some: (task) => {
      if (task.assignedTo.toString() !== ic.caller().toString()) {
        return Result.Err<SmartHomeTask, string>('You are not authorized to access this task');
      }
      return Result.Ok<SmartHomeTask, string>(task);
    },
    None: () => Result.Err<SmartHomeTask, string>(`SmartHomeTask with id:${id} not found`),
  });
}

// Get Smart Home Tasks by Tags
$query
export function getSmartHomeTasksByTags(tag: string): Result<Vec<SmartHomeTask>, string> {
  const relatedTasks = smartHomeTaskStorage.values().filter((task) => task.tags.includes(tag));
  return Result.Ok(relatedTasks);
}

// Search Smart Home Tasks
$query
export function searchSmartHomeTasks(searchInput: string): Result<Vec<SmartHomeTask>, string> {
  const lowerCaseSearchInput = searchInput.toLowerCase();
  try {
    const searchedTasks = smartHomeTaskStorage.values().filter(
      (task) =>
        task.title.toLowerCase().includes(lowerCaseSearchInput) ||
        task.description.toLowerCase().includes(lowerCaseSearchInput)
    );
    return Result.Ok(searchedTasks);
  } catch (err) {
    return Result.Err('Error finding the smart home task');
  }
}

// Add Smart Home Task
$update
export function addSmartHomeTask(payload: SmartHomeTaskPayload): Result<SmartHomeTask, string> {
  // Validate input data
  if (!payload.title || !payload.description || !payload.assignedTo || !payload.dueDate) {
    return Result.Err<SmartHomeTask, string>('Missing or invalid input data');
  }

  try {
    const newSmartHomeTask: SmartHomeTask = {
      id: uuidv4(),
      createdDate: ic.time(),
      updatedDate: Opt.None,
      status: 'Pending',
      priority: '',
      comments: [],
      ...payload,
    };
    smartHomeTaskStorage.insert(newSmartHomeTask.id, newSmartHomeTask);
    return Result.Ok<SmartHomeTask, string>(newSmartHomeTask);
  } catch (err) {
    return Result.Err<SmartHomeTask, string>('Issue encountered when creating smart home task');
  }
}

// Add Tags to the Smart Home Task created
$update
export function addSmartHomeTaskTags(id: string, tags: Vec<string>): Result<SmartHomeTask, string> {
  // Validate input data
  if (!tags || tags.length === 0) {
    return Result.Err<SmartHomeTask, string>('Invalid tags');
  }

  return match(smartHomeTaskStorage.get(id), {
    Some: (task) => {
      if (task.assignedTo.toString() !== ic.caller().toString()) {
        return Result.Err<SmartHomeTask, string>('You are not authorized to access this task');
      }
      const updatedTask: SmartHomeTask = {
        ...task,
        tags: [...task.tags, ...tags],
        updatedDate: Opt.Some(ic.time()),
      };
      smartHomeTaskStorage.insert(task.id, updatedTask);
      return Result.Ok<SmartHomeTask, string>(updatedTask);
    },
    None: () => Result.Err<SmartHomeTask, string>(`SmartHomeTask with id:${id} not found`),
  });
}

// Update Smart Home Task
$update
export function updateSmartHomeTask(id: string, payload: SmartHomeTaskPayload): Result<SmartHomeTask, string> {
  return match(smartHomeTaskStorage.get(id), {
    Some: (task) => {
      // Authorization Check
      if (task.assignedTo.toString() !== ic.caller().toString()) {
        return Result.Err<SmartHomeTask, string>('You are not authorized to access this task');
      }
      const updatedTask: SmartHomeTask = { ...task, ...payload, updatedDate: Opt.Some(ic.time()) };
      smartHomeTaskStorage.insert(task.id, updatedTask);
      return Result.Ok<SmartHomeTask, string>(updatedTask);
    },
    None: () => Result.Err<SmartHomeTask, string>(`SmartHomeTask with id:${id} not found`),
  });
}

// Delete Smart Home Task
$update
export function deleteSmartHomeTask(id: string): Result<SmartHomeTask, string> {
  return match(smartHomeTaskStorage.get(id), {
    Some: (task) => {
      // Authorization Check
      if (task.assignedTo.toString() !== ic.caller().toString()) {
        return Result.Err<SmartHomeTask, string>('You are not authorized to access this task');
      }
      smartHomeTaskStorage.remove(id);
      return Result.Ok<SmartHomeTask, string>(task);
    },
    None: () => Result.Err<SmartHomeTask, string>(`SmartHomeTask with id:${id} not found, could not be deleted`),
  });
}

// Assign a Smart Home Task to a Device
$update
export function assignDeviceToSmartHomeTask(
  taskId: string,
  device: Device
): Result<SmartHomeTask, string> {
  return match(smartHomeTaskStorage.get(taskId), {
    Some: (task) => {
      if (task.assignedTo.toString() !== ic.caller().toString()) {
        return Result.Err<SmartHomeTask, string>('You are not authorized to access this task');
      }
      const updatedDevices: Vec<Device> = [...task.devices, device];
      const updatedTask: SmartHomeTask = {
        ...task,
        devices: updatedDevices,
        updatedDate: Opt.Some(ic.time()),
      };
      smartHomeTaskStorage.insert(task.id, updatedTask);
      return Result.Ok<SmartHomeTask, string>(updatedTask);
    },
    None: () => Result.Err<SmartHomeTask, string>(`SmartHomeTask with id:${taskId} not found`),
  });
}

// Change Smart Home Task Status
$update
export function changeSmartHomeTaskStatus(
  id: string,
  newStatus: string
): Result<SmartHomeTask, string> {
  return match(smartHomeTaskStorage.get(id), {
    Some: (task) => {
      if (task.assignedTo.toString() !== ic.caller().toString()) {
        return Result.Err<SmartHomeTask, string>('You are not authorized to change the task status');
      }
      const updatedTask: SmartHomeTask = {
        ...task,
        status: newStatus,
        updatedDate: Opt.Some(ic.time()),
      };
      smartHomeTaskStorage.insert(task.id, updatedTask);
      return Result.Ok<SmartHomeTask, string>(updatedTask);
    },
    None: () => Result.Err<SmartHomeTask, string>(`SmartHomeTask with id:${id} not found`),
  });
}

// Set Smart Home Task Priority
$update
export function setSmartHomeTaskPriority(
  id: string,
  priority: string
): Result<SmartHomeTask, string> {
  return match(smartHomeTaskStorage.get(id), {
    Some: (task) => {
      if (task.assignedTo.toString() !== ic.caller().toString()) {
        return Result.Err<SmartHomeTask, string>('You are not authorized to set task priority');
      }
      const updatedTask: SmartHomeTask = { ...task, priority, updatedDate: Opt.Some(ic.time()) };
      smartHomeTaskStorage.insert(task.id, updatedTask);
      return Result.Ok<SmartHomeTask, string>(updatedTask);
    },
    None: () => Result.Err<SmartHomeTask, string>(`SmartHomeTask with id:${id} not found`),
  });
}

// Smart Home Task Due Date Reminder
$update
export function sendSmartHomeTaskDueDateReminder(id: string): Result<string, string> {
  const now = new Date().toISOString();
  return match(smartHomeTaskStorage.get(id), {
    Some: (task) => {
      if (task.dueDate < now && task.status !== 'Completed') {
        return Result.Ok<string, string>('Task is overdue. Please complete it.');
      } else {
        return Result.Err<string, string>('Task is not overdue or already completed.');
      }
    },
    None: () => Result.Err<string, string>(`SmartHomeTask with id:${id} not found`),
  });
}

// Get Smart Home Tasks by Status
$query
export function getSmartHomeTasksByStatus(
  status: string
): Result<Vec<SmartHomeTask>, string> {
  const tasksByStatus = smartHomeTaskStorage.values().filter((task) => task.status === status);
  return Result.Ok(tasksByStatus);
}

// Get Smart Home Tasks by Creator
$query
export function getSmartHomeTasksByCreator(
  creator: Principal
): Result<Vec<SmartHomeTask>, string> {
  const creatorTasks = smartHomeTaskStorage.values().filter((task) => task.assignedTo.toString() === creator.toString());
  return Result.Ok(creatorTasks);
}

// Get Overdue Smart Home Tasks
$query
export function getOverdueSmartHomeTasks(): Result<Vec<SmartHomeTask>, string> {
  const now = new Date().toISOString();
  const overdueTasks = smartHomeTaskStorage.values().filter(
    (task) => task.dueDate < now && task.status !== 'Completed'
  );
  return Result.Ok(overdueTasks);
}

// Smart Home Task Comments
$update
export function addSmartHomeTaskComment(
  id: string,
  comment: string
): Result<SmartHomeTask, string> {
  return match(smartHomeTaskStorage.get(id), {
    Some: (task) => {
      const updatedComments = [...task.comments, comment];
      const updatedTask: SmartHomeTask = { ...task, comments: updatedComments };
      smartHomeTaskStorage.insert(task.id, updatedTask);
      return Result.Ok<SmartHomeTask, string>(updatedTask);
    },
    None: () => Result.Err<SmartHomeTask, string>(`SmartHomeTask with id:${id} not found`),
  });
}

// UUID workaround
(globalThis as any).crypto = {
  // @ts-ignore
  getRandomValues: () => {
    let array = new Uint8Array(32);

    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }

    return array;
  },
};
