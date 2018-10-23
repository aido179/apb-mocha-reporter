// my-reporter.js
var mocha = require('mocha');
var fs = require("fs");
module.exports = apbmochareporter;

function apbmochareporter(runner, options) {
  const SILENT = options.reporterOptions.silent
  const SAVEJSON = options.reporterOptions.savejson

  mocha.reporters.Base.call(this, runner);
  // Values for the billboard / dashboard
  var passes = 0
  var failures = 0
  var sum = 0
  var total = runner.total
  //values for the JSON output
  var json_tests = [];
  var json_pending = [];
  var json_failures = [];
  var json_passes = [];

  function update(){
    if(!SILENT){
      process.stderr.write(`\rerr"${sum}`);
      process.stdout.write(`\r${sum}/${total} - ${passes} passed. ${failures} failed.                       `);
    }
  }
  function write(str){
    if(!SILENT) process.stdout.write(str);
  }

  write("APB Mocha Reporter\n");
  runner.on('test end', function(test) {
    json_tests.push(test);
  });

  runner.on('pass', function(test){
    passes++;
    sum++;
    json_passes.push(test);
    update()
  });

  runner.on('fail', function(test, err){
    failures++;
    sum++;
    json_failures.push(test);
    update()
  });

  runner.on('pending', function(test) {
    json_pending.push(test);
  });

  runner.on('end', function(){
    write('\nGenerating HTML...')
    let pass_percent = Math.floor((passes/total)*100)
    let fail_percent = Math.floor((failures/total)*100)
    let run_percent = Math.floor((sum/total)*100)
    let htmlOutput = updateBillboard({
      "{{lastrun_date}}": new Date(),
      "{{run_percent}}": run_percent,
      "{{run_numerator}}": sum,
      "{{run_denominator}}": total,
      "{{pass_percent}}": pass_percent,
      "{{pass_numerator}}": passes,
      "{{pass_denominator}}": total,
      "{{fail_percent}}": fail_percent,
      "{{fail_numerator}}": failures,
      "{{fail_denominator}}": total
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
  content = fs.readFileSync(`${__dirname}/apbmochareporter_TEMPLATE.html`, {encoding:'utf8'})
  let newContent = content.replace(/{{.*?}}/g, function(match){
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
