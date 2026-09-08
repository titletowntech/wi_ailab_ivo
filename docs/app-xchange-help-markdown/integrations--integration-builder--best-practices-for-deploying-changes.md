# Best Practices for Deploying Changes

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-builder/best-practices-for-deploying-changes
> Captured directly from rendered HTML: 2026-08-14

Follow these best practices for releasing integration changes safely to your customer
        base in App Xchange.

Your change management process likely has a list of changes to move from the backlog to
            production. This guide covers the Implement change stage
            (indicated as #4 on the process diagram). At this stage, you have already designed,
            built, and tested the fix on your development workspace, and you are now ready to
            release it to customers.

        ![Change Management Process Diagram](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/0bd782ca-50f8-4172-ae93-8f7ac2183a81.png)

A staged deployment approach, also referred to as a slow roll, is highly recommended.

## Prerequisite: Validate in Development

The deployment journey begins in your development workspace. This workspace must be
                connected to a dev/test instance of the integrated systems. Your team should use
                this environment to build and test all modifications. No change should ever bypass
                this step.

Stage the fix to your development workspace and select History
                to view the version history. Document the following details for every flow that has
                changed:

- The flow name
- The staged version
- The previous main version

From your flow interface, select Registrations and filter by
                    Staging. This action displays all customers currently on
                that staged version. At this point in the process, only your development workspace
                should appear on the staged version. Additional workspaces will be added as you
                progress through the deployment phases.

## Step 1: External Validation

External validation involves routing the change to a third party or another team
                member to perform additional regression testing on a staged workspace prior to
                releasing it to actual customers.

Navigate to the testing workspace, search for the flow, and select the staging button
                to place the workspace on staging.

Test the changes thoroughly to validate performance. Conduct any additional
                regression testing required based on the scope and risk level of the change.

FAILED: If the changes do not pass testing, stop the deployment. Select
                    Main to return the workspace to the main version while
                you troubleshoot and correct the underlying issue.

PASSED: If the changes pass all validation tests, you may proceed to the next
                step.

## Step 2: Beta Release

Identify a small beta group consisting of 3 to 5 customers to verify that the changes
                function as expected in a live scenario without causing disruptions.

Ideal beta candidates meet the following criteria:

- The customer requested or is actively awaiting the specific change being
                      deployed, allowing them to validate that it successfully fulfills their
                      needs.
- The customer is small to mid-sized. Avoid selecting large, support-heavy, or
                      highly critical accounts.
- The customer has a stable environment and maintains a positive working
                      relationship with your team (avoid escalated accounts or those up for immediate
                      contract renewal).

Navigate to the selected customer workspaces, search for the flow, and select the
                    Staging button to place them on the staged version.

MONITOR: Monitor the workspace dashboard and flow runs carefully. Do not skip
                this tracking step. Depending on the risk and scope of the changes, review the
                status within a few hours or the following morning to verify system stability.

To inspect details, access the customer workspaces, navigate to the
                    Dashboard, and expand the Completed Flow
                    Runs widget. Locate a flow run that occurred after the workspace was
                placed on staging to evaluate the most recent activity. Select the flow run to
                verify its details. Verify that the active execution version matches the intended
                staged version number.

FAILED: If errors or failures are detected, return the customer workspaces to
                the main version immediately. Review the execution logs, re-run flows where
                necessary, and isolate the issue to contain fallout.

PASSED: If no issues arise as you monitor the beta group for at least a few
                days, you can move forward.

## Step 3: Additional Release Groups

            Depending on the scope and potential risk of your modifications, you may perform a
                controlled rollout to additional groups of customers.Note: If
                    the modification is minor or carries low risk, this step may be
                bypassed.

The pacing of the rollout can be adapted as needed, but a highly cautious approach is
                recommended for critical or heavily utilized flows. Continually add more customer
                workspaces to the staged version to incrementally build confidence in the stability
                of the release.

FAILED: High-volume flows can experience rapid failure propagation if a
                breaking change is introduced. Even an hour of system downtime can result in heavy
                support ticket volume and extensive data reconciliation efforts. If failures occur,
                immediately restore the workspaces to the main version, evaluate the flow runs,
                troubleshoot the root cause, and contain the fallout.

PASSED: If the system remains stable after you've monitored the expanded
                release groups for at least a few days, proceed to full promotion.

## Step 4: Promote to All Customers

Once you have confirmed that the changes are stable and have no negative downstream
                impacts, promote the flow to main to release the updates to all customers.

Access your development workspace and load the flow. Cross-reference the active
                version number with the staged version number documented in your notes. If the
                version numbers do not match, another team member has overwritten the workflow.
                Coordinate with your team before proceeding.

Select Promote to Main.

A confirmation window will display the total number of customers who will receive the
                updated main version. The customer accounts currently on staging (your beta groups)
                will automatically be migrated to the main version as well.

MONITOR: Monitor your account dashboard and flow runs continuously. Review the
                status within a few hours or the next morning to ensure the system is stable.

Navigate to your account dashboard to view all active customers, and expand the
                    Completed Flow Runs widget. Adjust the reporting
                timeframe if necessary, and select Flows to organize and view
                the execution logs by flow name.

FAILED: If unexpected widespread failures occur and a system rollback is
                required, utilize the previous main version number documented in your prerequisite
                notes to perform a rollback.

PASSED: It is best practice to monitor the account dashboard for an additional
                24 hours to review overall performance. If all executions complete successfully, the
                deployment process is finished.

## Roll Back Customers

            Follow these steps if you need to a roll back customers to an earlier version of your
                    integration.
1. Load your development workspace and open the affected flow.
2. Select History and choose the stable previous main
                          version you noted before starting the deployment. (The correct version
                          number will match your documentation and feature a return
                              icon.)
3. Select Deploy to Staging.
4. Select Promote to Main.
5. This action immediately restores all customer accounts to the designated
                          stable version.

Following a rollback, conduct a retrospective review to evaluate the root cause,
                address any support or remediation requirements, patch the issue, and restart the
                deployment cycle from the beginning.

## Additional Notes

This deployment framework is structured specifically to isolate errors and minimize
                negative operational impacts. While errors can occur, negligence and a lack of
                procedural compliance must be actively prevented.

The following practices are prohibited by the change management policy:

- Failing to deploy and validate a fix in a dedicated development workspace first,
                      regardless of how minor the change appears.
- Failing to actively monitor live flow runs and execution statuses after moving a
                      customer workspace to staging.
- Failing to inspect the global account dashboard after promoting a flow to all
                      customers to verify system health.
