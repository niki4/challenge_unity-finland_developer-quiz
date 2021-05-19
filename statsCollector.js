/*
* Our application servers receive approximately 20 000
* http requests  per second. Response timeout is 19000ms.
* Implement a statistics collector that calculates the
* median and average request response times for a 7 day
* dataset.
*
* Assigment:
* 1. Implement StatsCollector
* 2. Write tests (below StatsCollector)
*/

'use strict';

// State collector
class StatsCollector {
	constructor(/*void*/) {
  	this.responseTimes = []
    this.timeout = 19000
    this.weekRequestCount = 20000 * 60 * 60 * 24 * 7
  }

	pushValue(responseTimeMs /*number*/) /*void*/ {
  	// Adds new response time record to the collection
    const respTime = (responseTimeMs > this.timeout) ? this.timeout : responseTimeMs;
    this.responseTimes.push(respTime);
  }

	getMedian() /*number*/ {
  	// Get median of elements (~7 last days dataset)
    const sorted = this.responseTimes.slice(-this.weekRequestCount).sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
  }

	getAverage() /*number*/ {
  	// Average is the sum of all elements divided by num of elements (7 last days dataset)
    const weekDataset = this.responseTimes.slice(-this.weekRequestCount);
    return weekDataset.reduce((a, b) => a + b, 0) / weekDataset.length;
  }

}

// Configure Mocha, telling both it and chai to use BDD-style tests.
mocha.setup("bdd");
chai.should();

describe('StatsCollector', function(){
  it('pushValue should store responseTimes in collection', function(){
    const sc = new StatsCollector();
    const nums = [1, 2, 3, 4];
    nums.forEach(rTime => sc.pushValue(rTime));
    sc.responseTimes.should.have.members(nums);
    sc.responseTimes.length.should.equal(4)
  });
  it('pushValue should store timeout value if response times exceed it', function(){
    const sc = new StatsCollector();
    const nums = [1, 2, 3, 25000];
    const expNums = [1, 2, 3, 19000];
    nums.forEach(rTime => sc.pushValue(rTime));
    sc.responseTimes.should.have.members(expNums);
    sc.responseTimes.length.should.equal(4)
  });
  it('getMedian should return correct median for odd-size array', function(){
    const sc = new StatsCollector();
    const nums = [55, 3, 2, 4, 1];
    nums.forEach(rTime => sc.pushValue(rTime));
  	const median = sc.getMedian();
    median.should.equal(3);  // [55, 3, 2, 4, 1] -> [1, 2, 3, 4, 55] -> [3] -> 3
  });
	it('getMedian should return correct median for even-size array', function(){
    const sc = new StatsCollector();
    const nums = [44, 2, 3, 1];
    nums.forEach(rTime => sc.pushValue(rTime));
  	const median = sc.getMedian();
    median.should.equal(2.5);  // [44, 2, 3, 1] -> [1, 2, 3, 44] -> ([2]+[3])/2 -> 2.5
  });
  it('getAverage should return correct average value of the array elements', function(){
    const sc = new StatsCollector();
    const nums = [55, 3, 2, 4, 1];
    nums.forEach(rTime => sc.pushValue(rTime));
  	const median = sc.getAverage();
    median.should.equal(13); // (1+2+3+4+55)/5 = 65/5 = 13
  });
});

// Run all our test suites.  Only necessary in the browser.
mocha.run();
