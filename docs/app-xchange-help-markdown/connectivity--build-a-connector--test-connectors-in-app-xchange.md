# Test Connectors in App Xchange

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/build-a-connector/test-connectors-in-app-xchange
> Captured directly from rendered HTML: 2026-08-14

This topic provides information on testing endpoints for a
        newly developed connector on the platform.

Before testing a connector in App Xchange, you need a workspace with an active and working
            connection to the external system for which your connector is built. You should also
            have already read the following sections of the help documentation:

- [Administration](https://help.trimble.com/doc/app-xchange/app-xchange/administration/your-app-xchange-account)
- [Connectivity](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/connectors)
- [Flows](https://help.trimble.com/doc/app-xchange/app-xchange/flows)
- [Jobs and Schedules](https://help.trimble.com/doc/app-xchange/app-xchange/jobs-and-schedules)
- [Data Explorer](https://help.trimble.com/doc/app-xchange/app-xchange/data-explorer/cache-explorer)

See [Testing a Connector
                Locally](https://trimble-xchange.github.io/connector-docs/guides/local-testing/) in the Connector SDK for instructions on local testing, which should
            also be completed before deployment.

## Test a Cache Writer (Data Reader)

Cache writers or data readers read and replicate data from a
        connected system. When testing, you must perform the following verifications.

1. Confirm the replicated data is in an accurate
                      state concerning value equality and formatting.
2. Confirm all the data representing this object is
                      present when read from the connected system. Consider the following
                      questions.

  - Should empty properties be written as null or not written
                                    at all?
  - Does the connected application allow for custom fields or
                                    fields to be renamed? Are those written correctly when present?
  - Are any fields sent conditionally based on the values of
                                    other properties? If so, you must test all variations.
3. Confirm all read types are handled correctly. This
                      includes:

  - Adding a new record.
  - Updating an existing record.
  - Deleting an existing record.

## Verify a Cache Writer

Use this test plan to ensure all necessary scenarios have been
        tested. Follow these steps to verify a cache writer.

1. Run the cache writer once to verify a complete
                      write of the data in the connected system. For information about how to create
                      and run a service, see [Services](https://help.trimble.com/doc/app-xchange/app-xchange/jobs-and-schedules/services).

  1. In [Job History](https://help.trimble.com/doc/app-xchange/app-xchange/jobs-and-schedules/job-history), confirm the count expected is the same as
                                the logs and that there are no errors.
  2. Verify the objects display as expected in
                                the Data Cache Explorer.
2. Confirm that the cache writer picks up new objects.

  1. Add a new object in the connected system (after the initial cache
                                write).
  2. Verify the object displays correctly in the job history logs.
  3. Verify the object displays correctly when viewing the record in the
                                Data Cache Explorer.
3. Confirm that the cache writer picks up changes to existing objects.

  1. Update an existing object in the connected system. Verify that it is
                                detected as an update in the cache writer and verify the change in the
                                Data Cache Explorer.
  2. If a change in the connected system can affect others, verify that the
                                change is detected in all systems.
4. Confirm that the cache writer removes deleted objects.

  1. Delete an existing object (or the new one you created above).
  2. Verify the object is deleted in the logs.
  3. Verify the object is no longer present in the Data Cache
                                Explorer.

## Test an Action Processor

Action processors write data to a connected system. To run an
        action processor, use the ![Connector Action flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/55ea75b4-e53b-4201-92e5-1bcb588a542d.svg) Connector Action flow step. Afterward, test the action output by verifying the following details. These checks
        should be run for every new action processor added to a connector.

1. Verify the action outputs look correct in the run
                      history.
2. Verify the logs look correct in the ![Job History icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/02d2e899-a51b-47cb-b3dd-8aff9c5df5ca.svg) Job History > Not Scheduled tab of your integration.
3. Verify the object displays correctly in the data
                      explorer.
4. Verify any changes are reflected correctly in the
                      connected system.
5. For each connector action type, verify any changes
                      are reflected correctly in the connected system.

  1. Adds (adding one or more objects into the connected system, will fail
                                if an object matching the key exists):

    1. Verify all variants of key value references used by the action
                                          correctly detect matches in the connected system. They should
                                          either create a new object successfully or fail gracefully if
                                          that is the expected result.
    2. Verify that defaulting logic
                                              works correctly when submitting an object with only the
                                              minimum required fields filled (the minimum data set).
    3. Verify that all properties are
                                              sent correctly when filling out all possible fields (the
                                              maximum data set).
    4. Verify the functionality of any
                                              custom validation or defaulting logic written into the
                                              action processor (rather than being handled by the connected
                                              system’s API).
  2. Changes (updating one or more objects in the connected system will fail
                                if no object matching the key exists in the connected system):

    1. Verify all variants of key value
                                              references used by the action correctly detect matches in
                                              the connected system and either successfully update the
                                              referenced object or fail gracefully when no object matches
                                              the provided key.
    2. Verify that defaulting logic
                                              works correctly when submitting an object with only the
                                              minimum required fields filled (minimum data set).
    3. Verify that all properties are
                                              sent correctly when filling out all possible fields (maximum
                                              data set).
    4. Verify the functionality of any
                                              custom validation or defaulting logic that was written into
                                              the action processor (rather than being handled by the
                                              connected system’s API).
  3. Upserts (a hybrid action that can be used for both add and change
                                actions; will add rather than fail if no object in the connected system
                                matching the key exists):

    1. Verify all variants of key value
                                              references used by the action correctly detect matches in
                                              the connected system. Key value references should either
                                              update an existing object or add a new one, depending on
                                              whether an existing object matching the key existed prior to
                                              running the action.
    2. Verify that the defaulting logic
                                              works correctly when submitting an object with only the
                                              minimum required fields filled (the minimum data set).
    3. Verify that all properties are
                                              sent correctly when filling out all possible fields (the
                                              maximum data set).
    4. Verify the functionality of any
                                              custom validation or defaulting logic that was written into
                                              the action processor (rather than being handled by the
                                              connected system’s API).

                                Note: For upserts, the above tests need to be run
                                    for both adding new objects and updating existing objects.
  4. Deletes (removing the object that matches the provided key values from
                                the connected system):

    1. Verify all variants of key value
                                              references used by the action correctly detect matches in
                                              the connected system.
  5. Refresh Cache (running the cache writer from within in a flow rather
                                than from a scheduled run of the service):

    1. Verify that the cache writer
                                              runs correctly. Perform all checks referenced in the Testing
                                              Cache Writers (Data Readers) section of this page.

## Automate Testing with Flows

Whenever you modify an action processor or cache writer, you
        should run the Test an Action Processor steps again. This is
        especially important when updating endpoints that are already in use. To help reduce the
        time needed to regression test changes to existing endpoints, much of the above can be
        automated using the following pattern in flow:

1. Use a ![Connector Action flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/55ea75b4-e53b-4201-92e5-1bcb588a542d.svg) Connector Action flow step to run the
                                          action processor. Seed this step with data and logic as
                                          necessary to allow it to be rerun (on demand or a schedule)
                                          without changes and successfully execute each time.
2. Use a ![Lookup flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/bd42191a-44f4-46fa-8ef5-0c3be2cf51aa.svg) Lookup flow step to look up the record by its key value in the cache.
                                          Expect exactly one object matching the key to be present.
                                          This also provides testing of the cache writer, as this
                                          object gets written to the cache from the connected system
                                          after insertion. In other words, this is a representation of
                                          the object as it exists in the connected system.
3. Use an ![Assertion flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/365c8742-d631-4b6e-85f2-5a0e39d9c462.svg) Assertion flow step to test various expectations about the object’s data
                                          state that should be true. It is recommended to test every
                                          property.
