# C# to JavaScript Conversions

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/common-javascript-code-examples/c-to-javascript-conversions
> Captured directly from rendered HTML: 2026-08-14

Use the following code snippets to help you switch from
        writing flows in C# to writing flows in JavaScript.

## DateTime

      Note: Unless converted, App Xchange's C# and JS implementations are both configured to operate in
        the same time zone: Coordinated Universal Time (Greenwich Mean Time).

Return today's date in

Return today's date in C#:

```javascript
DateTime.Now.Date
```

Return today's date in JS:

```javascript
dayjs();
```

Compare a date to the current date in

Compare a date to the current date in C#:

```javascript
DateTime.Parse(Data["Transaction_Date"].ToString())
  .Date ==DateTime.Now.Date
```

Compare a date to the current date in JS:

```javascript
dayjs().isSame(dayjs(
  flow.trigger.data["Transaction_Date"])
);
```

Safely convert a value to a date, or default to today’s date in

Safely convert a value to a date, or default to today’s date in C#:

```javascript
// creates new DateTime called dt and sets a default
// to today’s date
var dt = System.DateTime.Now;

bool vIsValidDate = System.DateTime.TryParse(
  Data.payRateEffectiveDate?.ToString(),
  out dt
);

// If the date parsing fails for any reason,
// set it to a default
if (!vIsValidDate) dt = System.DateTime.Now;

return dt.ToString("yyyy-MM-dd");
```

Safely convert a value to a date, or default to today’s date in JS:

```javascript
const dateObj = dayjs(flow.trigger.data
  .payRateEffectiveDate);

if (dateObj.isValid()) {
  return dateObj.format('YYYY-MM-DD');
}

return dayjs().format('YYYY-MM-DD');
```

Calculate the next closest Friday after a given date. Replace the example date
                    with your date variable

Calculate the next closest Friday after a given date. Replace the example date with
                your date variable in C#:

```javascript
DateTime dt = DateTime.Parse("9/29/2021");

if (dt.DayOfWeek.ToString() != "Friday")
{
  int x = System.DayOfWeek.Friday - dt.DayOfWeek;
  DateTime Friday = dt.AddDays(x);

  return Friday;
}
else
{
  return dt;
}
```

Calculate the next closest Friday after a given date. Replace the example date with
                your date variable in JS:

```javascript
dayjs('9/29/2021').day(5);
```

Calculate the last day in a month

Calculate the last day in a month in C#:

```javascript
DateTime dt = DateTime.Parse(Data.postedDate);

return new DateTime(
  dt.Year,
  dt.Month,
  DateTime.DaysInMonth(dt.Year, dt.Month)
);
```

Calculate the last day in a month in JS:

```javascript
dayjs(flow.trigger.data.postedDate).endOf('month');
```

Calculate the last day in a week

Calculate the last day in a week in C#:

```javascript
var culture = System.Threading.Thread.CurrentThread
  .CurrentCulture;
var difference = dt.DayOfWeek - culture.DateTimeFormat
  .FirstDayOfWeek;

if(difference < 0) {
  difference += 7;
}

DateTime start = dt.AddDays(-difference).Date;

return start.AddDays(6).Date;
```

Calculate the last day in a week in JS:

```javascript
dayjs(flow.trigger.data.postedDate).endOf('week');
```

Compare two dates

Compare two dates in C#:

```javascript
var syncStart = GetConfigValue("syncStartDate");

if (syncStart != null)
{
  if (DateTime.Parse(syncStart.ToString()) > DateTime
    .Parse(Data.DateCreated.ToString()))
  {
    return true;
  }
}
```

Compare two dates in JS:

```javascript
const syncStart = flow.config.syncStartDate;

if (syncStart) {
  // greater than
  if (dayjs(syncStart) > dayjs(flow.trigger.data
    .DateCreated)) {
    return true;
  }

  // isAfter
  if (dayjs(syncStart).isAfter(dayjs(flow.trigger.data
    .DateCreated))) {
    return true;
  }
};
```

Use Vista standard formatting for batch creation (set to 1st day of current
                    month)

Use Vista standard formatting for batch creation (set to 1st day of current month) in
                C#:

