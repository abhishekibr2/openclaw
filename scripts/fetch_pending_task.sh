#!/bin/bash

cd "$(dirname "$0")"
node -e "const { fetchPendingTasks } = require('../supabase/fetch-pending-tasks'); fetchPendingTasks().then(tasks => console.log(tasks)).catch(err => console.error(err));"
