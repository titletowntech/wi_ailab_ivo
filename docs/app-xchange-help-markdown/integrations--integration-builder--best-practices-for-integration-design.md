# Best Practices for Integration Design

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-builder/best-practices-for-integration-design
> Captured directly from rendered HTML: 2026-08-14

There are many benefits to being thorough during the integration design phase. Proper strategizing increases alignment between the integration builder and the end users, identifies potential function gaps, and minimizes costly backtracking.

Consider these key questions and prompts to help align expectations among stakeholders and develop a clear roadmap for your integration.

## Key Considerations

            1. Integration Purpose
- Define the scope and objectives of the integration.
                              Start small and build towards larger goals.
- Consult with an end user of the products or software
                              to account for *actual* use cases and identify hidden human
                              processing that might occur in current procedures.
- Is the integration designed for one end user or many?
                              If many, you may wish to make it more configurable.
- Be very detailed:
  - Exactly what data do you need to get out of
                                        system A?
  - Exactly what data do you need to move into
                                        system B?
  - Exactly what data do you need to get out of
                                        system B?
  - Exactly what data do you need to move into
                                        system A?
  - Do you need additional supporting data? For example, Vendors in
                                        Vista can be associated with tax information as well, if mapping
                                        Vendors from another system, do you have that data if
                                        needed?
  - What is the direction of the sync? Is it one-way or two-way?
                                        Which system is the source of truth?
  - Are any enhancements needed? If so, request them from App Xchange early.

2. Object Level Mapping, for example Vendors
                    >>> Vendors

- Complete a high-level mapping of the objects that need to be moved between
                          system A and system B indicating the direction of the eventual data
                          flow.

3. Field or Property Level Mapping, for example
                    CompanyID >>> VendorID

- Complete any mapping of properties and dependencies identified in the
                          high-level object map.

4. Scope and Connectivity
                    Questions

- Can existing connectors provide all necessary connector objects, actions, and endpoints?
- If not, can you use the HTTP connector?
- If neither an existing connector nor the HTTP connector is sufficient, do
                          you need to build a connector using the Connector SDK?
  - Is there a public API to support that, with
                                    supported authentication and all needed endpoints?
  - What is the minimum viable product state?

5. Flow usage

- Consider your flow usage to avoid excessive costly flow
                          runs. You can estimate your usage based on the frequency and nature of
                          updates to your target system.
- The number of flow runs is determined by how often your flows are triggered,
                          which in turn is influenced by your flow trigger definitions, the volume of
                          data generated, and the regularity of data updates.

## Example Object Map

The following is a sample Integration Template between Trimble
                products Trimble Pay (formerly named Flashtract) and Vista:

| FlashTract |  |
| --- | --- |
| List of Vista Projects |  |
| Direction | <<< |
| Vista | JC Jobs |
| Notes | seed historical Filter: Open, Soft Closed that started less than 2 years ago as they are added |
| Projects |  |
| Direction | <<< |
| Vista | JC Jobs |
| Notes | updates only for linked Flashtract Projects |
| Organizations |  |
| Direction | <<< |
| Vista | AP Vendors |
| Notes | seed no historical create as subcontracts are added update anything that is integrated |
| Contracts |  |
| Direction | <<< |
| Vista | SL/PM Subcontracts |
| Notes | seed all for project when project is linked as they are added for linked projects erp_commitments (accounting lines) - This is where Vista SL items go contract_items (sov entries created by the user or Flashtract system NOT THE INTEGRATION) updatable until the first invoices is added |
| Change Orders |  |
| Direction | <<< |
| Vista | SL/PM Change Orders |
| Notes | seed all for project when project is linked as they are added for linked projects Grouping mechanism for contract items for the change order Problem with existing item updating actions in vista |
| Approved Subcontract Invoices |  |
| Direction | >>> |
| Vista | AP Invoices |
| Notes | Will include an Array of documents that are expected to attach to the invoices (header) in Vista |

