#!/bin/bash

cd "$(dirname "$0")/supabase"
node -e "const { fetchPendingTasks } = require('./fetch-pending-tasks'); fetchPendingTasks().then(tasks => console.log(tasks)).catch(err => console.error(err));"
