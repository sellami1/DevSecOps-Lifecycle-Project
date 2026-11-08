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
6. Ran Jenkins build #11 using the workspace-local database. The H2 lock error disappeared, but the floating `latest` image failed with `Invalid API Key, length of 0 too short` and `No documents exist`. The console showed NVD API update failed before analysis.
7. Confirmed this matches the Dependency-Check 13.0.0 regression reported in [upstream issue #8715](https://github.com/dependency-check/DependencyCheck/issues/8715): the CLI passes an empty NVD API key when no key is configured.

## Resolution

Removed the shared Docker-volume mount. Dependency-Check now stores its database in `.dependency-check-data` under this pipeline's Jenkins workspace via `--data`. The workspace is mounted into the scanner container at the same path and persists between builds, preserving this job's cache while isolating it from other jobs. The generated database directory is ignored by Git. The report and diagnostic log continue to be written under `reports/dependency-check` and archived by the pipeline.

Pinned the scanner image to `owasp/dependency-check:12.1.0`, which supports updating the NVD data without an API key. This avoids the 13.0.0 regression while keeping updates enabled. The Jenkinsfile still disables concurrent builds of this job so two runs do not contend for the same workspace-local database.

Added the NVD API key to Jenkins as a Global **Secret text** credential with ID `nvd-api-key`. The pipeline binds it with `withCredentials` and passes it to Dependency-Check through `--nvdApiKey`; the key is not stored in the repository or echoed in the command source.

## Validation trace

Build #11 checked out `e5faba3c861d079d19a94333d2129171684a0cbb`. Frontend/API dependency installation, generated Prisma client, frontend tests/lint/build, API tests, Gitleaks, Semgrep, and both npm audits completed. Semgrep reported zero findings; npm audits reported existing high-severity dependency advisories. Dependency-Check then failed during the NVD update because the `latest` image rejected an absent key. Docker image builds and Trivy were skipped after that failure.

The workspace-local database change is confirmed to have removed the H2 lock failure. Build #12 was aborted at the user's request while Dependency-Check had downloaded 130,000 of 421,206 NVD records without an API key. Build #13 was launched by replaying the pipeline with the `nvd-api-key` credential binding; its NVD update and overall result are pending.
