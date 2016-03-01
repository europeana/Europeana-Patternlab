
JS Test Driver Unit Testing


Start server command:

	cd STYLEGUIDE_ROOT
	cd source/js/test/js-test-driver-phantomjs/
	java -jar JsTestDriver-1.3.5.jar --port 9876


Then open browser at this address to begin capture:

	http://127.0.0.1:9876/capture


Start server in headless mode (requires phantomjs)

	cd STYLEGUIDE_ROOT
	cd source/js/test/js-test-driver-phantomjs/
	./server.sh start

(capture begins automatically)

Run tests:

java -jar source/js/test/js-test-driver-phantomjs/JsTestDriver-1.3.5.jar --config jsTestDriver.conf --server http://localhost:9876 --tests all --testOutput source/js/test/js-test-driver-phantomjs/reports/


Reference:

	https://github.com/larrymyers/js-test-driver-phantomjs







