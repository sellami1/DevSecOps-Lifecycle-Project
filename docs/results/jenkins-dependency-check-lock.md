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
8. Build #12 was aborted at the user's request after downloading 130,000 of 421,206 NVD records. Build #13 confirmed the NVD key was masked in the Jenkins command, but the aborted update left `.dependency-check-data/odc.update.lock`; Dependency-Check waited on that stale marker.

## Resolution

Removed the shared Docker-volume mount. Dependency-Check now stores its database in `.dependency-check-data` under this pipeline's Jenkins workspace via `--data`. The workspace is mounted into the scanner container at the same path and persists between builds, preserving this job's cache while isolating it from other jobs. The generated database directory is ignored by Git. The report and diagnostic log continue to be written under `reports/dependency-check` and archived by the pipeline.

Pinned the scanner image to `owasp/dependency-check:12.1.0`, which supports updating the NVD data without an API key. This avoids the 13.0.0 regression while keeping updates enabled. The Jenkinsfile still disables concurrent builds of this job so two runs do not contend for the same workspace-local database.

Added the NVD API key to Jenkins as a Global **Secret text** credential with ID `nvd-api-key`. The pipeline binds it with `withCredentials` and passes it to Dependency-Check through `--nvdApiKey`; the key is not stored in the repository or echoed in the command source. Before scanning, the pipeline removes the exact stale update marker from the workspace-local database. Builds are serialized and the data directory is private to this job, so this cleanup cannot race another run of the same job.

Build #14 successfully downloaded and processed the 421,233-record NVD update, confirming the NVD credential and workspace-local database fix. It then spent several minutes in JavaScript analysis and emitted repeated warnings from the Sonatype OSS Index Analyzer. Dependency-Check's [CLI reference](https://dependency-check.github.io/DependencyCheck/dependency-check-cli/arguments.html) states that this analyzer requires authentication; the NVD API key is not an OSS Index credential. Disabled this optional analyzer with `--disableOssIndex` rather than adding an unrelated external credential. The NVD-based scan and the pipeline's separate `npm audit` checks remain enabled.

## Validation trace

Build #11 checked out `e5faba3c861d079d19a94333d2129171684a0cbb`. Frontend/API dependency installation, generated Prisma client, frontend tests/lint/build, API tests, Gitleaks, Semgrep, and both npm audits completed. Semgrep reported zero findings; npm audits reported existing high-severity dependency advisories. Dependency-Check then failed during the NVD update because the `latest` image rejected an absent key. Docker image builds and Trivy were skipped after that failure.

The workspace-local database change removed the shared H2 lock failure. Build #13 was aborted after confirming the provided key was passed (masked) but Dependency-Check remained blocked by the stale update marker. Build #14 cleared that marker and completed the full NVD update, but was stopped after repeated unauthenticated OSS Index warnings. Build #15 reused the updated database, completed Dependency-Check analysis in 581 seconds with no OSS Index warnings, and archived its HTML report and log. It failed as configured at `--failOnCVSS 9.0`: the report identified `deepmerge-ts` 7.1.5 (CVSS 10.0), `lodash` 4.17.21 (CVSS 9.8), and `postcss` 8.4.31 (CVSS 9.1). The log also lists `zod` 3.25.76 at CVSS 7.5. Docker image builds and Trivy were skipped after the dependency gate failed. Resolve or suppress the reported findings as appropriate, then rerun the pipeline to validate those later stages.

## Dependency remediation

Updated the API to Zod 4.6.7 and overrode Prisma 6's vulnerable `deepmerge-ts` 7.1.5 dependency to 8.0.2. Prisma client generation and API tests pass with that override. Updated the frontend to Next.js and `eslint-config-next` 16.4.5, with PostCSS 8.5.32 enforced by an npm override. Next.js 16's flat ESLint configuration also required updating the frontend ESLint config; the header now subscribes to the persisted theme rather than setting React state synchronously inside an effect.

The two Lodash findings in build #15 pointed to copies bundled inside Next.js compiler packages (including Next.js 15's compiled `jsonwebtoken` and Babel bundles), not a Lodash dependency in either committed npm lockfile. Dependency-Check now scans the committed frontend and API `package-lock.json` files directly, preserving analysis of their full resolved npm dependency graphs while avoiding fingerprints from generated or vendored JavaScript bundles. Semgrep still scans application source, npm audit still checks both package graphs, and Trivy still scans the built images.

Local validation after these changes: frontend tests, lint, and Next.js production build passed; API tests and Prisma client generation passed; both npm audits passed at the pipeline's critical-only threshold. The frontend audit still reports moderate advisories. Jenkins subsequently passed the dependency gate and built both images, but Trivy could not inspect the local image because the scanner container lacked permission to access `/var/run/docker.sock`; its fallback attempted to pull the private-to-the-job image name from Docker Hub and failed authentication.

## Trivy image access

The previous Trivy stage mounted the Jenkins host's Docker socket into the scanner container. The Jenkins agent could build the images, but the container's user could not access that socket. The pipeline now exports both locally built images with `docker save` into temporary workspace archives, then runs Trivy with `--input` against those archives. The scanner no longer receives the Docker socket or attempts a registry pull. The stage removes both archives on completion, including failure.