```javascript
new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1)
  .ToString("yyyy-MM-dd")
```

Use Vista standard formatting for batch creation (set to 1st day of current month) in
                JS:

```javascript
dayjs().date(1).format('YYYY-MM-DD');
```

Create a DateTime variable, set it equal to an input value, and output it in Vista
                    format

Create a DateTime variable, set it equal to an input value, and output it in Vista
                format in C#:

```javascript
DateTime dt;

dt = DateTime.Parse(
  Data.Items[0].TransactionDate.ToString()
);

return new DateTime(dt.Year, dt.Month, 1)
  .ToString("yyyy-MM-dd")
```

Create a DateTime variable, set it equal to an input value, and output it in Vista
                format in JS:

```javascript
dayjs(flow.trigger.data.Items[0].TransactionDate)
  .format('YYYY-MM-DD');
```

## Strings

```javascript
string vTest = "App Xchange, is cool";
```

Determine if a string contains specified text

Determine if a string contains specified text in C#:

```javascript
vTest.Contains("sti")
```

Determine if a string contains specified text in JS:

```javascript
vTest.includes('sti');
```

            Find the first position of a specified valueNote: Both
                    C# and JS return a -1 if not found.

Find the first position of a specified value in C#:

```javascript
vTest.IndexOf("u")
```

Find the first position of a specified value in JS:

```javascript
vTest.indexOf('u');
```

            Convert to upper or lower caseNote: You should convert
                    to lowercase or uppercase prior to string comparison. For example, converting an
                    email address, vendor name, or payment type name to lowercase prior to
                    comparison will make it case-insensitive and protect you against capitalization
                    errors.

Convert to upper or lower case in C#:

```javascript
vTest.ToUpper() or vTest.ToLower()
```

Convert to upper or lower case in JS:

```javascript
vTest.toUpperCase() or vTest.toLowerCase();
```

Return the length of the string

Return the length of the string in C#:

```javascript
vTest.Length
```

Return the length of the string in JS:

```javascript
vTest.length;
```

Delete all characters from specified index to end

Delete all characters from specified index to end in C#:

```javascript
vTest.Remove(5)
// vTest = "App X"
```

            Note: `Remove()` takes a
                    `startIndex` and an optional count. If no count is provided, it
                removes through the end of the string.

This is destructive. It is
                    deleting any characters after the start index. `vTest` is changed
                    and overwritten, and the next time you access it, it will be the shortened
                    string value.

Delete all characters from specified index to end in JS:

```javascript
const updatedStr = vTest.slice(0, 5);
const slicedStr = vTest.slice(5)
// vTest = 'App Xchange, is cool';
// updatedStr = 'App X'
// slicedStr = 'change, is cool'
```

            Note: `Slice()` and `Remove()` are
                essentially opposites but can be used to the same effect. With slice you tell it
                what to keep.
- `Slice()` takes a `startIndex`
                              and an optional `endIndex`, but unlike
                                  `Remove()`, it returns the string between the start
                              and the end `indexes`, whereas `Remove()`
                              removes.
- If no `endIndex` is provided,
                                  `slice()`, *preserves* through the end of the
                              string.

This is non-destructive. It returns a new string from the
                    start index to the end index while leaving the original string intact.
                        `vTest` remains unchanged. You have to assign this to a new
                    variable in order to access it.

            Replace all instances of a string with anotherNote: Use
                    replace to strip out special characters. It's a useful way to make sure your
                    string is sanitized and does not contain special characters that can cause
                    problems.

Replace all instances of a string with another in C#:

```javascript
string money = "$3.00";
money.Replace("$", string.Empty)
```

Replace all instances of a string with another in JS:

```javascript
const money = '$3.00';
money.replace('$', ''); => '3.00'
```

            Note: This is non-destructive.

Return part of the string

Return part of the string: in C#:

```javascript
vTest.Substring(0,5) => "App X"

vTest.Substring(vTest.IndexOf("A"), 2) => "Ap"

// Prevents failure when string is less than the end
// index value
vTest.Substring(0,Math.Min(3,vTest.Length)) => "App"
```

            Note: Substring is one of the most risky functions to run on a
                string. If you don't use `Math.Min`, your code will fail.

