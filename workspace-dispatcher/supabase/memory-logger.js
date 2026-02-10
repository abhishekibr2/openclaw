/**
 * Memory Logger for Dispatcher Agent
 * Logs dispatcher polling activity to daily memory files
 */

const fs = require('fs');
const path = require('path');

// Memory directory
const MEMORY_DIR = '/home/abhishek-sharma/.openclaw/workspace-dispatcher/memory';

/**
 * Get today's memory file path
 * @returns {string} Path to today's memory file (YYYY-MM-DD.md)
 */
function getTodayMemoryPath() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return path.join(MEMORY_DIR, `${today}.md`);
}

/**
 * Ensure memory directory exists
 */
function ensureMemoryDir() {
  if (!fs.existsSync(MEMORY_DIR)) {
    fs.mkdirSync(MEMORY_DIR, { recursive: true });
  }
}

/**
 * Create header for today's memory file (if new)
 * @returns {string} Header markdown
 */
function createMemoryHeader() {
  const today = new Date().toISOString().split('T')[0];
  return `# Memory Log - ${today}

## Dispatcher Polling Activity

---

`;
}

/**
 * Log a polling event to memory
 * @param {string} event Type of event ('poll_start', 'tasks_found', 'no_tasks', 'error', 'supervisor_notified')
 * @param {Object} details Details to log
 * @returns {void}
 */
function logEvent(event, details = {}) {
  ensureMemoryDir();
  
  const memoryPath = getTodayMemoryPath();
  const timestamp = new Date().toISOString();
  
  // Create file if it doesn't exist
  if (!fs.existsSync(memoryPath)) {
    fs.writeFileSync(memoryPath, createMemoryHeader());
  }
  
  // Format log entry
  let logEntry = `**[${timestamp}]** ${event}`;
  
  if (Object.keys(details).length > 0) {
    logEntry += '\n```json\n' + JSON.stringify(details, null, 2) + '\n```';
  }
  
  logEntry += '\n\n';
  
  // Append to file
  fs.appendFileSync(memoryPath, logEntry);
}

/**
 * Log a poll cycle (summary)
 * @param {number} taskCount Number of pending tasks found
 * @param {Object} stats Task statistics
 * @param {boolean} supervisorNotified Whether supervisor was notified
 * @returns {void}
 */
function logPollCycle(taskCount, stats = {}, supervisorNotified = false) {
  const details = {
    task_count: taskCount,
    supervisor_notified: supervisorNotified,
    stats: stats
  };
  
  if (taskCount === 0) {
    logEvent('POLL_NO_TASKS', details);
  } else {
    logEvent('POLL_TASKS_FOUND', details);
  }
}

/**
 * Log an error
 * @param {string} message Error message
 * @param {Error|Object} error Error object or details
 * @returns {void}
 */
function logError(message, error = {}) {
  const details = {
    message,
    error: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined
  };
  
  logEvent('ERROR', details);
}

module.exports = {
  logEvent,
  logPollCycle,
  logError,
  ensureMemoryDir,
  getTodayMemoryPath,
  MEMORY_DIR
};
