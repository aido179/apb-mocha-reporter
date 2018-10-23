// my-reporter.js
var mocha = require('mocha');
var fs = require("fs");
module.exports = apbmochareporter;

function apbmochareporter(runner) {
  mocha.reporters.Base.call(this, runner);
  var passes = 0
  var failures = 0
  var sum = 0
  var total = runner.total
  function update(){
    process.stderr.write(`\rerr"${sum}`);
    process.stdout.write(`\r${sum}/${total} - ${passes} passed. ${failures} failed.                       `);
  }

  process.stdout.write("APB Mocha Reporter\n");

  runner.on('pass', function(test){
    passes++;
    sum++;
    update()
  });

  runner.on('fail', function(test, err){
    failures++;
    sum++;
    update()
    //console.log('fail: %s -- error: %s', test.fullTitle(), err.message);
  });

  runner.on('end', function(){
    process.stdout.write('\nGenerating html...')
    let pass_percent = Math.floor((passes/total)*100)
    let fail_percent = Math.floor((failures/total)*100)
    let run_percent = Math.floor((sum/total)*100)
    let output = updateBillboard({
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
    process.stdout.write(`\rOutput to: ${output}`)
    process.stdout.write('\nComplete.\n');
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

// To have this reporter "extend" a built-in reporter uncomment the following line:
// mocha.utils.inherits(MyReporter, mocha.reporters.Spec);