To avoid a blind substring call:

```javascript
string pse = Data.Phase.ToString().Trim();
return pse.Substring(0,System.Math.Min(7, pse.Length));
```

Safe substrings and knowing max values:

You should know what the max value is and protect against truncation. Alternatively,
                if using a substring to get the first X characters, you need to protect against the
                    `Math.Min` being smaller.

```javascript
Data.description.ToString().Substring(
  0, Math.Min(Data.description.ToString().Length, 60)
) ?? ""
```

Return part of the string: in JS:

```javascript
vTest.slice(0, 5) => 'App X'

vTest.slice(vTest.indexOf('A'), 2) => 'Ap'

// Prevents failure when string is less than the end
// index value
vTest.slice(0, Math.min(3, vTest.length)) => 'App'

// or even simpler
vTest.slice(0, 3 || vTest.length) => 'App'
```

            Note: Although JavaScript has its own `substring()`
                method, use `slice()` instead. To learn why, see this article on
                    [JavaScript substring() vs slice()](https://masteringjs.io/tutorials/fundamentals/substring-vs-slice).

Remove starting and ending white space

            Note: Trim should be one of the most common functions used with
                strings. Be sure to use it to remove any leading or trailing whitespace that can
                cause issues. Whitespace has been known to cause support tickets and delays in
                onboarding, and is very tough to track down. Use Trim instead.

Remove starting and ending white space in C#:

```javascript
vTest.Trim()
```

Remove starting and ending white space in JS:

```javascript
vTest.trim()
```

Evaluate if a string is blank or null

            Note: Always check for null or empty prior to using the value. You
                can then create a hierarchy of data, for example, checking allocation fields first
                and if blank/null then checking the expense detail fields and if blank/null then
                defaulting to something. This type of defensive coding will keep flows from failing
                or remediation tasks from being created for missing data.

in C#:

```javascript
string.IsNullOrWhiteSpace(Data.Overhead_Expense
  .ToString())

//Alternatively, you can use IsNullOrEmpty like this:
if (!string.IsNullOrEmpty(ExpenseDetail.ReportEntryCustom3)) {
  vResult = ExpenseDetail.ReportEntryCustom3;
}
```

in JS:

```javascript
if (vTest) {
  // true when vTest is non-empty string,
  // is also true if only whitespace
}

if (vTest.trim()) {
  // same as above but fails if only whitespace
}
```

Format data as currency

Format data as currency in C#:

```javascript
Data.Amount = "4.35615676"

String.Format(
  "{0:0.00}", decimal.Parse(Data.Amount.ToString())
)
```

Format data as currency in JS:

```javascript
numeral('4.35615676').format('$0,0[.]00');
```

Split a string into parts

Split a string into parts in C#:

```javascript
vTest.Split(",")[0]

vTest.Split(",")[1]

if (vTest.Contains(","))
{
  vReturn = vTest.Split(",")[1];
}

if (vTest.Contains("YOUR MOM"))
{
  vReturn = vTest.Split("YOUR MOM")[1];
}
```

            Note: String splits are also risky and can be a source of
                failures. Be sure to always do a `Contains` prior to a split to check
                that your string contains the character or string you are splitting on.

Split a string into parts in JS:

```javascript
vTest.split(',')[0]

vTest.split(',')[1]

if (vTest.includes(',')) {
  vReturn = vTest.split(',')[1];
}

if (vTest.includes("YOUR MOM")) {
  vReturn = vTest.Split("YOUR MOM")[1];
}
```

            Note: As with previous JS string methods, these are
                non-destructive to the original string and must be assigned to new variables.

If the string does not contain the character or string you are
                    splitting on, it returns `undefined`.

Add characters to the beginning or end of a string

Add characters to the beginning or end of a string in C#:

```javascript
// The number specifies the total desired string length
vTest.PadLeft(20)

vTest.PadLeft(20, "*")

vTest.PadRight(20, "-")
```

Add characters to the beginning or end of a string in JS:

```javascript
vTest.padStart(20);

vTest.padStart(20, '*');

vTest.padEnd(20, '-');
```

## Arrays

Arrays are used to store multiple values in a single variable, instead of
                declaring separate variables for each value. Flows also rely upon the JArray Class,
                which represents a JSON array, in the Newtonsoft.Json assembly. See more info at
                    [JArray Class](https://www.newtonsoft.com/json/help/html/T_Newtonsoft_Json_Linq_JArray.htm).

Arrays are much easier to work with in JavaScript than C#.

Create a hardcoded array

            For example, for use with the `In` operator in a Filter
                    step.CAUTION: Use extreme care when hardcoding
                    something. Make sure it is future proof and will not need to be changed in the
                    future.

in C#:

```javascript
new int[] {10,15}

new string[] {"Approved", "Variance Approved"}
```

in JS:

```javascript
const intArr = [10, 15];

const stringArr = ['Approved', 'Variance Approved'];
```

Convert a list output to a JArray

Convert a list output to a JArray in C#:

```javascript
JArray.FromObject(
  (Object)Step("convert-file-to-json").Output
)
```

            Note: If you see the JArray *instance expected error*, that
                means you are missing the (object) cast. Change it to the
                following:

```javascript
JArray.FromObject((object)Step("lookup-project-number").Output).Where(r => r["project-number"]?.ToString()
```

Convert a list output to a JArray in JS:

```javascript
flow.step('convert-file-to-json').output;
```

            Note: No converting or casting is necessary in JavaScript.

Determine if any element in an array satisfies a requirement

Determine if any element in an array satisfies a requirement in C#:

```javascript
var hasOwnerAssignee = JArray.FromObject(
    (object)Data.Assignees
  )
  .Where(a => domains.Any(
    d => a["ContactEMail"].ToString().EndsWith(d.ToString()))
  )
  .Any();
```

Determine if any element in an array satisfies a requirement in JS:

```javascript
const hasOwnerAssignee = flow.trigger.data.Assignees
  .some((a) => domains.some(
    d => a.ContactEMail.endsWith(d)
  ),
);
```

Sort an array by a column in descending order and then return the first value
                    (highest value)

Sort an array by a column in descending order and then return the first value
                (highest value) in C#:

```javascript
JArray.FromObject((object)Data.Items)
  .OrderByDescending(x=>int.Parse(x["Hubometer_Reading"].ToString()))
  .First()["Hubometer_Reading"]
  .ToString()
```

            Note: Don't do `int.Parse`. Change it to a
                    `TryParse` instead. Decimals, dates, and integers all need to be
                    `TryParse`.

```javascript
Int32.TryParse(

item.GLCo.ToString(), out Int32 glco);
```

Sort an array by a column in descending order and then return the first value
                (highest value) in JS:

```javascript
flow.trigger.data.Items.sort(
  (a, b) => b['Hubometer_Reading'] - a['Hubometer_Reading']
)[0];
```

            Note: `sort()` mutates the original array. The
                default sort order is ascending. The time and space complexity of the sort cannot be
                guaranteed as it depends on the implementation.

Lodash is another option:

```javascript
// Lodash
const sorted = _.orderBy(flow.trigger.data.Items, 'Hubometer_Reading',
  'desc')[0];
```

Evaluate if a lookup step has any records

Evaluate if a lookup step has any records in C#:

```javascript
((IEnumerable<dynamic>) Step("lookup-employee").Output)
  .Any()
```

To access element in lookup:

```javascript
if (Step("lookup-job-in-spectrum").Output.Count > 0)
{
  return Step("lookup-job-in-spectrum").Output[0]
    .Job_Number.ToString();
}
else
{
  return (string)null;
}
```

            Note: Make sure your lookup step returns something. Every lookup
                should have an `if exists` check before using the output.

Evaluate if a lookup step has any records in JS:

```javascript
flow.step('lookup-employee').output.length > 0

// Lodash
_.any(flow.step('lookup-employee').output)
```

To access element in lookup:

```javascript
if (flow.step('lookup-employee').output.length > 0) {
  return flow.step('lookup-employee').output[0].Job_Number.toString()
} else {
  return null;
}
```

Make sure all lines of a JArray/array contain a value matching the
                criteria

Make sure all lines of a JArray/array contain a value matching the criteria in
                C#:

```javascript
JArray x = JArray.FromObject(Step("convert-to-json").Output)

return x.All(i => i["Employee_Id"].ToString() != "")
```

Make sure all lines of a JArray/array contain a value matching the criteria in
                JS:

```javascript
flow.step('convert-to-json').output
  .every(i => i["Employee_Id"]);
```

Cast the dynamic object from a filter step's output to an object so you can turn
                    it into a JArray

Cast the dynamic object from a filter step's output to an object so you can turn it
                into a JArray in C#:

```javascript
JArray.FromObject(
  (object)Step(“filter-vista-employee-list-yx5mr”)
    .Output
)

// then we can use JArray functions on it
JArray.FromObject(
  (object)Step("filter-vista-employee-list-yx5mr")
    .Output
  )
  .Select(x => x["SourceSystemId"].ToString())
  .ToArray()
```

Cast the dynamic object from a filter step's output to an object so you can turn it
                into a JArray in JS:

```javascript
flow.step('filter-vista-employee-list-yx5mr').output
  .map(x => x.SourceSystemId);
```

            Note: No casting is necessary in JavaScript.

Add each value in an array to a list or a string

Add each value in an array to a list or a string in C#:

```javascript
string results = "";

foreach (var flag in Data.flags[0].system_flag_details)
{
  if (flag["reasons"] != null && flag[“reasons”] != "")
  {
    results +=  $”{flag[“reasons”]}: “;
  }
}

return results;
```

Add each value in an array to a list or a string in JS:

```javascript
let results = '';

flow.trigger.data.flags[0].system_flag_details.forEach(flag => {

  if (flag.reasons) {

    results += `${flag.reasons}: `

  }

})

return results;
```

Sum all values in a field of an array or list

in C#:

```javascript
JArray.FromObject(
  (Object)Step(“lookup-class”).Output.DednLiabs)
  .Sum(x=>x.decimal.Parse(x[“NewRate”])
);
```

in JS:

```javascript
const values = flow.step('lookup-class').output.DednLiabs

values.reduce(
  (prev, curr) => prev + Number(curr.NewRate),
  0
);

// Numeraljs
values.reduce(
  (prev, curr) => numeral(prev).add(curr.NewRate).value(),
  0
);

// Lodash
_.sumBy(values, (e) => Number(e.NewRate));
```

            Note: The `reduce()` method executes a
                user-supplied reducer callback function on each element of the array, in order,
                passing in the return value from the calculation on the preceding element. The final
                result of running the reducer across all elements of the array is a single value.
                See the Mozilla developer docs for more information on the [reduce() method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).

Assign a value based on looking up a value in an array

Assign a value based on looking up a value in an array in C#:

```javascript
var rate = JArray.FromObject(
  (Step("lookup-class").Output[0].PayRates as JArray)
  .Where(
    e => e["Shift"].ToString() ==
      Step("lookup-employee-in-vista").Output.Shift
        .ToString()
  )
  .ToArray());
```

Assign a value based on looking up a value in an array in JS:

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

Determine if an object in an array has a field

Determine if an object in an array has a field in C#:

```javascript
var x = JArray.FromObject((object)Data);

foreach(JObject item in x)
{
  if(item.ContainsKey(“department”))
  {
    // do something
  }
}
```

Determine if an object in an array has a field in JS:

```javascript
flow.trigger.data.forEach(item => {
  if (item.department) {
    // do something
  }
})
```

Sort the input for a Map step to intentionally order lines in an invoice

Sort the input for a Map step to intentionally order lines in an invoice in C#:

```javascript
JArray sorted = new JArray(lines.OrderByDescending(
  x=>x["Equipment"].ToString()
  )
);

return sorted;
```

Sort the input for a Map step to intentionally order lines in an invoice in JS:

```javascript
lines.sort((a, b) => {
  if (b.Equipment > a.Equipment) return 1;
  if (b.Equipment < a.Equipment) return -1;
  return 0;
});

// Lodash
const orderedLines = _.orderBy(lines, 'Equipment', 'desc');
```

            Note: `sort()` mutates the original array, whereas
                    `_.orderBy()` returns a new array.
