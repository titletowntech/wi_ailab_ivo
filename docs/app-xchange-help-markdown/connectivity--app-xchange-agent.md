# App Xchange Agent

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/app-xchange-agent
> Captured directly from rendered HTML: 2026-08-14

The Trimble
        App Xchange Agent is an essential tool that securely
        moves data between your systems and the App Xchange Platform. In this case, "On-Prem" means it must be on the
        same server as your target system, whether a cloud or local instance.

It is a key technical aspect of App Xchange’s integration solutions when working
            with certain connectors. This lightweight Windows service acts as a broker between the
                App Xchange cloud platform and a
            third-party database. It communicates with many kinds of databases, even those on a
            local server infrastructure, behind a firewall, and without web-based connectivity. It
            is essential for running many integrations in the Trimble Marketplace network.

The App Xchange Agent
            communicates with external platforms via private REST APIs and HTTPS web services to
            ensure all traffic is secure, encrypted, and authorized. Communications are packaged
            into encrypted packets, which are issued back to the platform via a response stream for
            efficient processing. It routinely monitors the cloud platform for instructions and
            automatically updates itself to the latest version. And because processing occurs on the
                App Xchange platform rather than the
            local environment, local resources are protected from expanded or inappropriate use.

The App Xchange Agent
            has modest system requirements and typically takes less than five minutes to
            install.

On the ![connectivity icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/e9b118a6-e6cc-43cf-89c6-e8a3e9ddd3a1.svg) Connectivity page, you can view v2 agents under the
                On-Prem Agents tab and
            installed v1 agents on the Legacy
                Agents tab.

If you control the machine that hosts your data, create a new on prem
            agent when you need to connect to App Xchange. Otherwise, follow connector specific
            documentation to get support from the appropriate cloud services.

When you create a new agent, give it a helpful name such as the
            intended Vista instance, computer or machine name.

Run PowerShell as as administrator on the desired machine, paste and
            run the install script. If you do not have access to the machine, you can select the top
            right x icon to exit and leave
            the agent awaiting setup.

The validate step will then show the agent online and ready for use in
            a connection.

        Important: The App Xchange Agent is currently being migrated from v1 to
            v2. During this migration, users must verify which agent version their connector
            supports in order to properly install an agent.

| Product |  |
| --- | --- |
| Vista Connector |  |
| Status | v2 |
| Foundation Connector |  |
| Status | v1 |
| Sage 100 Connector |  |
| Status | v1 |
| Sage 300 Connector |  |
| Status | v1 |

| Product | Status |
| --- | --- |
| Vista Connector | v2 |
| Foundation Connector | v1 |
| Sage 100 Connector | v1 |
| Sage 300 Connector | v1 |

## Install the App Xchange Agent
        v2 Locally

Follow these steps to install the App Xchange Agent v2 on a locally managed
        database.

If your database is
            hosted on a cloud instance, a support member from this service must complete these steps
            for you. You must be a database administrator to complete these steps.
1. Ensure that the server where the database is
                      hosted meets the minimum requirements for the App Xchange Agent.

  - Operating System: Windows Server
                                    2016 or newer
  - System Resources: The App Xchange Agent is lightweight and
                                    runs on any general-purpose server like AWS m5.large). It requires a
                                    stable, persistent connection to operate effectively.
2. Navigate to ![connectivity icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/e9b118a6-e6cc-43cf-89c6-e8a3e9ddd3a1.svg) Connectivity > On-Prem Agents and select Create
                          On-Prem Agent.The Add On-Prem Agent window
                      displays.
3. In the On-Prem Agent Name field,
                      enter a descriptive name (such as the intended Vista instance or computer name) then select Next.
                      Tip: This name is for
                          display purposes only and does not affect system logic.
4. Install the Agent via PowerShell 5.0 or
                      newer.
  1. Copy the provided installation script to
                                your clipboard.
  2. On your data server, D2 or equivalent, open Windows
                                PowerShell (or PowerShell ISE) using the Run as Administrator
                                option.
  3. Paste the script into the PowerShell
                                window and press Enter.
  4. Once the script finishes running in
                                PowerShell, return to the Add On-Prem Agent window and select Next.
5. Wait for the installation to validate then select
                          Done.
The App Xchange Agent is installed and displays on the On-Prem Agents tab. If its state is
                Online, it is ready to be
            used in a connection. If its state is Awaiting Setup, an error occurred or the process was exited
            early.

## Install the App Xchange Agent v1
        Locally

