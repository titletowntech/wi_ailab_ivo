# Object Record Detail

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/data-explorer/cache-explorer/object-record-detail
> Captured directly from rendered HTML: 2026-08-14

The Record Detail page allows you to view activities related
        to a given record, including actions, triggered flows, and work requests.

You can access the Record Detail page by selecting a cache object in
            the cache explorer and choosing a result. You can also access them directly through the
                [Flow Data tab](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-management/flow-run-information/flow-data-tab).
            Reviewing these activities helps users to troubleshoot a flow if something goes wrong.
            The record detail page also shows relationships between records defined by a [Relate
                Data Objects flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/relate-data-objects-flow-step).

        Note: If you are the flow author, you can toggle
            whether hidden values are visible in the cache and action explorers via the eye icon Hidden values include
            personally identifying information and financial information.

The Actions tab shows detailed views
            of what actions happened with the object.

The Triggered
                Flows tab displays any flow instances that were triggered by this cache
            record, as well as summary information about them. You can also navigate directly to a
            linked flow or run a detail view of the flow. Triggered flows that have a batch icon are
            part of a work request batch.

If a record was created by a Cache Event Trigger with a filter expression, the
                Filtered Flows tab displays any flow instances that were
            skipped by a Cache Event Trigger's filter expression. For more information, see [JavaScript Trigger Filters](https://help.trimble.com/doc/app-xchange/app-xchange/flows/triggers/add-a-cache-event-trigger#concept-67bc1ab5-a762-495d-bcef-294db7d9ef2c--en).

The Work
                Requests tab displays a timeline of work requests that were created or
            modified with the record that you’re viewing. You can track down the details of the
            batch that did the processing instead of having to manually check each batch that ran
            against the cache object. The most recent data is listed first. If it’s a batch work
            request, you have the ability to view the related flows from the flow drop down menu.
            You can also see these batch flows from the Triggered Flows tab.

The flows timeline also allows you to navigate directly to a linked flow by
            selecting Go to Flow or run it from the detail view by selecting Run
            now.

Also, a cache record may be associated with more than one flow. It doesn’t
            happen often, but when it does, you can choose which flow you want via the dropdown. The
            dropdown is only shown when there are multiple associated flows.

## View a Data Object's Related Records

You can view the related records defined by the flow steps for
        any data object. Open it in a new tab if you don’t want to leave the record details for the
        object.

1. In either the Workspace Cache or Flow Data Cache
                      page, select an object from the results list and choose the Related
                          Records tab in the right pane. All related objects
                      display.

                      Note: You cannot select Related Records if the object does
                          not have any related records.
2. Select the object to see its cache object records.
3. Use the link in the Related Records list to return
                      to your initial data object.
