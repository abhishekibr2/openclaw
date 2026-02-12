/**
 * Fetch reports from Supabase within a date/time range,
 * optionally filtered by report_type.
 */

const { supabase } = require('./supabase-client');
require('../env'); // ← MUST BE FIRST

/**
 * Fetch reports whose created_at timestamp falls within [startTimeIso, endTimeIso],
 * optionally filtered by report_type.
 *
 * @param {string} startTimeIso - Inclusive ISO timestamp (e.g. '2026-02-10T00:00:00.000Z')
 * @param {string} endTimeIso   - Inclusive ISO timestamp (e.g. '2026-02-10T23:59:59.999Z')
 * @param {string|null} reportType - Optional report_type filter (e.g. 'daily', 'weekly', 'task', 'metrics')
 * @returns {Promise<Array<Object>>} Raw report rows from Supabase
 */
async function fetchReportsInRange(startTimeIso, endTimeIso, reportType = null) {
  if (!startTimeIso || !endTimeIso) {
    throw new Error('fetchReportsInRange requires both startTimeIso and endTimeIso');
  }

  try {
    let query = supabase
      .from('reports')
      .select('*')
      .gte('created_at', startTimeIso)
      .lte('created_at', endTimeIso)
      .order('created_at', { ascending: true });

    if (reportType) {
      query = query.eq('report_type', reportType);
    }

    const { data, error } = await query;
    console.log(data);
    console.log(error);
    if (error) {
      throw new Error(`Failed to fetch reports: ${error.message}`);
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching reports in range:', err);
    throw err;
  }
}

// CLI usage:
//   node fetch-reports.js "<startIso>" "<endIso>" [reportType]
//   node fetch-reports.js "2026-02-10T00:00:00.000Z" "2026-02-10T23:59:59.999Z" daily
if (require.main === module) {
  const startTimeIso = process.argv[2];
  const endTimeIso = process.argv[3];
  const reportType = process.argv[4] || null;

  if (!startTimeIso || !endTimeIso) {
    console.error('Usage: node fetch-reports.js <startIso> <endIso> [reportType]');
    process.exit(1);
  }

  fetchReportsInRange(startTimeIso, endTimeIso, reportType)
    .then((rows) => {
      console.log(JSON.stringify(rows, null, 2));
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = {
  fetchReportsInRange,
};

