/**
 * Notify Supervisor Agent
 * Send pending tasks to Supervisor for assignment and execution
 */

const fs = require('fs');
const path = require('path');

// Path to supervisor's pending queue
const SUPERVISOR_QUEUE_PATH = '/home/ibr-ai-agent/.openclaw/agents/supervisour/sessions/pending_queue.jsonl';

/**
 * Notify supervisor of pending tasks
 * Writes a message to the supervisor's queue file in JSONL format
 * @param {Array} tasks Array of formatted pending tasks
 * @returns {Promise<Object>} Result object with status and details
 */
async function notifySupervisor(tasks) {
  if (!tasks || tasks.length === 0) {
    return {
      success: true,
      message: 'No tasks to notify. Supervisor sleeping.',
      tasksNotified: 0,
      timestamp: new Date().toISOString()
    };
  }
  
  try {
    // Ensure directory exists
    const dir = path.dirname(SUPERVISOR_QUEUE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Create notification message
    const notification = {
      type: 'tasks_available',
      timestamp: new Date().toISOString(),
      task_count: tasks.length,
      tasks: tasks,
      from_agent: 'dispatcher'
    };
    
    // Append to queue in JSONL format (one JSON object per line)
    const jsonLine = JSON.stringify(notification) + '\n';
    fs.appendFileSync(SUPERVISOR_QUEUE_PATH, jsonLine);
    
    return {
      success: true,
      message: `Notified supervisor of ${tasks.length} pending task(s)`,
      tasksNotified: tasks.length,
      timestamp: new Date().toISOString(),
      queuePath: SUPERVISOR_QUEUE_PATH
    };
  } catch (err) {
    console.error('Error notifying supervisor:', err);
    return {
      success: false,
      message: `Failed to notify supervisor: ${err.message}`,
      tasksNotified: 0,
      timestamp: new Date().toISOString(),
      error: err
    };
  }
}

/**
 * Check if supervisor queue exists and is accessible
 * @returns {Promise<boolean>} true if queue is accessible
 */
async function checkSupervisorQueue() {
  t
    const dir = path.dirname(SUPERVISOR_QUEUE_PATH);
    return fs.existsSync(dir);
  } catch (err) {
    console.error('Error checking supervisor queue:', err);
    return false;
  }
}

module.exports = {
  notifySupervisor,
  checkSupervisorQueue,
  SUPERVISOR_QUEUE_PATH
};
