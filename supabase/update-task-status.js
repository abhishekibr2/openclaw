/**
 * Update task status in Supabase
 * Updates a specific task from 'pending' to 'done'
 */

require('../env'); // ← MUST BE FIRST

const { supabase } = require('./supabase-client');

/**
 * Update task status to 'done'
 * @param {string} taskId - The ID of the task to update
 * @param {string} executorName - Name of executor (optional)
 * @param {number} runs_today - Number of runs today (optional)
 * @returns {Promise<Object>} Updated task data
 */
async function updateTaskStatus(taskId, executorName = 'executor', runs_today) {
  try {
    const updateData = {
      status: 'done',
      executor_name: executorName,
      updated_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      runs_today: runs_today
    };

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .eq('status', 'pending') // Only update if still pending
      .select();

    if (error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error(`Task ${taskId} not found or already updated`);
    }

    return data[0];
  } catch (err) {
    console.error('Error updating task status:', err);
    throw err;
  }
}

// Main execution if called directly
if (require.main === module) {
  const taskId = process.argv[2];
  const executorName = process.argv[3] || 'executor';
  const runs_today = process.argv[4] || 0;
  
  if (!taskId) {
    console.error('Usage: node update-task-status.js <taskId> [executorName] [runs_today]');
    console.error('Example: node update-task-status.js 27fd3f9b-36f7-42a2-835f-8183f6b20ebf executor 1');
    process.exit(1);
  }

  if (!runs_today) {
    console.error('Usage: node update-task-status.js <taskId> [executorName] [runs_today]');
    console.error('Example: node update-task-status.js 27fd3f9b-36f7-42a2-835f-8183f6b20ebf executor 1');
    process.exit(1);
  }
  
  updateTaskStatus(taskId, executorName, runs_today)
    .then(updatedTask => {
      console.log('Task updated successfully:', JSON.stringify(updatedTask, null, 2));
    })
    .catch(err => {
      console.error('Failed to update task:', err.message);
      process.exit(1);
    });
}

module.exports = {
  updateTaskStatus
};