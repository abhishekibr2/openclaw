/**
 * Update task status in Supabase
 * Updates a specific task from 'pending' to 'done'
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/home/ibr-ai-agent/.openclaw/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env file');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Update task status to 'done'
 * @param {string} taskId - The ID of the task to update
 * @param {string} executorName - Name of executor (optional)
 * @returns {Promise<Object>} Updated task data
 */
async function updateTaskStatus(taskId, executorName = 'executor') {
  try {
    const updateData = {
      status: 'done',
      executor_name: executorName,
      updated_at: new Date().toISOString(),
      completed_at: new Date().toISOString()
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
  
  if (!taskId) {
    console.error('Usage: node update-task-status.js <taskId> [executorName]');
    console.error('Example: node update-task-status.js 27fd3f9b-36f7-42a2-835f-8183f6b20ebf executor');
    process.exit(1);
  }
  
  updateTaskStatus(taskId, executorName)
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