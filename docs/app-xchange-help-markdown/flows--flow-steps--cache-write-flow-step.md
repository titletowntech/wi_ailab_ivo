# Cache Write Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/cache-write-flow-step
> Captured directly from rendered HTML: 2026-08-14

The ![cache write flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/e3f16ad6-db25-48c3-9ad4-bfb3ee3b14c1.svg) Cache Write flow step enables a filtered update to the cache for some specific connectors and data objects,
        especially within Procore and ProjectSight.

This flow step is a legacy feature of some specific
            connectors and data objects, and should only be used in specific circumstances.
            Otherwise, it is best practice to schedule a cache write service to update your cache.
            For a more general cache write explanation and standard use, see [Cache Writer Services](https://help.trimble.com/doc/app-xchange/app-xchange/getting-started/key-concepts#concept-fd11042c-1c39-4c41-b02d-a0af679b8660--en__cache_write_services_section) and [Services](https://help.trimble.com/doc/app-xchange/app-xchange/getting-started/key-concepts#concept-fd11042c-1c39-4c41-b02d-a0af679b8660--en__services_section) in Key Concepts.

If you are still trying to update the cache in flow, either to leverage
            filtering or in response to flow logic, make sure to view the newer Connector Action > Refresh Cache options for your desired data object.

One key scenario where it is advantageous to use the ![cache write flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/e3f16ad6-db25-48c3-9ad4-bfb3ee3b14c1.svg) Cache Write flow step is if a workspace is only interested in
            specific Projects or Vendors data objects, and those data objects have filters enabled
            for an in-flow cache write.

Because of its limited applications, only certain data objects support this
            step. Below is a list of compatible data objects used by public connectors.

Procore

- procorev2/procore-v2/1/projects
- procorev2/procore-v2/1/timecard-entries
- procorev2/procore-v2/1/rfis
- procorev2/procore-v2/1/rfi-replies
- procorev2/procore-v2/1/submittals
- procorev2/procore-v2/1/staged-records
- procorev2/procore-v2/1/direct-cost-items
- procorev2/procore-v2/1/po-compliance-docs
- procorev2/procore-v2/1/wo-compliance-docs
- procorev2/procore-v2/1/work-orders
- procorev2/procore-v2/1/purchase-orders
- procorev2/procore-v2/1/erp-job-costs
- procorev2/procore-v2/1/direct-costs
- procorev2/procore-v2/1/external-data
- procorev2/procore-v2/1/standard-cost-codes
- procorev2/procore-v2/1/drawing-revisions
- procorev2/procore-v2/1/drawing-sets
- procorev2/procore-v2/1/project-documents
- procorev2/procore-v2/1/erp-transactions

ProjectSight v2

- projectsightv2/projectsightv2/1/portfolios
- projectsightv2/projectsightv2/1/prj-budgets
- projectsightv2/projectsightv2/1/prj-bgtcde-structs
- projectsightv2/projectsightv2/1/prj-bdg-groups
- projectsightv2/projectsightv2/1/prj-bdg-group-items
- projectsightv2/projectsightv2/1/erp-companies
- projectsightv2/projectsightv2/1/drawing-wf-status
- projectsightv2/projectsightv2/1/drawingsets-wf-sts
- projectsightv2/projectsightv2/1/lookuplistitems
- projectsightv2/projectsightv2/1/llt-project
- projectsightv2/projectsightv2/1/submittal-pkgs
- projectsightv2/projectsightv2/1/rfi-states
- projectsightv2/projectsightv2/1/submittal-states
- projectsightv2/projectsightv2/1/contract-types
- projectsightv2/projectsightv2/1/drawingsets
- projectsightv2/projectsightv2/1/drawings
- projectsightv2/projectsightv2/1/rfis
- projectsightv2/projectsightv2/1/submittals
- projectsightv2/projectsightv2/1/budget-states
- projectsightv2/projectsightv2/1/file-metadatas
- projectsightv2/projectsightv2/1/folder
- projectsightv2/projectsightv2/1/drawing-infos
- projectsightv2/projectsightv2/1/erp-projects
- projectsightv2/projectsightv2/1/erp-custs-vends
- projectsightv2/projectsightv2/1/pco-states
- projectsightv2/projectsightv2/1/po-states
- projectsightv2/projectsightv2/1/sco-states
- projectsightv2/projectsightv2/1/contract-states

## Step Inputs

In the Edit Step menu, you can add details about the step configuration as
                needed for your flow.

- Connector: Choose the connector whose data object you want
                          to write to the cache.
- Data Object: Choose the data object you want to write to the
                          cache.
- Use existing filters: Enable this setting to apply any
                          filter steps from earlier in the flow. If disabled, you can enter an
                          expression for the filter in the same way as in other flow steps. For
                          example, `return.flow.trigger.data.id;`.

                      Note: If no filters are available
                          for a particular data object, this flow step will trigger a full cache
                          write.

## Step Outputs

When the ![cache write flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/e3f16ad6-db25-48c3-9ad4-bfb3ee3b14c1.svg) Cache Write flow step runs, it updates your cache within App Xchange with the latest data from the
                defined data object.
