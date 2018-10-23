# APB Mocha Reporter
## Description

A zero-dependency tool that displays your unit test results in a nifty HTML page.

- Show live test results in your office / HQ
- HTML dashboard Auto refreshes every minute
- Output detailed test results to JSON

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

## License
MIT License

Copyright (c) 2018 Aidan Breen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
