/**
 * Dispatcher Polling Main Function
 * Orchestrates the complete polling cycle:
 * 1. Fetch pending tasks from Supabase
 * 2. If tasks found: notify supervisor, log activity
 * 3. If no tasks: log and sleep
 * 4. Handle errors gracefully
 */

const { fetchPendingTasks, formatTasksForSupervisor, getTaskStats } = require('./fetch-pending-tasks');
const { notifySupervisor } = require('./notify-supervisor');
const { logPollCycle, logError, logEvent } = require('./memory-logger');
const { testConnection } = require('./supabase-client');

/**
 * Main dispatcher polling function
 * Call this every 60 seconds via HEARTBEAT.md
 * @returns {Promise<Object>} Result object with status and details
 */
async function dispatcherPoll() {
  try {
    logEvent('POLL_START');
    
    // Test Supabase connection
    const connected = await testConnection();
    if (!connected) {
      logError('Supabase connection failed');
      return {
        success: false,
        message: 'Supabase connection failed',
        tasksProcessed: 0
      };
    }
    
    // Fetch pending tasks
    const tasks = await fetchPendingTasks();
    const stats = getTaskStats(tasks);
    
    // Log poll cycle
    logPollCycle(tasks.length, stats);
    
    // If no tasks, return early
    if (tasks.length === 0) {
      return {
        success: true,
        message: 'No pending tasks. Sleeping.',
        tasksProcessed: 0,
        stats: stats
      };
    }
    
    // Format tasks for supervisor
    const formattedTasks = formatTasksForSupervisor(tasks);
    
    // Notify supervisor
    const notificationResult = await notifySupervisor(formattedTasks);
    
    if (!notificationResult.success) {
      logError('Failed to notify supervisor', notificationResult.message);
      return {
        success: false,
        message: 'Tasks found but failed to notify supervisor',
        tasksProcessed: tasks.length,
        stats: stats
      };
    }
    
    // Log successful notification
    logEvent('SUPERVISOR_NOTIFIED', {
      tasks_count: tasks.length,
      stats: stats
    });
    
    return {
      success: true,
      message: `Found ${tasks.length} pending task(s). Notified supervisor.`,
      tasksProcessed: tasks.length,
      stats: stats
    };
    
  } catch (err) {
    logError('Dispatcher poll error', err);
    return {
      success: false,
      message: `Dispatcher poll failed: ${err.message}`,
      tasksProcessed: 0,
      error: err.message
    };
  }
}

/**
 * Health check for dispatcher
 * @returns {Promise<Object>} Status information
 */
async function healthCheck() {
  try {
    const connected = await testConnection();
    return {
      healthy: connected,
      timestamp: new Date().toISOString(),
      supabaseConnected: connected
    };
  } catch (err) {
    return {
      healthy: false,
      timestamp: new Date().toISOString(),
      error: err.message
    };
  }
}

module.exports = {
  dispatcherPoll,
  healthCheck
};
