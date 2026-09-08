# Glossary

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/glossary
> Captured directly from rendered HTML: 2026-08-14

These terms apply to Trimble App Xchange.

## action

Actions are implemented by connector builders. They are typically a variation on
                writing or changing data on the target system, such as Update, Insert, Delete, etc.,
                but this could also be a single item GET or other use cases.

## action handler

The action handler manages the work of an action processor, which includes logging
                status outcomes, updating the cache as necessary, etc.

## action object

Implemented by connector builders, the action object is related to real-time action
                processing (RTAP) configuration. It contains an input object type, an output object
                type, and an action failure type, which include important details about the
                action.

## action processor

Executes an action as programmed by the connector builder, typically to modify data
                on the target system (such as upsert, delete, etc.). Action processors are located
                under Jobs and Services.

## API

Application Programming Interface. An API enables different computer applications to
                communicate by acting as an intermediary between them. App Xchange connectors typically leverage the API of a connected
                product, database, or application to enable the transfer of data between it and the
                    App Xchange platform.

## App Network

A network of application interfaces. The App Network connects external applications
                to the App Xchange platform via
                connectors that typically use APIs. These connectors act as clients of the external
                APIs and have internal APIs for normalizing data between those applications. This
                includes features like caching and standardized API endpoints.

## cache

The store of data associated with an application or connector. Often used with change
                detection to trigger flows. For more information, see [Cache](https://help.trimble.com/doc/app-xchange/app-xchange/getting-started/key-concepts#concept-fd11042c-1c39-4c41-b02d-a0af679b8660--en__cache_section) in Key Concepts.

## cache writer

A service implemented by connector builders, which is typically run on a schedule to
                update the cache with data from the target external product or system.

## CLI

Command Line Interface. This is used to call `xchange` commands and generate connector template code when building a
                connector using App Xchange's [SDK Documentation](https://trimble-xchange.github.io/connector-docs/).

## connection

A definition is built into a connector to outline exactly what a user needs to
                connect the connector to a product or application. In these cases, App Xchange leverages that definition to
                enable certain features and behaviors on the platform, like different types of
                authentication or testing connections before executing the flows that depend on
                them. For more information, see [Connections](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/connections).

## connector

An intermediary between the App Xchange
                platform and an external product, database, or application. Connectors enable
                integrations to be built by facilitating interactions with those products or
                applications, typically by making API calls.

## data object

The formal definition of data on App Xchange, defined by connector builders. A data object does
                not have to be a direct recreation of the external database; for example, it may add
                or strip metadata, optional fields, etc.

## data reader

In connector building, the name of the C# class in connector code that reads data and
                enables a cache write on the platform. For more information, see [Reading Data](https://trimble-xchange.github.io/connector-docs/guides/reading-data/) on the App Xchange Connector SDK documentation.

## endpoint

A URL leveraged by a client to interact directly with an API. App Xchange provides the OpenAPI description
                (OAD) of each module, object, and action in a connector to provide a quick view of
                coverage and capabilities. In general, the API and documented endpoints are used
                internally by the platform and not directly by end users.

## flow

A flow is the primary tool for automating business processes in
                    App Xchange. It uses a trigger and
                a sequence of configurable steps to enable the transformation and transfer of data
                between systems. It is the central component of an integration. For more
                information, see [Flows](https://help.trimble.com/doc/app-xchange/app-xchange/flows).

## job

The work done by a connector within an integration. It includes the services that are
                part of the integration and the schedule to move the data.

## module

An organizational grouping in App Xchange to collect data objects. Implemented by connector builders, there may be one or
                many modules depending on the system the connector interacts with.

## OAuth client

An application that makes requests to a resource server (such as an API) on behalf of
                a user. It is part of the OAuth protocol, a framework for authorization that enables
                third-party applications to obtain limited access to an HTTP service. The client
                typically needs to be registered with the authorization server to obtain an OAuth
                client ID and secret, which are used to authenticate the client to the server. The
                client uses the OAuth tokens received from the authorization server to access
                protected resources. For more information, see [OAuth Clients](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/oauth-clients).

## Real Time Action Processing (RTAP)

A feature that enables connector actions to run in real time as they are called by
                flows. Actions with Real Time Action Processing do not require scheduled action
                processor services to be added to the workspace or integration. Connector builders
                should leave this enabled by default.

## schema

The foundational blueprint that defines how data is structured and
                organized within a system. Every connector has its own schema that defines how data
                is formatted and exchanged between systems. Connector schemas include validations,
                such as Type and Required, and
                informative metadata such as Name and
                    Description.

## SDK

Software Development Kit. This is a collection of tools and libraries that allow
                developers to create applications for App Xchange. In particular, it enables developers to build [connectors](https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/connectors) on
                the platform.

## services

The primary service types on App Xchange
                are [action processors](https://help.trimble.com/doc/app-xchange/app-xchange/glossary#task-6d078b8b-f2f3-4da6-ab91-65602513eed7--en__action_processor) and [cache writers](https://help.trimble.com/doc/app-xchange/app-xchange/glossary#task-6d078b8b-f2f3-4da6-ab91-65602513eed7--en__cache_writer).
