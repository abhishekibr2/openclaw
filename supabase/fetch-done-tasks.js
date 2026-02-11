/**
 * Fetch completed/done tasks from Supabase within a date/time range
 * for Reporter metrics and reports.
 *
 * Similar structure to:
 *   workspace-dispatcher/supabase/fetch-pending-tasks.js
 */

const { supabase } = require('./supabase-client');
require('../env'); // ← MUST BE FIRST

/**
 * Fetch tasks with status in ['completed', 'done'] whose completed_at
 * timestamp falls within [startTimeIso, endTimeIso].
 *
 * @param {string} startTimeIso - Inclusive ISO timestamp (e.g. '2026-02-10T00:00:00.000Z')
 * @param {string} endTimeIso   - Inclusive ISO timestamp (e.g. '2026-02-10T23:59:59.999Z')
 * @returns {Promise<Array<Object>>} Raw task rows from Supabase
 */
async function fetchDoneTasksInRange(startTimeIso, endTimeIso) {
  if (!startTimeIso || !endTimeIso) {
    throw new Error('fetchDoneTasksInRange requires both startTimeIso and endTimeIso');
  }

  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .in('status', ['completed', 'done'])
      .gte('completed_at', startTimeIso)
      .lte('completed_at', endTimeIso)
      .order('completed_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch done tasks: ${error.message}`);
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching done tasks in range:', err);
    throw err;
  }
}

/**
 * Shape tasks for Reporter reports (daily/weekly/task-level).
 *
 * @param {Array<Object>} tasks
 * @returns {Array<Object>}
 */
function formatTasksForReporter(tasks) {
  return (tasks || []).map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    metadata: task.metadata,
    created_at: task.created_at,
    updated_at: task.updated_at,
    completed_at: task.completed_at,
    result: task.result,
    error: task.error,
  }));
}

/**
 * Basic stats over a set of tasks (similar to dispatcher getTaskStats).
 *
 * @param {Array<Object>} tasks
 * @returns {{ total: number, byStatus: Object, byPriority: Object }}
 */
function getTaskStats(tasks) {
  const stats = {
    total: 0,
    byStatus: {},
    byPriority: {},
  };

  if (!tasks || tasks.length === 0) {
    return stats;
  }

  stats.total = tasks.length;

  for (const task of tasks) {
    const status = task.status || 'unknown';
    const priority = task.priority ?? 0;

    stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
    stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1;
  }

  return stats;
}

module.exports = {
  fetchDoneTasksInRange,
  formatTasksForReporter,
  getTaskStats,
};

