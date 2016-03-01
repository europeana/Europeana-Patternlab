var TestUtils = function() {
};

TestUtils.prototype.constructor = TestUtils;

/**
 * Finds first child div.
 *
 * @param element to be searched
 * @return first found inner div or undefined if no div is found.
 */
TestUtils.prototype.findFirstDiv = function(element) {
  var result, child ;

  for ( i = 0; i < element.childNodes.length; i++) {
    child = element.childNodes[i];
    if (child.nodeType == 1 && child.tagName=='DIV')
      result = child;
  }

  return result;
};

/**
 * Normalizes colors to the hex format.
 *
 * If the specified color string is already hex, returns the string. If it�s
 * in rgb format, converts it to hex.
 *
 * source: http://haacked.com/archive/2009/12/29/convert-rgb-to-hex.aspx
 *
 * @return the color in the hex format
 */
TestUtils.prototype.colorToHex = function(color) {
    if (color.substr(0, 1) === '#') {
        return color;
    }
    var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

    var red = parseInt(digits[2]);
    var green = parseInt(digits[3]);
    var blue = parseInt(digits[4]);

    var rgb = blue | (green << 8) | (red << 16);
    return digits[1] + '#' + rgb.toString(16);
};

/**
 * Finds current visible color of the element and returns it
 * in hex format.
 *
 * Hex format: #rgb with all three values in hex
 *
 * @param element to be investigated
 * @return elements color in hex format
 */
TestUtils.prototype.elementColor = function(element) {
      //Chrome and Firefox
      if (document.defaultView) {
          currentColor=document.defaultView.getComputedStyle(element,null).getPropertyValue('color');

          //normalize the color to the common format
          return this.colorToHex(currentColor);
      }
      //Explorer
      if (element.currentStyle) {
          currentColor = element.currentStyle['color'];

          //normalize the color to the common format
          return currentColor;
      }
};

function safeCallCallback(callback) {
    if (callback) {
        callback();
    }
};

/**
 * Loads an external css sheet into brower. The callback function is
 * called after the sheet was loaded and applied to the DOM.
 *
 * Note: the detection on when is css really loaded is browser dependent
 * Discussion: http://www.phpied.com/when-is-a-stylesheet-really-loaded/
 *
 * @param src full filename, including path
 * @param callback to be called after the work was done
 *
 * @return link element used to load the script
 */
TestUtils.prototype.loadCss = function(src, callback) {
    var head = document.getElementsByTagName('head')[0],
    link = document.createElement('link');
    done = false,
    cache = new Date().getTime();

    function onScriptLoad() {
        if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
            done = true;
            link.onload = link.onreadystatechange = null;
            safeCallCallback(callback);
        }
    };

    link.setAttribute('href', src + '?cache=' + cache);
    link.setAttribute('type', 'text/css');
    link.setAttribute('charset', 'utf-8');
    link.setAttribute('rel', 'stylesheet');
    link.onload = link.onreadstatechange = onScriptLoad;

    head.insertBefore(link, head.firstChild);

    // The above onScriptLoad works for Internet Explorer and Opera. Neither Chrome
    // nor Firefox nor Safari fire load event. The correct solution is described
    // here: http://www.phpied.com/when-is-a-stylesheet-really-loaded/
    //
    // However, as this is only a test demo, we will not complicate the code
    // further. Instead, we will wait for 4 seconds and hope for the best.
    window.setTimeout(callback, 4000);

    return link;
};

TestUtils.prototype.loadHtml = function(src) {
    var req, body, body_content;
    req = new XMLHttpRequest();
    req.open('GET', src, false); /* synchronous */
    req.send(null);
    /* body element with children */
    body_content = req.responseText.match(/<body[\s\S]*<\/body>/);
    body = document.documentElement.getElementsByTagName('body')[0];
    /* body tag itself is ignored, only its children will be inserted */
    body.innerHTML = body_content;
    //jstestdriver.console.log(body_content + '\n\t\t(loaded html from src ' + src + ')');
}

