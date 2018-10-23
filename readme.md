## Prevent console output
Pass the ```silent``` reporter option to prevent the runner from printing to the console.

```
mocha ./**.test.js --reporter apb-mocha-reporter --reporter-options silent --exit"
```

## Save detailed test results as JSON
Pass the ```savejson``` reporter option to save a detailed report as JSON.

EG:

```
mocha ./**.test.js --reporter apb-mocha-reporter --reporter-options savejson --exit"
```

An optional filename may be passed. Otherwise, the output will be in:

 ```
 yourProject/apb-mocha-reporter-report/apb-mocha-reporter-YYYYMMDD-HHMMSS.json
 ```

You may want to pass a file name to prevent logs from building up.

EG:

```
mocha ./**.test.js --reporter apb-mocha-reporter --reporter-options savejson=filename.json --exit"
```

## Multiple options

To pass multiple options, for example, to be both silent and to save json, reporter-options should be in a comma separated list without spaces.

EG:

```
mocha ./**.test.js --reporter apb-mocha-reporter --reporter-options silent,savejson=filename.json --exit"
```
