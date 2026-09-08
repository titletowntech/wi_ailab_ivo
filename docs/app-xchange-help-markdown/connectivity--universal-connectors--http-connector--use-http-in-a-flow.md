# Use HTTP in a Flow

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/universal-connectors/http-connector/use-http-in-a-flow
> Captured directly from rendered HTML: 2026-08-14

The HTTP connector can be used in a connector action flow step
        to perform GET, POST, PUT, DELETE, or PATCH actions. You must properly configure the fields
        in the step details section regardless of which action you want to perform.

## Step Details

- Action Path: Enter the endpoint path for the API
                          action.
- Enable Retry Policy: This option is off by default. Toggle
                          this option on to set a schedule for retrying failed actions. In the Retry
                          Policy section, you define the error and program the flow step to run again
                          for a certain number of attempts, at a specific interval of time. For more
                          information, see [Retry Policy](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/connector-action-flow-step#concept-0878a520-e442-4c7e-864c-71dcc26aefd5--en__retry_policy).

## Configuration

- Wait For Response: This option is on by default. In general,
                      you want to keep Wait For Response enabled, as it pauses the flow and waits for
                      the action to complete before continuing to the next step.
- Use Existing Body: This option is off by default. When toggled
                      on, this lets you define properties in a previous flow step, and then point to
                      that other step (typically a map step). In other words, you use the existing
                      body of a previous step.
- RequestURL: A relative path to the resource, which will be
                      appended to the base URL input in the Connection of the HTTP Connector. For
                      example, if the base URL is https://api.example.com, the RequestURL for
                      https://api.example.com/v1/users/create would be v1/users/create.
- Headers: Enter any headers. Authorization-related headers
                      should be input in the connection of the HTTP connector. Enable Array Map
                      to transform arrays into key-value pairs for API requests.
- QueryParameters: Enter any query string parameters. Key and
                      value pairs will be URL encoded and appended to the request URL. Enable Array
                          Map to transform arrays into key-value pairs for API requests.
- RequestBodyParameters: Enter any properties related to sending
                      a request that includes a Body.
- Body: Enter request body content input as an object. This will
                      be sent using the encoding and content-type inputs.

## Example of a Successful Flow and Action Output

```javascript
{
  "result": {
    "StatusCode": 201,
    "IsSuccessStatusCode": true,
    "ResponseContent": {
      "id": 396,
      "task": "Demo Task",
      "priority": 1,
      "createdOn": "2024-11-05T17:00:20.2031584+00:00",
      "finishedOn": null,
      "groupId": 1
    }
  }
}
```

## Example of a Successful Executionwith a Failed Call

```javascript
{
  "result": {
    "StatusCode": 400,
    "IsSuccessStatusCode": false,
    "ResponseContent": {
      "error": "This failure happened…."
    }
  }
}
```

## Example of an Action Failure

```javascript
{
  "result": {
    "code": "BadRequest",
    "user_defined_code": null,
    "errors": [
      {
        "text": "is required and was null or empty.",
        "source": [
          "RequestURL"
        ],
        "details": null
      }
    ]
  }
}
```
