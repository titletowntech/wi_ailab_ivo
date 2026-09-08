# Build EDI Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/build-edi-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![build edi flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/a0f89d51-e4d3-468d-8d88-135075b517bc.svg) Build EDI flow step to transform data into an EDI document.

This step takes envelope data and a list of transactions and transforms it all
            into an EDI string. This is useful when a particular target system only accepts EDI.

This flow step requires a basic understanding of EDI purpose
            and structure. For more information on EDI, refer to [What is EDI?](https://www.ibm.com/think/topics/edi-electronic-data-interchange) on
            IBM.com.

These are the necessary fields needed to build a simple EDI
            document.

## Separators

Before filling out any data, decide which separators to use for your EDI
                document. The two most important separators are the element separator and the
                    segment terminator.

Here is an example EDI snippet:

```javascript
NM1*John*Doe~
BGN*Example*~
```

In this, the element separator is * and the segment
                    terminator is ~.

## Envelopes

EDI uses several
                layers of enveloping to denote each section of the document.

For
                instance, the transaction envelope wraps each transaction and provides data
                about the segment data inside. Similarly, the group envelope wraps the
                    transaction envelope, and the interchange envelope wraps the group
                envelope.

In the flow step, each configurable envelope piece is
                represented as a string. These can be derived from expressions or hard-coded
                depending on the data requirements.

Here is an example of some
                hard-coded envelope values in the Build EDI step:

## Building Transactions

Transactions are the heart of an EDI document, containing the data you intend to
                transmit to a target system. An EDI document can contain multiple
                transactions.

In the Build EDI step, transactions are represented as
                an array of objects.

A simple representation of 2 empty transactions
                looks something like
                this:

```javascript
// List of transactions
[
 {},
 {}
]
```

Assuming that the Identifier Code is `123` and
                the Convention Reference is `ABCDEF`, the above produces the
                following EDI (with line breaks for
                readability):

```javascript
ST*123*0001*ABCDEF~
SE*2*0001~
ST*123*0002*ABCDEF~
SE*2*0002~
```

If you want segments in your transactions,
                represent them as properties with array values.

Building on the
                previous transactions example, here is an example of a single transaction with two
                segments:

```javascript
// List of transactions
[
 // Transaction
 {
  // First segment
  NM1: [
    {
     NM101:"John",
     NM102:"Doe"
    }
   ],
  // Second segment
  BGN:[
    {
     BGN01:"Example",
     BGN02:""
    }
   ]
  }
 ]
```

Which maps to the following
                EDI:

```javascript
ST*123*0001*ABCDEF~
NM1*John*Doe~
BGN*Example*~
SE*4*0001~
```

You can fill out the step with the example data like
                so:

If you ran the step now, you would get something that looks like this for your
                output:

In the above example, fake data was used for the envelope
                fields to get the step to run. Here it is split up line by line so it is easier to
                read:

```javascript
ISA*00*  *00*  *30*123CORP  *99*SOMECOMPANY *230329*1741*^*00501*680111692*1*T*:~
GS*BE*ABCCORP*SOMECOMPANY*20230329*1741*1*X*005010X220A1~
ST*834*0001*ABCDEF~
NM1*John*Doe~
BGN*Example~
SE*4*0001~
GE*1*1~
IEA*1*680111692~
```

This shows that the JavaScript transaction you filled
                out earlier turned into a ST/SE envelope, with its `NM1` and
                    `BGN` fields filled out properly.

Note: The BGN02 property from earlier was truncated from the final output. This is
                intended. Any empty trailing properties will be removed from the final
                output.

## Segments That Share Names

Property names that contain : will be truncated starting from
                and including the : to allow for propWhen the Cache Write flow step runs, it updates your cache within App Xchange with the latest data from the defined data object.erties of the same name
                to exist. Here is an example:

```javascript
REF*123~
REF*ABC~
```

The above is valid EDI, but invalid JavaScript/JSON. Therefore, a
                    : with identifying text is needed:

```javascript
{
  // Notice the ":" used to differentiate both REF properties
 "REF:A":[
   {
    REF01:"123"
  }
 ],
 "REF:B":[
  {
    REF01:"ABC"
  }
 ]
}
```

Each `REF:<whatever>` above will get trimmed down to just
                    `REF`, allowing for both valid JavaScript/JSON and EDI.

Nested Segments

Nested segments should be inserted as a property at the end of the segment
                object.

Here is an example, abbreviated for clarity:

```javascript
// Segment
BGN:[
 {
  BGN01:"Example",
  BGN02:"",
  // Nested segment
  HD:[
    {
      HD01:"Dental"
    }
  ]
 }
]
```

Which produces the following abbreviated EDI:

```javascript
ST*123*0001*ABCDEF~
BGN*Example*~
HD*Dental~
SE*3*0001~
```