Follow these steps to install the App Xchange Agent on a locally managed database.

        If your database is
            hosted on a cloud instance, a support member from this service must complete these steps
            for you. You must be a database administrator to complete these steps.
1. Ensure that your server where the database is
                      hosted meets the minimum requirements for the App Xchange Agent.

  Operating System: Windows Server 2008 or
                          newer

  Architecture: X64 or x86

  .NET Framework: 4.7.2 or newer
                              (Recommended:[Download the latest version
                              recommended by Microsoft](https://dotnet.microsoft.com/en-us/download/dotnet-framework))

  System Resources: The App Xchange Agent is resource-efficient and
                          lightweight. Any general-purpose application server comparable to AWS EC2 M5
                          large is sufficient to host it. It just needs a stable connection that is
                          always up.
2. Check if the App Xchange Agent is already
                      installed on your server.
  1. In the server where the App Xchange Agent is installed, run the
                                Task Manager.
  2. Select the Services tab.
  3. Determine if the Int.Serv.Core.ConnectorService and Int.Serv.Core.ConnectorService.Monitor services are
                                running.

    - If neither service is present, proceed to the next step.
    - If either service is present, do not
                                          install the App Xchange Agent. Instead, create a Product Support case through the

      [Trimble Support
                                                  Center](https://my.trimble.com/s/contactsupport).

      Subject: Please split my App Xchange Agent

      Description:

      Hi, I have an App Xchange Agent that
                                                  needs to be split. Here is the server and new workspace
                                                  ID.

      Server: [Enter the name
                                                      of the application server your agent is installed
                                                      on]

      New integration workspace ID:
                                                      [Enter
                                                      the new integration workspace ID]

      Thank you.
3. Install the App Xchange Agent.
  1. Find your activation code by opening this
                                connector's workspace in App Xchange, selecting the workspace name or icon
                                below the horizontal workspace horizontal menu, and then scrolling down
                                to the Agent Info section. Record it for later.
  2. [Download the
                                    latest version of the App Xchange Agent here](https://api.xchange.trimble.com/portal/Download/ConnectorServiceInstaller).
  3. Move the .zip file to the server where the ERP is hosted.
  4. Install the App Xchange Agent by
                                following the instructions in the installation wizard. When prompted,
                                enter your activation code.
The App Xchange Agent is installed. It displays on ![connectivity icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/e9b118a6-e6cc-43cf-89c6-e8a3e9ddd3a1.svg) Connectivity > Legacy Agents.Once the App Xchange Agent is installed, or if you have any
            issues, follow up with the integration's deployment team so they can ensure the
            connection is successfully established.

## Restart the App Xchange Agent
        v1

Follow these steps when App Xchange Support prompts you to restart the App Xchange Agent.

        If a cloud service hosts your server, a support assistant
            from that service must complete these steps for you. If you host your server on-premise,
            you must be an administrator to complete these steps.
1. In the server where the App Xchange Agent is installed, run the Task Manager.
2. Select the Services tab.
3. Highlight the service named either
                          Int.Serv.Core.ConnectorService or Ryvit
                          Connector.
4. Select Restart.
5. Highlight the service named either
                          Int.Serv.Core.ConnectorService.Monitor or
                          Ryvit Monitor.
6. Select Restart.
The App Xchange Agent is restarted.
        Inform your support
            assistant.

## Run the App Xchange Agent v1 as a
        Local Admin

Follow these steps when App Xchange Support prompts you to elevate the permissions for your
            App Xchange Agent.

        If a cloud service
            hosts your server, a support assistant from that service must complete these steps for
            you. If you host your server on-premise, you must be an administrator to complete these
            steps.
1. In the Windows server where the App Xchange Agent is installed, run
                      Services.
2. Scroll down to find the following services:

  - Int.Serv.Core.ConnectorService (or Ryvit Connector)
  - Int.Serv.Core.ConnectorService.Monitor (or Ryvit Monitor)
3. Repeat the following steps for both services.

  1. Right-click the service and select
                                Properties.
                            The service's Properties window displays.
  2. Select the Log On tab and select the
                                    This account checkbox.
  3. In the This account field, enter the local
                                administrator username.
                            For example:
                                    `\Administrator` or
                                    `LocalMachineName\Username`
  4. In the Password field, enter the local
                                administrator password. Confirm the password.
  5. Select Apply then select
                                    OK.
4. In the Start Menu, open secpol.msc.
                  The Local Security Policy window displays.
5. Select Local Policies > User Rights Assignment.
6. Select Log on as a service.
7. Select Add User or Group... and add the local
                      administrator account.
8. Select OK.
9. In Services, right-click both services and select
                          Restart.
