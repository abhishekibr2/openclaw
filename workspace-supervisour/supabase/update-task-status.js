/**
 * Update task status in Supabase (Supervisor Agent)
 * Updates task status to: completed, done, or failed
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/home/abhishek-sharma/.openclaw/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env file');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Update task status
 * @param {string} taskId - The ID of the task to update
 * @param {string} status - New status: 'completed', 'done', or 'failed'
 * @param {string} result - Optional result/output message
 * @param {string} errorMessage - Optional error message (for failed tasks)
 * @returns {Promise<Object>} Updated task data
 */
async function updateTaskStatus(taskId, status = 'completed', result = null, errorMessage = null) {
    try {
        // Validate status
        const validStatuses = ['completed', 'done', 'failed'];
        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
        }

        const updateData = {
            status: status,
            updated_at: new Date().toISOString(),
        };

        // Add completed_at for successful completions
        if (status === 'completed' || status === 'done') {
            updateData.completed_at = new Date().toISOString();
        }

        // Add error information for failed tasks
        if (status === 'failed' && errorMessage) {
            updateData.error = errorMessage;
        }

        const { data, error } = await supabase
            .from('tasks')
            .update(updateData)
            .eq('id', taskId)
            .select();

        if (error) {
            throw new Error(`Failed to update task: ${error.message}`);
        }

        if (!data || data.length === 0) {
            throw new Error(`Task ${taskId} not found`);
        }

        return data[0];
    } catch (err) {
        console.error('Error updating task status:', err);
        throw err;
    }
}

/**
 * Mark task as completed (success)
 */
async function markTaskCompleted(taskId, result = null) {
    return updateTaskStatus(taskId, 'completed', result);
}

/**
 * Mark task as done (success)
 */
async function markTaskDone(taskId, result = null) {
    return updateTaskStatus(taskId, 'done', result);
}

/**
 * Mark task as failed
 */
async function markTaskFailed(taskId, errorMessage) {
    return updateTaskStatus(taskId, 'failed', null, errorMessage);
}

// Main execution if called directly
if (require.main === module) {
    const taskId = process.argv[2];
    const status = process.argv[3] || 'completed';
    const message = process.argv[4] || null;

    if (!taskId) {
        console.error('Usage: node update-task-status.js <taskId> [status] [message]');
        console.error('');
        console.error('Arguments:');
        console.error('  taskId   - Task ID to update (required)');
        console.error('  status   - New status: completed, done, or failed (default: completed)');
        console.error('  message  - Result message for completed/done, or error for failed');
        console.error('');
        console.error('Examples:');
        console.error('  node update-task-status.js 27fd3f9b-... completed "Task finished successfully"');
        console.error('  node update-task-status.js 27fd3f9b-... done "Comment posted"');
        console.error('  node update-task-status.js 27fd3f9b-... failed "Login required"');
        process.exit(1);
    }

    updateTaskStatus(taskId, status, message, message)
        .then(updatedTask => {
            console.log('Task updated successfully:');
            console.log(JSON.stringify(updatedTask, null, 2));
        })
        .catch(err => {
            console.error('Failed to update task:', err.message);
            process.exit(1);
        });
}

module.exports = {
    updateTaskStatus,
    markTaskCompleted,
    markTaskDone,
    markTaskFailed
};
