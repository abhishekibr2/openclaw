// Git Backup Agent
// This agent performs automated git backup operations when triggered

async function runGitBackup() {
    try {
        // Execute the bash script that handles all the git operations
        const { exec } = require('child_process');
        const { promisify } = require('util');
        const execAsync = promisify(exec);
        
        console.log('Starting git backup operation...');
        
        // Run the git backup script
        const result = await execAsync('/home/ibr-ai-agent/.openclaw/workspace/git_backup.sh');
        
        if (result.stdout) {
            console.log(result.stdout);
        }
        
        if (result.stderr) {
            console.error(result.stderr);
        }
        
        // Return success status
        return { success: true, output: result.stdout };
        
    } catch (error) {
        // Handle error case - the bash script will output error details
        if (error.stdout) {
            console.log(error.stdout);
        }
        if (error.stderr) {
            console.error(error.stderr);
        }
        
        // Return failure with error information
        return { success: false, error: error.message, stderr: error.stderr };
    }
}

// Execute the function
runGitBackup()
    .then(result => {
        if (!result.success) {
            console.log("Git backup failed. Error details:", result.stderr || result.error);
            // This error will be picked up by the calling agent for potential notification
        } else {
            console.log("Git backup completed successfully");
        }
    })
    .catch(error => {
        console.error("Critical error in git backup:", error);
    });