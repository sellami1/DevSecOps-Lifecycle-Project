# Jenkins Dependency-Check database lock

## Problem

The Dependency-Check stage repeatedly waited for an exclusive lock on its H2 database and then exited without analysis. The Jenkins console reported:

```text
Unable to obtain an exclusive lock on the H2 database to perform updates
No documents exist
```

The diagnostic log showed Dependency-Check retrying the lock every 15 seconds. The pipeline mounted the Docker volume `dependency-check-data` at `/usr/share/dependency-check/data`. Docker volumes with that name are shared across Jenkins jobs on the same Docker host, so `disableConcurrentBuilds()` on this job alone could not prevent another job or process from holding the database lock.

## Investigation trace

1. Reviewed the Jenkins console for build #10 on 2026-11-08. Jenkins loaded the Jenkinsfile from the GitHub repository and ran it in `/var/lib/jenkins/workspace/act4-devsecops`.
2. Confirmed the logged command still launched the scanner with `-v dependency-check-data:/usr/share/dependency-check/data`.
3. Compared the repeated H2 lock messages in `reports/dependency-check/dependency-check.log` with the pipeline's shared-volume configuration. The evidence indicated database contention, not a vulnerability finding in the application.
4. Confirmed the existing `disableConcurrentBuilds()` option only serializes builds of this pipeline; it does not coordinate other Jenkins jobs that mount the same Docker volume.
5. Build #10 was manually aborted while Dependency-Check was running, so it did not verify a resolution.

## Resolution

Removed the shared Docker-volume mount. Dependency-Check now stores its database in `.dependency-check-data` under this pipeline's Jenkins workspace via `--data`. The workspace is mounted into the scanner container at the same path and persists between builds, preserving this job's cache while isolating it from other jobs. The generated database directory is ignored by Git. The report and diagnostic log continue to be written under `reports/dependency-check` and archived by the pipeline.

The Jenkinsfile still disables concurrent builds of this job so two runs do not contend for the same workspace-local database.

## Validation trace

Committed the isolation change as `b86f378` on local branch `act4`. The push to `origin/act4` was rejected because this environment has no GitHub credentials (`could not read Username for 'https://github.com': terminal prompts disabled`). Jenkins therefore still points to the prior commit. No new Jenkins build was launched against stale pipeline code; Jenkins validation is pending an authorized push of `b86f378`.
