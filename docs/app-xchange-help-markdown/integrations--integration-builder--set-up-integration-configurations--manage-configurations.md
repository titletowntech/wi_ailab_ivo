# Manage Configurations

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-builder/set-up-integration-configurations/manage-configurations
> Captured directly from rendered HTML: 2026-08-14

Whether you can edit a configuration depends on several
        factors, such as whether it is mapped to an integration or a flow, it is mapped to multiple
        integrations, the flow is published, or you have the correct permissions.

The following sections detail the specific fields you can edit and changes
                you can make to configurations.

## Manage Integration Configurations

You can add a new configuration to any integration configuration.

You can delete an integration configuration *only* if it is
                unmapped.

For all integration configurations, whether or not they are mapped to flow
                configurations, you can edit the fields as outlined in the table below.

Edit Permissions for Integration Configurations

| Can never change: |  |
| --- | --- |
| Key |  |
| Can always change: | Description |
| Can sometimes change: | Not Required to Required — only if configs are unmapped |
| Type |  |
| Can always change: | Title |
|  |  |
| Can always change: | Validation |
|  |  |
| Can always change: | Options |
|  |  |
| Can always change: | Required to Not Required |

| Can never change: | Can always change: | Can sometimes change: |
| --- | --- | --- |
| Key | Description | Not Required to                                         Required — only if configs are                                     unmapped |
| Type | Title |  |
|  | Validation |  |
|  | Options |  |
|  | Required to                                         Not Required |  |

## Manage Flow Configurations Mapped to Integration
                Configurations

You can add a new flow configuration, but you can
                publish the flow *only* if all active flow
                registrations have all required configuration values filled out.

You can delete a flow configuration only if it is *not* used in the published flow definition. Before
                deleting, you must remove any configuration mappings.

You cannot edit flow configurations mapped to an integration configuration
                from the flow builder. Edits are restricted because changes to flow configurations
                with multiple mappings would cause issues for all other mappings.

Edit Permissions for Mapped Flow Configurations

| Can never change: |
| --- |
| Key |
| Type |
| Description |
| Title |
| Required |
| Options |
| Validation |

| Can never change: |
| --- |
| Key |
| Type |
| Description |
| Title |
| Required |
| Options |
| Validation |

## Manage Flow Configurations Disassociated With an
                Integration

You can always create a new flow configuration if the flow is not used by
                an integration.

You can delete a flow configuration only if it is *not* used in the published flow definition.

For flows disassociated with an integration, you can edit fields as
                outlined in the table below.

Edit Permissions for Flow Configurations Disassociated With an
                    Integration

| Can never change: |  |
| --- | --- |
| Key |  |
| Can always change: | Description |
| Type |  |
| Can always change: | Title |
|  |  |
| Can always change: | Validation |
|  |  |
| Can always change: | Required |

| Can never change: | Can always change: |
| --- | --- |
| Key | Description |
| Type | Title |
|  | Validation |
|  | Required |
