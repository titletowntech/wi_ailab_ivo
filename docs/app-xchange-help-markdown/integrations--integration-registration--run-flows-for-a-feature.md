# Run Flows for a Feature

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-registration/run-flows-for-a-feature
> Captured directly from rendered HTML: 2026-08-14

After populating and validating the data for integration features, you can run flows to move the data between connectors.

1. Depending on the workspace type, select ![integration workspace icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/476c5b53-43e4-4db2-8d78-2a882a193df2.svg) Integration Workspaces or ![automation workspace icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/4bd37e33-bd30-44e4-8645-f6304e42159b.svg) Automation Workspaces.The workspace
                      opens.
2. Select the workspace's ![flows icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/6527fef5-240b-4327-8e72-7357efa67678.svg) Flows tab.
                  The Flows page opens.
3. Open each flow associated with your feature.
4. In each flow, select the Data tab.
5. In the Quick Search field, select the trigger for each particular flow.
6. In the list of results, select the dropdown arrow next to the first checkbox and choose Select all rows. This ensures that you can process data for all records at
                      once.
7. Select Run selected.
8. Select Yes to confirm that you want to run the records.
9. While staying in the same flow, go to the Runs tab. Here you can view the flow processing the runs.  To automatically refresh the page, toggle on the Auto Refetch slider.
10. Once the flow has been run, review the run results and status to determine the outcome of the flow run:

  - Runs with a success status and zero actions represent data
                                        records that the flow determined should not be synced. The flow
                                        ended with no actions to process.
  - Runs with a success status and some number of actions represent
                                        data records that the flow determined should be synced. Green
                                        action bars represent successful action processing, while red
                                        action bars represent failed action processing.
11. Select the flow result to view more details.
12. If there are any failures, correct the data in the source connector as needed.  Then re-run the flows.
