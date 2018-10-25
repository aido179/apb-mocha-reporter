# APB Mocha Reporter
## Description

A zero-dependency tool that displays your unit test results in a nifty HTML page.

- Show live test results in your office / HQ
- HTML dashboard Auto refreshes every minute
- Output detailed test results to JSON

**Note: This package requires the Node fs module. It does not work in the browser.**

![Screenshot](https://github.com/aido179/apb-mocha-reporter/blob/master/img/dash_screenshot.png)


## Installation

*Obviously, you need an existing mocha test suite*

1. NPM: ```npm install apb-mocha-reporter --save-dev```
2. Update your test script: ```mocha ./**.test.js --reporter apb-mocha-reporter```

## Usage

This reporter replaces the default Mocha console output with a more minimal console output.

The html dashboard is generated each time you run Mocha and is written to:

```
/yourProject/apb-mocha-reporter-report/apb-mocha-reporter.html
```

Just open up the html file in a browser, and it will auto-refresh every 60 seconds.

### Prevent console output
Pass the ```silent``` reporter option to prevent the runner from printing to the console.

```
mocha ./**.test.js --reporter apb-mocha-reporter --reporter-options silent"
```

### Save detailed test results as JSON
Pass the ```savejson``` reporter option to save a detailed report as JSON.

EG:

```
mocha ./**.test.js --reporter apb-mocha-reporter --reporter-options savejson"
```

An optional filename may be passed. Otherwise, the output will be in:

 ```
 yourProject/apb-mocha-reporter-report/apb-mocha-reporter-YYYYMMDD-HHMMSS.json
 ```

You may want to pass a file name to prevent logs from building up.

EG:

```
mocha ./**.test.js --reporter apb-mocha-reporter --reporter-options savejson=filename.json"
```

### Change output directory

Pass the ```outputdir``` reporter option with a value to change the output directory.

```
mocha ./**.test.js --reporter apb-mocha-reporter --reporter-options outputdir='customOutputDir'

```

### Multiple options

To pass multiple options, for example, to be both silent and to save json, reporter-options should be in a comma separated list without spaces.

EG:

```
mocha ./**.test.js --reporter apb-mocha-reporter --reporter-options silent,savejson=filename.json"
```

### Modifying the template ###
If you want to fiddle around with the template, you will find apbmochareporter_TEMPLATE.html in the src directory of this package. The output html dashboard is generated using this template.

I didn't want to bloat the package by adding unnecessary templating dependencies, so it currently uses a potentially fragile (but lightweight!) regex based solution that replaces the strings surrounded by double curly braces (eg. ```{{string}}```).

*Potential future feature: Supply your own template as a cli arg*

## Contributing
PRs welcome.
