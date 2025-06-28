#!/bin/bash
cd /home/kavia/workspace/code-generation/learntrackr-115210-286a81ed/personal_learning_tracker_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

