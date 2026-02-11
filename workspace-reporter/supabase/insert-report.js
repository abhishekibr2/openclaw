/**
 * Insert a report row into the Supabase `reports` table.
 *
 * This is analogous in spirit to Supervisor's update-task-status helper,
 * but focused on creating new report records for the Reporter agent.
 */

const { supabase } = require('./supabase-client');

/**
 * Insert a report.
 *
 * @param {Object} params
 * @param {string} params.content      - Report markdown or text (required)
 * @param {string} [params.reportType] - Optional type, e.g. 'daily', 'weekly', 'task', 'metrics'
 * @param {Object} [params.metadata]   - Optional JSON metadata (e.g. { taskId, date, range })
 * @returns {Promise<Object>}          - Inserted report row
 */
async function insertReport({ content, reportType = null, metadata = null }) {
  if (!content || typeof content !== 'string') {
    throw new Error('insertReport requires a non-empty string `content`');
  }

  const payload = {
    content,
    report_type: reportType,
    metadata,
  };

  try {
    const { data, error } = await supabase
      .from('reports')
      .insert([payload])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to insert report: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error('Error inserting report:', err);
    throw err;
  }
}

// CLI usage:
//   node insert-report.js "<reportType>" "<content>" '{"key":"value"}'
//   node insert-report.js "" "<content>"              # no type
if (require.main === module) {
  const reportTypeArg = process.argv[2] || null;
  const contentArg = process.argv[3] || '';
  const metadataArg = process.argv[4] || null;

  if (!contentArg) {
    console.error('Usage: node insert-report.js <reportType> "<content>" [metadataJson]');
    console.error('');
    console.error('Examples:');
    console.error('  node insert-report.js daily "Daily report content"');
    console.error('  node insert-report.js task "Task report" \'{"taskId":"123","status":"completed"}\'');
    process.exit(1);
  }

  let metadata = null;
  if (metadataArg) {
    try {
      metadata = JSON.parse(metadataArg);
    } catch (e) {
      console.error('Invalid metadata JSON:', e.message);
      process.exit(1);
    }
  }

  insertReport({ content: contentArg, reportType: reportTypeArg || null, metadata })
    .then((row) => {
      console.log(JSON.stringify(row, null, 2));
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = {
  insertReport,
};

