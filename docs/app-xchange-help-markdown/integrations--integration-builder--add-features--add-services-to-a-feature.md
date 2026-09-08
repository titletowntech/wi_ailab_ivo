# Add Services to a Feature

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-builder/add-features/add-services-to-a-feature
> Captured directly from rendered HTML: 2026-08-14

After adding a feature, you can add services to the feature to handle the input and output of data between App Xchange and other applications.

Identify the connectors for your integration before
            adding a service to a feature. There will be services available in the list that are not
            related to your connector. As a flow author, you must understand these connectors and
            the data mapping between systems. To learn about the connectors associated with your
            integration, view the OpenAPI documentation for the different modules. For more
            information, see [Services](https://help.trimble.com/doc/app-xchange/app-xchange/jobs-and-schedules/services).
1. Select ![integration builder icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/1c7a8835-4b43-44d9-b185-65f81e433104.svg) Integration Builder and open the appropriate integration.
2. Select the ![Features icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/5e698285-0c3d-409a-837c-7adeaa044a56.svg) Features tab and open the feature you want to
                      add a service to.
3. In the Service Configurations section, select Add Service.
       Note: You typically only have to add cache write services, as actions are
                          handled via [Real Time Action Processing (RTAP)](https://help.trimble.com/doc/app-xchange/app-xchange/glossary#task-6d078b8b-f2f3-4da6-ab91-65602513eed7--en__RTAP).
4. Choose to add either a New or Existing service.

  - New: A service
                                associated with the connectors on the integration and independent of any
                                other services already added.
  - Existing: A
                                service that has already been added to an integration, likely on a
                                different feature.

                  When possible, add existing services, as you don’t want to define two different services that process the same data.
5. Depending on the service type, fill in the
                      following fields:

  1. For a New service:

    - Service:
                                          Choose a service from the dropdown list. These services populate
                                          based on the connectors added to the integration. Services are
                                          named as follows: ConnectorName/Module/ServiceType. Note: You would only
                                              add a Cache Writer service to a feature. Action Processors
                                              are added automatically within a workspace when a flow is
                                              run that creates an action.
    - Description:
                                          Enter information about the service, such as the kind of data
                                          being cache written.
  2. For an Existing
                                service:

    - Service:
                                          Choose a service from the dropdown list. This list is limited to
                                          the services that already exist in features added to your
                                          integration.
6. Select Save.
7. Open the newly created service to configure it.The Edit Service Configuration window opens. In the top
                      section, you can edit the following fields:
  - Edit the service Description, if needed.
  - Make the service into a Template. This allows different customers across
                                workspaces to reuse the service but customize it to fit the needs of
                                their specific integrations.

    This works similarly to a flow template -
                                    after initial sync or deployment, changes to this service
                                    configuration will *not* overwrite
                                    previous values or changed configurations at the workspace
                                    level.

  Beneath these fields, there are a variety of data objects listed. These data objects
              are specific to the service you chose (and the service is based on the connector).

  1. Toggle on the data type you want to add to the service.Important: Only enable *one* data type per
                      service.
  2. Select Save.
8. Add another service if you need to add another data type.Important: Do not add the same service to a
                          feature more than once.
9. To remove a service from a feature, select the Delete icon to the right of the service in the Service Configurations section of the Features page.
The service is added to the integration feature.
            Next, you can add a flow to the feature. For more details, see [Add Flows to a Feature](https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-builder/add-features/add-flows-to-a-feature).
