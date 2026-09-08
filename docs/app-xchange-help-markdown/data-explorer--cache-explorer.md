# Cache Explorer

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/data-explorer/cache-explorer
> Captured directly from rendered HTML: 2026-08-14

Use the Cache Explorer to view the actual data within App Xchange.

The cache explorer allows you to check specific records to
            see if they made it into the system and compare record counts between App Xchange and source or destination systems.
            It is a useful tool for troubleshooting.

The cache explorer only displays records for the connectors
            used in integrations associated with your workspace. These records come in two
            varieties: Workspace Cache and
                Flow Data.

## Workspace Cache

The workspace's ![cache explorer icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/a43dbd04-a23b-4bb9-9584-8bfae00211f9.svg) Cache Explorer tab, also just called Cache, allows you to focus on one object to view. It
                displays a table view of all data records for the selected object. Select a record
                to see its [Object Record Detail](https://help.trimble.com/doc/app-xchange/app-xchange/data-explorer/cache-explorer/object-record-detail).

For more information, see [Workspace Cache](https://help.trimble.com/doc/app-xchange/app-xchange/data-explorer/cache-explorer/workspace-cache).

## Work Request Tab

The Work Request tab of the [Object Record Detail](https://help.trimble.com/doc/app-xchange/app-xchange/data-explorer/cache-explorer/object-record-detail) page displays a timeline of work requests
                that were created or modified with the record that you are viewing. You can track
                down the details of the batch that did the processing instead of having to manually
                check each batch that ran against the cache object. The most recent data is listed
                first.

For batch work requests, you can view the related flows
                from the flow dropdown menu. You can also see these batch flows from the Triggered
                Flows tab.

## Flow Data Cache

The Flow Data Explorer is found in the Data tab when viewing a
                flow. It works similarly to the workspace's ![cache explorer icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/a43dbd04-a23b-4bb9-9584-8bfae00211f9.svg) Cache Explorer.

For more information, see [Flow Data Cache](https://help.trimble.com/doc/app-xchange/app-xchange/data-explorer/cache-explorer/flow-data-cache).

## Why is My Data Not in the Cache Explorer?

There are several reasons your data may not appear in
                either cache:

- The connector was not configured correctly.
- Permissions in the external system (like
                              Vista or Spectrum) do not exist or are
                          not correct for the connector.
- The cache writer is not the correct cache writer
                          and the author is using an older cache writer.
- If the cache writer is dependent on a flow, the
                          flow may be authored wrong.
- You did not bring in the project or portfolio
                          first and there is no way for the flow to identify which project or
                          portfolio to cache write from.
