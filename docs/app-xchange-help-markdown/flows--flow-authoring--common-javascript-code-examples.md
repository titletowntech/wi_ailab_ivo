# Common JavaScript Code Examples

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/common-javascript-code-examples
> Captured directly from rendered HTML: 2026-08-14

Use the following libraries and common code resources compiled
        here to help you write flows.

## Helpful Coding Tips

Create two lists and then find the values from one that
                does not exist in the other:

- Create the two lookup steps

  - lookup-ineight-employees-ocakj
  - lookup-vista-employees-xy6c9
- Create the filter step

  - List
  - Test Expression

```javascript
flow.step("lookup-ineight-ocakj").output
```

```javascript
const inEightEmployeeId = numeral(flow.trigger.data.SourceSystemId)
  .value();

if (!inEightEmployeeId) {
  return false;
}

return flow.step('lookup-vista-employees-xy6c9'').output
  .every(x => numeral(x.KeyID) !== inEightEmployeeId);
```

            Use null coalesce (double question marks):Note: These are both the same.

```javascript
const x = flow.trigger.data.firstName ?? ''
```

```javascript
const x = flow.trigger.data.firstName !== null ?
  flow.trigger.data.firstName :
  ''
```

            How to fix if node does not contain something:Note: Reference the `.` before `["Concur_Approver"].`

```javascript
flow.trigger.data["__custom_fields"]?.["Concur_Approver"] ?? ''
```

Use regex for any file containing KPC and ending in .CSV:

```javascript
^.*KPC.*.csv
```

Call a configured variable:

- If the variable is a single object
- If the variable is a Multiple Text Items

```javascript
flow.config.Company
```

```javascript
flow.config.exceptionEmails
```

Reference a configuration property set as multiple text items:

```javascript
flow.config.exceptionEmails
```

Check if the Configuration Value is empty:

```javascript
if (flow.config.companyName)
```

Create a map step without any input:

- Set “List or Object” [] or {}

Dynamically determine start row for a Parse Delimited
                File step:

- You have to edit the JSON of the flow, but then
                          you can change the property to any value you want. Must resolve to a
                          number.

StartingRowNumber:

```javascript
numeral(flow.step('count-headers').output[0].CountHeaders).value()
```

Create a random string:

```javascript
uuid.v4()
```

TryParse:

```javascript
const testValue = '1';
const num = numeral(testValue).value();

if (num) {
  return num;
};
```

            Set the field to get data from via a configuration:Note: This is helpful if you want to use a
                    configuration on a shared flow to set a different ud field to reference for each
                    customer.

```javascript
flow.trigger.data['__custom_fields'][flow.config.udSyncEmployee]
```

Everything inside the brackets is just a string value, so this
                method can be used in a number of ways.

```javascript
const field = flow.config.udSyncEmployee;

flow.trigger.data['__custom_fields'][field];
```

You can also create other dynamic situations.

```javascript
const x = 1;
const y = 2;
let lookupField = '';

if (x + y > 5) {
  lookupField = 'something';
} else {
  lookupField = 'somethingElse';
}

return flow.trigger.data[lookupField];
```

## Libraries

App Xchange supports the NodeJS v18.15.0 version of JavaScript.

The App Xchange flow engine supports these JavaScript libraries.