| FlashTract | Direction | Vista | Notes |
| --- | --- | --- | --- |
| List of Vista Projects | <<< | JC Jobs | seed historicalFilter: Open, Soft Closed that started less than 2 years agoas they are added |
| Projects | <<< | JC Jobs | updates only for linked Flashtract Projects |
| Organizations | <<< | AP Vendors | seed no historicalcreate as subcontracts are addedupdate anything that is integrated |
| Contracts | <<< | SL/PM Subcontracts | seed all for project when project is linkedas they are added for linked projectserp_commitments (accounting lines) - This is where Vista SL items gocontract_items (sov entries created by the user or Flashtract system NOT THE INTEGRATION)updatable until the first invoices is added |
| Change Orders | <<< | SL/PM Change Orders | seed all for project when project is linkedas they are added for linked projectsGrouping mechanism for contract items for the change orderProblem with existing item updating actions in vista |
| Approved Subcontract Invoices | >>> | AP Invoices | Will include an Array of documents that are expected to attach to the invoices (header) in Vista |

## Example Field Map

Each object is followed by a field map, such as this one for
                adding a Vista Project to Trimble Pay (formerly named Flashtract) Project:

| To Field Names |  |
| --- | --- |
| time_zone |  |
| Required | no |
| Description | Timezone in which the job is located. If this value is not provided, Flashtract will default/derive value |
| name |  |
| Required | yes |
| Field Mapping | Job.Description or "<No Description in Vista>" |
| Description | Name of the job |
| project_number |  |
| Required | yes |
| Field Mapping | Job.Job |
| Description | Number of the job in ERP Ex: Commercial, Residential, etc. If value is not provided, Flashtract will default. Since this value is an ENUM for Flashtract, we will derive the closest option based on what is set in Vista |
| project_type |  |
| Required | no |
| owner_name |  |
| Required | yes |
| Field Mapping | Customer.Name or "<Not Provided>" |
| Description | Owner of the job (ex: City of Atlanta) |
| is_archived |  |
| Required | yes |
| Field Mapping | !(Job.JobStatus == 1 or (Job.JobStatus == 2 and Treat Vista Soft Closed Jobs as Open == true)) |
| Description | Whether or not the job is active |
| erp_project_id |  |
| Required | yes |
| Field Mapping | Job.JCCo + "-" + Job.Job |
| Description | Id of the job in ERP system |
| address_line1 |  |
| Required | no |
| Field Mapping | Job.ShipAddress or "<Not Provided>" |
| Description | Address line one of the job's location |
| address_line2 |  |
| Required | no |
| Field Mapping | Job.ShipAddress2 |
| Description | Address line two of the job's location |
| city |  |
| Required | no |
| Field Mapping | Job.ShipCity or "<Not Provided>" |
| Description | City of the job's location |
| state |  |
| Required | no |
| Field Mapping | Job.ShipState or "AL" |
| Description | State of the job's location. Needs to be the abbreviation. Ex. FL |
| zipcode |  |
| Required | no |
| Field Mapping | Job.ShipZip or "00000" |
| Description | State of the job's location |
| county |  |
| Required | no |
| Field Mapping | "<Not Provided>" |

| To Field Names | Required | Field Mapping | Description |
| --- | --- | --- | --- |
| time_zone | no |  | Timezone in which the job is located. If this value is not provided, Flashtract will default/derive value |
| name | yes | Job.Description or "<No Description in Vista>" | Name of the job |
| project_number | yes | Job.Job | Number of the job in ERP Ex: Commercial, Residential, etc. If value is not provided, Flashtract will default. Since this value is an ENUM for Flashtract, we will derive the closest option based on what is set in Vista |
| project_type | no |  |  |
| owner_name | yes | Customer.Name or "<Not Provided>" | Owner of the job (ex: City of Atlanta) |
| is_archived | yes | !(Job.JobStatus == 1 or (Job.JobStatus == 2 and Treat Vista Soft Closed Jobs as Open == true)) | Whether or not the job is active |
| erp_project_id | yes | Job.JCCo + "-" + Job.Job | Id of the job in ERP system |
| address_line1 | no | Job.ShipAddress or "<Not Provided>" | Address line one of the job's location |
| address_line2 | no | Job.ShipAddress2 | Address line two of the job's location |
| city | no | Job.ShipCity or "<Not Provided>" | City of the job's location |
| state | no | Job.ShipState or "AL" | State of the job's location. Needs to be the abbreviation. Ex. FL |
| zipcode | no | Job.ShipZip or "00000" | State of the job's location |
| county | no | "<Not Provided>" |  |
