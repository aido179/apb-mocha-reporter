// my-reporter.js
var mocha = require('mocha');
var fs = require("fs");
module.exports = apbmochareporter;

function apbmochareporter(runner, options) {
  const SILENT = options.reporterOptions.silent
  const SAVEJSON = options.reporterOptions.savejson

  mocha.reporters.Base.call(this, runner);

  var sum = 0 // Sum of tests as they run. This is probably unecessary but I want to output 3 boxes
  //values for the JSON output
  var json_tests = [];
  var json_pending = [];
  var json_failures = [];
  var json_passes = [];


  function write(str){
    if(!SILENT) process.stdout.write(str);
  }
  function update(){
    write(`\r${runner.stats.tests}/${runner.total} - ${runner.stats.passes} passed. ${runner.stats.failures} failed.                       `);
  }

  write("APB Mocha Reporter\n");
  runner.on('test end', function(test) {
    json_tests.push(test);
  });

  runner.on('pass', function(test){
    sum++;
    json_passes.push(test);
    update()
  });

  runner.on('fail', function(test, err){
    sum++;
    json_failures.push(test);
    update()
  });

  runner.on('pending', function(test) {
    json_pending.push(test);
  });

  runner.on('end', function(){
    update()
    write('\nGenerating HTML...')
    let pass_percent = Math.floor((runner.stats.passes/runner.stats.tests)*100)
    let fail_percent = Math.floor((runner.stats.failures/runner.stats.tests)*100)
    let run_percent = Math.floor((runner.stats.tests/runner.total)*100)
    let htmlOutput = updateBillboard({
      "{{lastrun_date}}": new Date(),
      "{{run_percent}}": run_percent,
      "{{run_numerator}}": runner.stats.tests,
      "{{run_denominator}}": runner.total,
      "{{pass_percent}}": pass_percent,
      "{{pass_numerator}}": runner.stats.passes,
      "{{pass_denominator}}": runner.stats.tests,
      "{{fail_percent}}": fail_percent,
      "{{fail_numerator}}": runner.stats.failures,
      "{{fail_denominator}}": runner.stats.tests
    })
    write(`\rHTML output to: ${htmlOutput}`)
    if(SAVEJSON !== undefined){
      write(`\nGenerating JSON...`)
      // Build JSON
      var obj = {
        tests: json_tests.map(clean),
        pending: json_pending.map(clean),
        failures: json_failures.map(clean),
        passes: json_passes.map(clean)
      };
      runner.testResults = obj;
      let json = JSON.stringify(obj, null, 2)
      let jsonOutput = writeJSON(json, SAVEJSON)
      write(`\rJSON output to: ${jsonOutput}`)
    }
    write('\nAPB Mocha Reporter Complete.\n');
  });
}

function updateBillboard(replacements){
  //This is a rudimentary templating engine for the html template
  //It should work for reasonable tags provided as object keys of "replacements"
  //but bo guarantees are made!
  template = fs.readFileSync(`${__dirname}/../templates/apbmochareporter_TEMPLATE.html`, {encoding:'utf8'})
  let newContent = template.replace(/{{.*?}}/g, function(match){
    return replacements[match]
  })
  let output_dir = `${process.cwd()}/apb-mocha-reporter-report`
  let output= `${output_dir}/apb-mocha-reporter.html`
  if (!fs.existsSync(output_dir)){
    fs.mkdirSync(output_dir);
  }
  fs.writeFileSync(output, newContent)
  return output
}

function writeJSON(data, filename){
  let output_dir = `${process.cwd()}/apb-mocha-reporter-report`
  let output= `${output_dir}/${filename}`
  // filename comes from mocha's --reporter-options
  // if it the savejson option is provided, but not explicitly set, filename is true
  if(filename === true){
    let now = new Date()
    let day = ("00"+now.getDate()).substr(-2,2) // pad to two chars
    let month = ("00"+(now.getMonth()+1)).substr(-2,2) // pad to two chars, add 1 because months start at 0
    let year = now.getFullYear() // pad not required
    let hour = ("00"+now.getHours()).substr(-2,2) // pad to two chars
    let min = ("00"+now.getMinutes()).substr(-2,2) // pad to two chars
    let sec = ("00"+now.getSeconds()).substr(-2,2) // pad to two chars
    output= `${output_dir}/apb-mocha-reporter-${year}${month}${day}-${hour}${min}${sec}.json`
  }
  if (!fs.existsSync(output_dir)){
    fs.mkdirSync(output_dir);
  }
  fs.writeFileSync(output, data)
  return output
}


/*
* these come straight from the mocha repo - used to tidy up JSON
*/
function clean(test) {
  var err = test.err || {};
  if (err instanceof Error) {
    err = errorJSON(err);
  }
  return {
    title: test.title,
    fullTitle: test.fullTitle(),
    duration: test.duration,
    currentRetry: test.currentRetry(),
    err: cleanCycles(err)
  };
}
function cleanCycles(obj) {
  var cache = [];
  return JSON.parse(
    JSON.stringify(obj, function(key, value) {
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Instead of going in a circle, we'll print [object Object]
          return '' + value;
        }
        cache.push(value);
      }

      return value;
    })
  );
}
function errorJSON(err) {
  var res = {};
  Object.getOwnPropertyNames(err).forEach(function(key) {
    res[key] = err[key];
  }, err);
  return res;
}
/*
* end of stuff straight from the mocha repo - used to tidy up JSON
*/