- Day.js

  [View the Day.js library documentation](https://day.js.org/docs/en/parse/parse).

  V1.11.7

  The flow engine supports all methods including the following
                          plugins:

  - [ArraySupport](https://day.js.org/docs/en/plugin/array-support)
  - [CustomParseFormat](https://day.js.org/docs/en/plugin/custom-parse-format)
  - [ObjectSupport](https://day.js.org/docs/en/plugin/object-support)
  - [UTC](https://day.js.org/docs/en/plugin/utc)
- Numeral.js

  [View the Numeral.js library documentation](http://numeraljs.com/).

  V2.06

  The flow engine supports all methods.
- Lodash

  [View the Lodash library documentation](https://lodash.com/docs/4.17.15).

  V4.17.21

  All methods are supported. To call lodash functions, use the
                          standard `_.method()`.
- uuid

  [View the uuid library documentation](https://www.npmjs.com/package/uuid).

  V9.0.0

  The most common method for generating GUIDs is
                              `uuid.v4()`.

## Dates

            Note: Unless converted, App Xchange's dayjs implementation operates in Coordinated
                Universal Time (Greenwich Mean Time).

Return today’s date:

```javascript
dayjs(); // returns a dayjs object
dayjs().date();
dayjs().toString();
```

```javascript
22
'Wed, 22 Feb 2023 22:33:27 GMT'
```

            Use Vista standard formatting for batch creation:Note: This will set to the first day of the current
                    month.

```javascript
dayjs().date(1).format('YYYY-MM-DD');
```

```javascript
'2023-02-01'
```

Compare a date to the current day:

```javascript
dayjs().isSame(dayjs(flow.trigger.data["Transaction_Date"]));
```

```javascript
false
```

Create a date variable, set it equal to an input value, and output it in a specific
                format:

```javascript
dayjs(flow.trigger.data.Items[0].TransactionDate).format('YYYY-MM-DD');
```

```javascript
'2023-02-28'
```

Safely convert a value to a date, or default to today’s date:

```javascript
const dateObj = dayjs(flow.trigger.data.payRateEffectiveDate);

if (dateObj.isValid()) {
  return dateObj.format('YYYY-MM-DD');
}

return dayjs().format('YYYY-MM-DD');
```

```javascript
'2022-05-18'
```

            Calculate the next closest Friday after a given date:Note: Replace the example date with your date
                variable.

```javascript
const closestFri = dayjs('9/29/2021').day(5);
closestFri.toString();
```

```javascript
Sample Output: 'Fri, 01 Oct 2021 07:00:00 GMT'
```

Calculate the last day in a month:

```javascript
const endOfFeb = dayjs('2/14/2023').endOf('month');
endOfFeb.date()
endOfFeb.format('MM/DD/YYYY')
```

```javascript
28
'02/28/2023'
```

Calculate the last day in a week:

```javascript
const endOfWeek = dayjs(flow.trigger.data.postedDate).endOf('week');
endOfWeek.date();
endOfWeek.day();
endOfWeek.format('dddd, DD MMM YYYY')
```

```javascript
25
6 // 6 = Saturday
'Saturday, 25 Feb 2023'
```

Compare two dates:

```javascript
const syncStart = flow.config.syncStartDate;

if (syncStart) {
  // greater than
  if (dayjs(syncStart) > dayjs(flow.trigger.data.DateCreated)) {
    return true;
  }

  // isAfter
  if (dayjs(syncStart).isAfter(dayjs(flow.trigger.data.DateCreated))) {
    return true;
  }
};
```

## Strings

```javascript
const vTest = 'Flow writing, is cool';
```

Check if a string contains specified text:

```javascript
vTest.includes('rit');
```

```javascript
true
```

            Find the first position of a specified value:Note: This returns
                    a -1 if not found.

```javascript
vTest.indexOf('w');
```

```javascript
3
```

            Convert to upper or lower case:Note: You should convert to
                    lowercase or uppercase prior to string comparison. For example, converting an
                    email address, vendor name, or payment type name to lowercase prior to
                    comparison will make it case-insensitive and protect you against capitalization
                    errors.

```javascript
vTest.toUpperCase();
vTest.toLowerCase();
```

```javascript
'FLOW WRITING, IS COOL'
'flow writing, is cool'
```

Lodash also gives us the following:

```javascript
_.camelCase(vTest);
_.startCase(vTest);
_.kebabCase(vTest);
```

```javascript
'flowWritingIsCool'
'Flow Writing Is Cool'
'flow-writing-is-cool'
```

Return the length of the string:

```javascript
vTest.length;
```

```javascript
20
```

Delete or keep part of the string:

Javascript has a `substring()` method, but we recommend
                    `slice(`. For more information, read [this explanation from Mastering JS](https://masteringjs.io/tutorials/fundamentals/substring-vs-slice).

`slice()` takes a `startIndex` and an
                optional `endIndex` and returns the string between the start and the
                end indexes.

If no `endIndex` is supplied, `slice()`
                preserves through the end of the string.

This is non-destructive. It returns a new string from the start index to
                the end index while leaving the original string intact. `vTest`
                remains unchanged. You will have to assign this to a new variable in order to access
                it.

```javascript
const updatedStr = vTest.slice(0, 4);
const slicedStr = vTest.slice(5);
// original variable is unchanged
// vTest = 'Flow writing, is cool'

vTest.slice(vTest.indexOf('F'), 12)

// Prevents failure when string is less than the end
// index value
vTest.slice(0, Math.min(4, vTest.length))

// or even simpler
vTest.slice(0, 4 || vTest.length)
```

```javascript
'Flow'
'writing, is cool'

'Flow writing'

'Flow'

'Flow'
```

            Replace all instances of a string with another:Note: Use replace to strip out special characters. It is a non-destructive way to
                    ensure your string is sanitized and does not contain special characters that can
                    cause problems.

```javascript
const replaced = vTest.replace('i', '1');
const replacedAll = vTest.replaceAll('i', '1');
// original variable is unchanged
// vTest = 'Flow writing, is cool'

const money = '$3.00';
money.replace('$', '');
```

```javascript
'Flow wr1ting, is cool'
'Flow wr1t1ng, 1s cool'

'3.00'
```

Remove starting and ending white space:

Trim should be one of the most common functions used with strings. Use it
                to get rid of any leading or trailing whitespace that can cause issues. Whitespace
                has been known to cause support tickets and delays in onboarding, and is very tough
                to track down. Use Trim and eliminate this headache!

```javascript
const stringWithWhitepace = 'Hello World     '
vTest.trim()
```

```javascript
'Hello World'
```

            Evaluate if a value is blank or null:Note: Always
                    check for null or empty prior to using the value. You can then create a
                    hierarchy of data, for example, checking allocation fields first and if
                    blank/null then checking the expense detail fields and if blank/null then
                    defaulting to something. This type of defensive coding keeps flows from failing
                    and remediation tasks from being created for missing data.

```javascript
if (vTest) {
  // true when vTest is non-empty string,
  // is also true if only whitespace
}

if (vTest.trim()) {
  // same as above but fails if only whitespace
}
```

Format data as currency:

```javascript
numeral('4.35615676').format('$0,0.00');
```

```javascript
$4.36
```

            Split a string into parts:Note:

- As with previous JS string methods, these are
                                  non-destructive to the original string and must be assigned to new
                                  variables.
- If the string does not contain the character or string you
                                  are splitting on, it returns `undefined`.

```javascript
vTest.split(',')[0]

vTest.split(', ')[1]

if (vTest.includes(',')) {
  return vTest.split(',')[0];
}

if (vTest.includes("STINKS")) {
  return vTest.Split("STINKS")[1];
}
```

```javascript
'Flow writing'

'is cool'

true

false
```

Add characters to the beginning or ending of a string:

```javascript
vTest.padStart(25);
vTest.padStart(25, '*');
vTest.padEnd(25, '-');
```

```javascript
'     Flow writing, is fun'
'*****Flow writing, is fun'
'Flow writing, is fun-----'
```

## Numbers

Parse a number from a string:

```javascript
numeral('28').value();
```

```javascript
28
```

Format a number into dollars:

```javascript
numeral('20000.25793').format('$0,0.00');
```

```javascript
'$20,000.26'
```

## Arrays

            Create a hardcoded array, e.g. for use with the In operator in a
                    filter expression.CAUTION: Use extreme
                    care when hardcoding anything. Make sure it will never need to be
                    changed.

```javascript
const intArr = [10, 15];

const stringArr = ['Approved', 'Variance Approved'];
```

Determine if any element in an array contain a value matching the criteria:

```javascript
const hasOwnerAssignee = flow.trigger.data.Assignees
  .some((a) => domains.some(
    d => a.ContactEMail.endsWith(d)
  ),
);
```

Determine if all elements of an array contain a value matching the criteria:

```javascript
const hasOwnerAssignee = flow.trigger.data.Assignees
  .some((a) => domains.some(
    d => a.ContactEMail.endsWith(d)
  ),
);
```

Sort an array by a column in descending order and then return the first value
                (highest value):

```javascript
flow.trigger.data.Items.sort(
  (a, b) => b.Hubometer_Reading - a.Hubometer_Reading
)[0];
```

`sort()` mutates the original array. The default sort order
                is ascending. The time and space complexity of the sort cannot be guaranteed as it
                depends on the implementation.

Lodash is another option:

```javascript
// Lodash
const sorted = _.orderBy(flow.trigger.data.Items, 'Hubometer_Reading',
  'desc')[0];
```

Evaluate if a lookup step had any records:

```javascript
flow.step('lookup-employee').output.length > 0

// Lodash
_.any(flow.step('lookup-employee').output)
```

Access an element in lookup:

```javascript
if (flow.step('lookup-employee').output.length > 0) {
  return flow.step('lookup-employee').output[0].Job_Number.toString()
} else {
  return null;
}
```

Map a filter step's output array:

```javascript
flow.step('filter-ineight-employee-list-yx5mr').output
  .map(x => x.SourceSystemId);
```

Add each value in an array to a list or a string:

```javascript
let results = '';

flow.trigger.data.flags[0].system_flag_details.forEach(flag => {
  if (flag.reasons) {
    results += `${flag.reasons}:`;
  }
})

return results;
```

Sum all values in a field of an array or list:

            Note:

- The `reduce()` method executes a user-supplied
                              "reducer" callback function on each element of the array, in order,
                              passing in the return value from the calculation on the preceding
                              element. The final result of running the reducer across all elements of
                              the array is a single value.
- The first time the callback is run there is no return value
                                  of the previous calculation. If supplied, an initial value may
                              be used in its place. Otherwise, the array element at index 0 is used as
                              the initial value and iteration starts from the next element (index 1
                              instead of index 0). For more information, see [this explanation from Mozilla
                                  Developer Network](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).

```javascript
const values = flow.step('lookup-class').output.DednLiabs

values.reduce(
  (prev, curr) => numeral(prev).add(curr.NewRate).value(),
  0
);

// Lodash
_.sumBy(values, (e) => numeral(e.NewRate).value());
```

Assign a value based on looking up a value in an array:

```javascript
const payRates = flow.step('lookup-class').output[0]
  .PayRates;
const shiftToMatch = flow.step('lookup-employee-in-vista')
  .output.Shift;

// if there can be multiple matches, use filter()
const rates = payRates.filter(e => e.Shift === shiftToMatch);

// if you only want to match on the first successful hit,
// use find()
const rate = payRates.find(e => e.Shift === shiftToMatch);
```

Do something for each item in an array:

```javascript
flow.trigger.data.forEach(item => {
  if (item.department) {
    // do something
  }
})
```

            Sort the Input for a MAP step, to intentionally order lines in an
                    invoice:Note: `sort()` will mutate the
                    original array whereas `_.orderBy()` will return a new
                    array.

```javascript
lines.sort((a, b) => {
  if (b.Equipment > a.Equipment) return 1;
  if (b.Equipment < a.Equipment) return -1;
  return 0;
});

// Lodash
const orderedLines = _.orderBy(lines, 'Equipment', 'desc');
```
