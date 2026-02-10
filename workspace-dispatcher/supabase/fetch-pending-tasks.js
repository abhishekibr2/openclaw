/**
 * Fetch Pending Tasks from Supabase
 * Queries tasks with status = 'pending', ordered by priority
 */

const { getSupabaseClient } = require('./supabase-client');

/**
 * Fetch all pending tasks from Supabase
 * @returns {Promise<Array>} Array of pending tasks, sorted by priority (descending)
 * @throws {Error} If Supabase query fails
 */
async function fetchPendingTasks() {
  const supabase = getSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'pending')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true });
    
    if (error) {
      throw new Error(`Failed to fetch pending tasks: ${error.message}`);
    }
    
    return data || [];
  } catch (err) {
    console.error('Error fetching pending tasks:', err);
    throw err;
  }
}

/**
 * Format pending tasks for Supervisor notification
 * @param {Array} tasks Raw task objects from Supabase
 * @returns {Array} Formatted task objects with essential fields
 */
function formatTasksForSupervisor(tasks) {
  return tasks.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description,
    priority: task.priority,
    metadata: task.metadata,
    created_at: task.created_at
  }));
}

/**
 * Get task count and priority distribution
 * @param {Array} tasks Array of pending tasks
 * @returns {Object} Statistics about pending tasks
 */
function getTaskStats(tasks) {
  if (tasks.length === 0) {
    return { total: 0, byPriority: {} };
  }
  
  const byPriority = {};
  tasks.forEach(task => {
    const p = task.priority || 0;
    byPriority[p] = (byPriority[p] || 0) + 1;
  });
  
  return {
    total: tasks.length,
    byPriority,
    highestPriority: Math.max(...tasks.map(t => t.priority || 0))
  };
}

module.exports = {
  fetchPendingTasks,
  formatTasksForSupervisor,
  getTaskStats
};
