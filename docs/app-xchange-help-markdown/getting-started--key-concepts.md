# Key Concepts

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/getting-started/key-concepts
> Captured directly from rendered HTML: 2026-08-14

App Xchange is a
        powerful tool with many interdependent components. It is important to understand the
        function of each component and how they interact with one another.

This image represents a simplified overview of how data moves through
            the ecosystem. Review the key concepts below to better understand the specific role that
            an individual component of the platform fulfills.

        ![App Xchange platform overview](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/d793643e-15e4-4b5f-a3ff-9504ced41e47.png)

## Integrations

Integrations are one of the two primary ways the App Xchange platform enables users to move
                data. They rely on connectors, flows, and jobs to retrieve, transform, and move data
                between systems.

Integrations are defined containers comprised of connectors,
                flows, and jobs (and their constituent parts). They are configured to move data
                between connected products or applications. While integrations can be custom-built,
                their primary purpose is to share resources across multiple workspaces and contexts.
                For single workspace solutions, you would instead use an automation.

## Automations

Automation workspaces is the other primary way the App Xchange platform enables users to move
                data. Although the required skillsets between automations and integrations overlap
                in many areas, they have key differences.

Automations are automated workflows between different software
                systems, which can be customized to filter, combine, extract, or group data along
                the way. These are typically customized data transfer solutions for a single
                company. They primary live in an automation workspace.

## Workspaces

A workspace is where a given integration or automation lives. It
                is also how App Xchange tenants (or
                separates) data. A team can collaborate, build flows and integrations, and schedule
                jobs within the workspace.

## Connectors

Connectors power an integration's ability to interact with
                external products, databases, or applications. In other words, they act as the
                intermediary between the App Xchange
                platform and the external product. Any external product with a connector on the
                platform can share data with any other connected product, A connector is NOT an
                integration or a flow. Instead a connector is best thought of as a layer that allows
                    App Xchange to call an external
                API, as well as defining the data objects, cache writes, and actions available.

Connectors support a wide range of business functions across many
                departments. They are configured on a per-customer basis.

You can find more information about publicly-available connectors
                on the [Trimble Connector Directory](https://appxchange.trimble.com/connectors) or read more in our
                    [connectivity](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/connectors) documentation.

## Flows

Flows are the central component of an App Xchange integration. They enable the
                transfer of data from one connector to another and the transformation of data
                between connectors. A flow can be private or shared. A private flow is only visible
                to the users of the workspace where it was created. A shared flow can be used by
                integrations that you deploy to your customers. Flows can be simple or very complex.
                They are a powerful tool when trying to solve the problem of data interoperability.
                Flows must have two essential components:

- A trigger
                          event: An action that occurs in the external system, which then
                      causes a flow to run. For example, a trigger event could be creating a new
                      change order or updating an employee's phone number. App Xchange detects the action and
                      starts running the flow.
- Steps: Operations that process once a trigger event occurs.
                      Steps are a series of commands that execute in order and perform a specific set
                      of functions. Steps are not linear and can follow many paths. They can even
                      branch and loop back to previous steps.

## Cache

            App Xchange maintains
                a cache of stored data to avoid redundant data transfer and enable change detection.
                By caching external application data in App Xchange, you can quickly view, filter, access, and manipulate
                the data. You can create a flow to trigger when there is a cache event (a change to
                cached data) to automatically do something with these changes, such as send the data
                to another system. The cache can be modified in several different ways.
- Cache Write as a [service](https://help.trimble.com/doc/app-xchange/app-xchange/jobs-and-schedules/services)
- Update the cache as part of a flow:
  - Update cache on [connector action](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/connector-action-flow-step) close out (upsert,
                                    delete, POST, PUT, PATCH, etc.)
  - Connector-specific actions to update the cache
                                    like Refresh Cache or GET
  - The [Cache Write Flow Step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/cache-write-flow-step)

The standard approach when using the platform is to use the cache
                write service to keep the cache up to date with data from the connected application.
                Other methods of modifying the cache are highly context-specific.

## Jobs

Jobs are the work done by a connector within an integration. Jobs
                comprise both services and schedules.

## Services

            Services are the components of an integration that move data
                between external systems and App Xchange. They do this in one of two ways:
- Cache
                              writer service: Gets data from the source system and copies
                          it into the App Xchange
                          platform.
- Action
                              processor service: Typically sends data from App Xchange to the target
                          system.

Services process the actions that are queued from a flow.
                Services are specific to each connector. For more information, see [Services](https://help.trimble.com/doc/app-xchange/app-xchange/jobs-and-schedules/services).

## Cache Writer Services

App Xchange maintains
                a cache of stored data to avoid redundant data transfer. When a user creates,
                updates, or deletes external application data, that change is mirrored in
                    theApp Xchange cache. You can
                create a flow to trigger when there’s a cache writing event to automatically pick up
                these changes. By caching external application data in our platform, you can more
                quickly compare the data between those applications to identify any differences on
                which to base triggering an on-demand flow.

The App Xchange
                Network also further reduces data transfer redundancy by using a change detection
                system, which will only send new data to the cache.

## Action Processor

Action outcomes may also cache write data to ensure the cache
                stays in sync with data changes instead of waiting for a scheduled cache write.
                While this is best practice, it is the responsibility of the connector developer to
                program the action outcome, and it may not be in use for your cached data.

## Schedules

Schedules define when and how an integration runs. They determine
                the sequence of services and on-demand flows that move data between App Xchange and external systems.
