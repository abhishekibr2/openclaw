/**
 * Fetch Pending Tasks from Supabase
 */


const { supabase } = require('./supabase-client');
require('../env'); // ← MUST BE FIRST

async function fetchPendingTasks() {

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

function formatTasksForSupervisor(tasks) {
  return tasks.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description,
    priority: task.priority,
    metadata: task.metadata,
    created_at: task.created_at,
  }));
}

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
    highestPriority: Math.max(...tasks.map(t => t.priority || 0)),
  };
}

module.exports = {
  fetchPendingTasks,
  formatTasksForSupervisor,
  getTaskStats,
};
