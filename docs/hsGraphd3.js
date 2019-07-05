var hsGraphd3 =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./bin/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/d3-axis/src/array.js":
/*!*********************************************************************************!*\
  !*** /Users/Shared/Sites/staging/apps/hsDocs/node_modules/d3-axis/src/array.js ***!
  \*********************************************************************************/
/*! exports provided: slice */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "slice", function() { return slice; });
var slice = Array.prototype.slice;


/***/ }),

/***/ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/d3-axis/src/axis.js":
/*!********************************************************************************!*\
  !*** /Users/Shared/Sites/staging/apps/hsDocs/node_modules/d3-axis/src/axis.js ***!
  \********************************************************************************/
/*! exports provided: axisTop, axisRight, axisBottom, axisLeft */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "axisTop", function() { return axisTop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "axisRight", function() { return axisRight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "axisBottom", function() { return axisBottom; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "axisLeft", function() { return axisLeft; });
/* harmony import */ var _array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./array */ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/d3-axis/src/array.js");
/* harmony import */ var _identity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./identity */ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/d3-axis/src/identity.js");



var top = 1,
    right = 2,
    bottom = 3,
    left = 4,
    epsilon = 1e-6;

function translateX(x) {
  return "translate(" + (x + 0.5) + ",0)";
}

function translateY(y) {
  return "translate(0," + (y + 0.5) + ")";
}

function number(scale) {
  return function(d) {
    return +scale(d);
  };
}

function center(scale) {
  var offset = Math.max(0, scale.bandwidth() - 1) / 2; // Adjust for 0.5px offset.
  if (scale.round()) offset = Math.round(offset);
  return function(d) {
    return +scale(d) + offset;
  };
}

function entering() {
  return !this.__axis;
}

function axis(orient, scale) {
  var tickArguments = [],
      tickValues = null,
      tickFormat = null,
      tickSizeInner = 6,
      tickSizeOuter = 6,
      tickPadding = 3,
      k = orient === top || orient === left ? -1 : 1,
      x = orient === left || orient === right ? "x" : "y",
      transform = orient === top || orient === bottom ? translateX : translateY;

  function axis(context) {
    var values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues,
        format = tickFormat == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : _identity__WEBPACK_IMPORTED_MODULE_1__["default"]) : tickFormat,
        spacing = Math.max(tickSizeInner, 0) + tickPadding,
        range = scale.range(),
        range0 = +range[0] + 0.5,
        range1 = +range[range.length - 1] + 0.5,
        position = (scale.bandwidth ? center : number)(scale.copy()),
        selection = context.selection ? context.selection() : context,
        path = selection.selectAll(".domain").data([null]),
        tick = selection.selectAll(".tick").data(values, scale).order(),
        tickExit = tick.exit(),
        tickEnter = tick.enter().append("g").attr("class", "tick"),
        line = tick.select("line"),
        text = tick.select("text");

    path = path.merge(path.enter().insert("path", ".tick")
        .attr("class", "domain")
        .attr("stroke", "currentColor"));

    tick = tick.merge(tickEnter);

    line = line.merge(tickEnter.append("line")
        .attr("stroke", "currentColor")
        .attr(x + "2", k * tickSizeInner));

    text = text.merge(tickEnter.append("text")
        .attr("fill", "currentColor")
        .attr(x, k * spacing)
        .attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));

    if (context !== selection) {
      path = path.transition(context);
      tick = tick.transition(context);
      line = line.transition(context);
      text = text.transition(context);

      tickExit = tickExit.transition(context)
          .attr("opacity", epsilon)
          .attr("transform", function(d) { return isFinite(d = position(d)) ? transform(d) : this.getAttribute("transform"); });

      tickEnter
          .attr("opacity", epsilon)
          .attr("transform", function(d) { var p = this.parentNode.__axis; return transform(p && isFinite(p = p(d)) ? p : position(d)); });
    }

    tickExit.remove();

    path
        .attr("d", orient === left || orient == right
            ? (tickSizeOuter ? "M" + k * tickSizeOuter + "," + range0 + "H0.5V" + range1 + "H" + k * tickSizeOuter : "M0.5," + range0 + "V" + range1)
            : (tickSizeOuter ? "M" + range0 + "," + k * tickSizeOuter + "V0.5H" + range1 + "V" + k * tickSizeOuter : "M" + range0 + ",0.5H" + range1));

    tick
        .attr("opacity", 1)
        .attr("transform", function(d) { return transform(position(d)); });

    line
        .attr(x + "2", k * tickSizeInner);

    text
        .attr(x, k * spacing)
        .text(format);

    selection.filter(entering)
        .attr("fill", "none")
        .attr("font-size", 10)
        .attr("font-family", "sans-serif")
        .attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");

    selection
        .each(function() { this.__axis = position; });
  }

  axis.scale = function(_) {
    return arguments.length ? (scale = _, axis) : scale;
  };

  axis.ticks = function() {
    return tickArguments = _array__WEBPACK_IMPORTED_MODULE_0__["slice"].call(arguments), axis;
  };

  axis.tickArguments = function(_) {
    return arguments.length ? (tickArguments = _ == null ? [] : _array__WEBPACK_IMPORTED_MODULE_0__["slice"].call(_), axis) : tickArguments.slice();
  };

  axis.tickValues = function(_) {
    return arguments.length ? (tickValues = _ == null ? null : _array__WEBPACK_IMPORTED_MODULE_0__["slice"].call(_), axis) : tickValues && tickValues.slice();
  };

  axis.tickFormat = function(_) {
    return arguments.length ? (tickFormat = _, axis) : tickFormat;
  };

  axis.tickSize = function(_) {
    return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis) : tickSizeInner;
  };

  axis.tickSizeInner = function(_) {
    return arguments.length ? (tickSizeInner = +_, axis) : tickSizeInner;
  };

  axis.tickSizeOuter = function(_) {
    return arguments.length ? (tickSizeOuter = +_, axis) : tickSizeOuter;
  };

  axis.tickPadding = function(_) {
    return arguments.length ? (tickPadding = +_, axis) : tickPadding;
  };

  return axis;
}

function axisTop(scale) {
  return axis(top, scale);
}

function axisRight(scale) {
  return axis(right, scale);
}

function axisBottom(scale) {
  return axis(bottom, scale);
}

function axisLeft(scale) {
  return axis(left, scale);
}


/***/ }),

/***/ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/d3-axis/src/identity.js":
/*!************************************************************************************!*\
  !*** /Users/Shared/Sites/staging/apps/hsDocs/node_modules/d3-axis/src/identity.js ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(x) {
  return x;
});


/***/ }),

/***/ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/d3-axis/src/index.js":
/*!*********************************************************************************!*\
  !*** /Users/Shared/Sites/staging/apps/hsDocs/node_modules/d3-axis/src/index.js ***!
  \*********************************************************************************/
/*! exports provided: axisTop, axisRight, axisBottom, axisLeft */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _axis__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./axis */ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/d3-axis/src/axis.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "axisTop", function() { return _axis__WEBPACK_IMPORTED_MODULE_0__["axisTop"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "axisRight", function() { return _axis__WEBPACK_IMPORTED_MODULE_0__["axisRight"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "axisBottom", function() { return _axis__WEBPACK_IMPORTED_MODULE_0__["axisBottom"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "axisLeft", function() { return _axis__WEBPACK_IMPORTED_MODULE_0__["axisLeft"]; });




/***/ }),

/***/ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/Checksum.js":
/*!*******************************************************************************!*\
  !*** /Users/Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/Checksum.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function shortCheckSum(s) {
    var chk = 0x12345678;
    var len = s.length;
    for (var i = 0; i < len; i++) {
        chk += (s.charCodeAt(i) * (i + 1));
    }
    return (chk & 0xffffffff).toString(16);
}
exports.shortCheckSum = shortCheckSum;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hlY2tzdW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvQ2hlY2tzdW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFRQyxTQUFnQixhQUFhLENBQUMsQ0FBUTtJQUNuQyxJQUFJLEdBQUcsR0FBRyxVQUFVLENBQUM7SUFDckIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUNuQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzFCLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN0QztJQUNELE9BQU8sQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFQRCxzQ0FPQyJ9

/***/ }),

/***/ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/Date.js":
/*!***************************************************************************!*\
  !*** /Users/Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/Date.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const monthStr = [
    ['Jan', 'January'], ['Feb', 'February'], ['Mar', 'March'], ['Apr', 'April'], ['May', 'May'], ['Jun', 'June'],
    ['Jul', 'July'], ['Aug', 'August'], ['Sep', 'September'], ['Oct', 'October'], ['Nov', 'November'], ['Dec', 'December']
];
const dayStr = [
    ['Sun', 'Sunday'], ['Mon', 'Monday'], ['Tue', 'Tuesday'], ['Wed', 'Wednesday'], ['Thu', 'Thursday'], ['Fri', 'Friday'], ['Sat', 'Saturday']
];
function formatNumber(number, digits) {
    var r = '' + number;
    while (r.length < digits) {
        r = "0" + r;
    }
    return r;
}
function date(formatString, date = new Date()) {
    return (typeof formatString !== 'string' || isNaN(date.getTime())) ?
        'invalid' :
        formatString
            .replace(/%YYYY/g, '' + date.getFullYear())
            .replace(/%YY/g, '' + (date.getFullYear() % 100))
            .replace(/%MMMM/g, monthStr[date.getMonth()][1])
            .replace(/%MMM/g, monthStr[date.getMonth()][0])
            .replace(/%MM/g, formatNumber(date.getMonth() + 1, 2))
            .replace(/%M/g, '' + (date.getMonth() + 1))
            .replace(/%DDDD/g, dayStr[date.getDay()][1])
            .replace(/%DDD/g, dayStr[date.getDay()][0])
            .replace(/%DD/g, formatNumber(date.getDate(), 2))
            .replace(/%D/g, '' + date.getDate())
            .replace(/%hh/g, formatNumber(date.getHours(), 2))
            .replace(/%h/g, '' + date.getHours())
            .replace(/%mm/g, formatNumber(date.getMinutes(), 2))
            .replace(/%m/g, '' + date.getMinutes())
            .replace(/%ss/g, formatNumber(date.getSeconds(), 2))
            .replace(/%jjj/g, formatNumber(date.getMilliseconds(), 3))
            .replace(/%jj/g, formatNumber(date.getMilliseconds() / 10, 2))
            .replace(/%j/g, formatNumber(date.getMilliseconds() / 100, 1));
}
exports.date = date;
exports.ms = {
    fromMinutes: (min) => 1000 * 60 * min,
    fromHours: (h) => 1000 * 60 * 60 * h,
    fromDays: (d) => 1000 * 60 * 60 * 24 * d,
    fromWeeks: (w) => 1000 * 60 * 60 * 24 * 7 * w,
    toMinutes: (ms) => ms / (1000 * 60),
    toHours: (ms) => ms / (1000 * 60 * 60),
    toDays: (ms) => ms / (1000 * 60 * 60 * 24),
    toWeeks: (ms) => ms / (1000 * 60 * 60 * 24 * 7)
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9EYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBZUEsTUFBTSxRQUFRLEdBQUc7SUFDYixDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUM7SUFDNUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDO0NBQUMsQ0FBQztBQUc1SCxNQUFNLE1BQU0sR0FBRztJQUNYLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFDLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFDLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxFQUFDLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxFQUFDLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxFQUFDLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFDLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQztDQUFDLENBQUM7QUFHM0ksU0FBUyxZQUFZLENBQUMsTUFBYSxFQUFFLE1BQWE7SUFDOUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFDLE1BQU0sQ0FBQztJQUNsQixPQUFPLENBQUMsQ0FBQyxNQUFNLEdBQUcsTUFBTSxFQUFFO1FBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7S0FBRTtJQUMxQyxPQUFP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QUksR0FBQyxFQUFFLEdBQUMsRUFBRSxHQUFDLEVBQUUsR0FBQyxDQUFDO0lBQy9DLFNBQVMsRUFBTyxDQUFDLENBQVEsRUFBSSxFQUFFLENBQUMsSUFBSSxHQUFDLEVBQUUsR0FBQyxFQUFFLEdBQUMsRUFBRSxHQUFDLENBQUMsR0FBQyxDQUFDO0lBQ2pELFNBQVMsRUFBTyxDQUFDLEVBQVMsRUFBRyxFQUFFLENBQUMsRUFBRSxHQUFDLENBQUMsSUFBSSxHQUFDLEVBQUUsQ0FBQztJQUM1QyxPQUFPLEVBQVMsQ0FBQyxFQUFTLEVBQUcsRUFBRSxDQUFDLEVBQUUsR0FBQyxDQUFDLElBQUksR0FBQyxFQUFFLEdBQUMsRUFBRSxDQUFDO0lBQy9DLE1BQU0sRUFBVSxDQUFDLEVBQVMsRUFBRyxFQUFFLENBQUMsRUFBRSxHQUFDLENBQUMsSUFBSSxHQUFDLEVBQUUsR0FBQyxFQUFFLEdBQUMsRUFBRSxDQUFDO0lBQ2xELE9BQU8sRUFBUyxDQUFDLEVBQVMsRUFBRyxFQUFFLENBQUMsRUFBRSxHQUFDLENBQUMsSUFBSSxHQUFDLEVBQUUsR0FBQyxFQUFFLEdBQUMsRUFBRSxHQUFDLENBQUMsQ0FBQztDQUN2RCxDQUFDIn0=

/***/ }),

/***/ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/Number.js":
/*!*****************************************************************************!*\
  !*** /Users/Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/Number.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function round(n, d = 0) {
    const f = Math.pow(10, d);
    const r = Math.round(n * f) / f;
    return '' + r;
}
exports.round = round;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTnVtYmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL051bWJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVdDLFNBQWdCLEtBQUssQ0FBQyxDQUFRLEVBQUUsQ0FBQyxHQUFDLENBQUM7SUFPaEMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDO0lBQzVCLE9BQU8sRUFBRSxHQUFDLENBQUMsQ0FBQztBQUNmLENBQUM7QUFWRCxzQkFVQyJ9

/***/ }),

/***/ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/TimedPromises.js":
/*!************************************************************************************!*\
  !*** /Users/Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/TimedPromises.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function timeout(ms) {
    return new Promise((resolve, reject) => { setTimeout(reject, ms); });
}
exports.timeout = timeout;
function delay(ms) {
    return (args) => {
        return new Promise((resolve) => {
            setTimeout(() => { resolve(args); }, ms);
        });
    };
}
exports.delay = delay;
class Pace {
    constructor(pace = 100, maxConcurrent = -1) {
        this.maxConcurrent = -1;
        this.waitUntil = 0;
        this.waitCount = 0;
        this.beingCalled = 0;
        this.pace = pace + 5;
        this.maxConcurrent = maxConcurrent;
    }
    getWaitCount() { return this.waitCount; }
    getCallingCount() { return this.beingCalled; }
    add(fn) {
        return __awaiter(this, void 0, void 0, function* () {
            const addTime = Date.now();
            if (this.waitUntil < addTime) {
                this.waitUntil = addTime;
            }
            const diff = this.waitUntil - addTime;
            this.waitUntil += this.pace + 5;
            this.waitCount++;
            yield delay(diff)();
            yield new Promise(resolve => {
                const waitLoop = () => {
                    if (this.maxConcurrent < 0 || this.beingCalled < this.maxConcurrent) {
                        resolve();
                    }
                    else {
                        setTimeout(waitLoop, 10);
                    }
                };
                waitLoop();
            });
            this.waitCount--;
            this.beingCalled++;
            const ret = yield fn(Date.now() - addTime);
            this.beingCalled--;
            return ret;
        });
    }
}
exports.Pace = Pace;
function promiseChain(tasks, initialResult = []) {
    return tasks.reduce((chain, task) => chain.then((_results) => Promise.resolve(task(_results)).then((r) => {
        _results.push(r);
        return _results;
    })), Promise.resolve(initialResult));
}
exports.promiseChain = promiseChain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGltZWRQcm9taXNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9UaW1lZFByb21pc2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFXQSxTQUFnQixPQUFPLENBQUMsRUFBUztJQUM3QixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pFLENBQUM7QUFGRCwwQkFFQztBQXVCRCxTQUFnQixLQUFLLENBQUMsRUFBUztJQUMzQixPQUFPLENBQUksSUFBTyxFQUFhLEVBQUU7UUFDN0IsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQXNCLEVBQUUsRUFBRTtZQUMxQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQU5ELHNCQU1DO0FBYUQsTUFBYSxJQUFJO0lBWWIsWUFBWSxJQUFJLEdBQUMsR0FBRyxFQUFFLGFBQWEsR0FBQyxDQUFDLENBQUM7UUFYOUIsa0JBQWEsR0FBSyxDQUFDLENBQUMsQ0FBQztRQUVyQixjQUFTLEdBQVMsQ0FBQyxDQUFDO1FBQ3BCLGNBQVMsR0FBUyxDQUFDLENBQUM7UUFDcEIsZ0JBQVcsR0FBTyxDQUFDLENBQUM7UUFReEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUMsQ0FBQyxDQUFDO1FBQ25CLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxZQUFZLEtBQVEsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUM1QyxlQUFlLEtBQUssT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQVF4QyxHQUFHLENBQUMsRUFBaUM7O1lBQ3ZDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUMzQixJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxFQUFFO2dCQUFFLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO2FBQUU7WUFDM0QsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7WUFDdEMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDakIsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNwQixNQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUN4QixNQUFNLFFBQVEsR0FBRyxHQUFHLEVBQUU7b0JBQ2xCLElBQUksSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFO3dCQUNqRSxPQUFPLEVBQUUsQ0FBQztxQkFDYjt5QkFBTTt3QkFDSCxVQUFVLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3FCQUM1QjtnQkFDTCxDQUFDLENBQUM7Z0JBQ0YsUUFBUSxFQUFFLENBQUM7WUFDZixDQUFDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNqQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbkIsTUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNuQixPQUFPLEdBQUcsQ0FBQztRQUNmLENBQUM7S0FBQTtDQUNKO0FBakRELG9CQWlEQztBQVdELFNBQWdCLFlBQVksQ0FBSSxLQUFxQyxFQUFFLGdCQUFrQixFQUFFO0lBQ3ZGLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQWtCLEVBQUUsSUFBK0IsRUFBZ0IsRUFBRSxDQUV0RixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBWSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUcsRUFBRSxFQUFFO1FBRXRFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakIsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQyxDQUFDLENBQUMsRUFDSCxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUNqQyxDQUFDO0FBQ04sQ0FBQztBQVZELG9DQVVDIn0=

/***/ }),

/***/ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/index.js":
/*!****************************************************************************!*\
  !*** /Users/Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/index.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TimedPromises_1 = __webpack_require__(/*! ./TimedPromises */ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/TimedPromises.js");
exports.timeout = TimedPromises_1.timeout;
exports.delay = TimedPromises_1.delay;
var TimedPromises_2 = __webpack_require__(/*! ./TimedPromises */ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/TimedPromises.js");
exports.Pace = TimedPromises_2.Pace;
var TimedPromises_3 = __webpack_require__(/*! ./TimedPromises */ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/TimedPromises.js");
exports.promiseChain = TimedPromises_3.promiseChain;
var Checksum_1 = __webpack_require__(/*! ./Checksum */ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/Checksum.js");
exports.shortCheckSum = Checksum_1.shortCheckSum;
var Date_1 = __webpack_require__(/*! ./Date */ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/Date.js");
exports.date = Date_1.date;
exports.ms = Date_1.ms;
var Number_1 = __webpack_require__(/*! ./Number */ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/Number.js");
exports.round = Number_1.round;
var log_1 = __webpack_require__(/*! ./log */ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/log.js");
exports.log = log_1.log;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBdUQ7QUFBOUMsa0NBQUEsT0FBTyxDQUFBO0FBQUUsZ0NBQUEsS0FBSyxDQUFBO0FBQ3ZCLGlEQUF1RDtBQUE5QywrQkFBQSxJQUFJLENBQUE7QUFDYixpREFBdUQ7QUFBOUMsdUNBQUEsWUFBWSxDQUFBO0FBQ3JCLHVDQUFrRDtBQUF6QyxtQ0FBQSxhQUFhLENBQUE7QUFDdEIsK0JBQThDO0FBQXJDLHNCQUFBLElBQUksQ0FBQTtBQUFFLG9CQUFBLEVBQUUsQ0FBQTtBQUNqQixtQ0FBZ0Q7QUFBdkMseUJBQUEsS0FBSyxDQUFBO0FBQ2QsNkJBQTZDO0FBQXBDLG9CQUFBLEdBQUcsQ0FBQSJ9

/***/ }),

/***/ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/log.js":
/*!**************************************************************************!*\
  !*** /Users/Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/log.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Date_1 = __webpack_require__(/*! ./Date */ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/Date.js");
const DEBUG = Symbol('DEBUG');
const INFO = Symbol('INFO');
const WARN = Symbol('WARN');
const ERROR = Symbol('ERROR');
let gLogFile;
const gLevels = {
    [DEBUG]: { importance: 0, sym: DEBUG, desc: 'DEBUG' },
    [INFO]: { importance: 1, sym: INFO, desc: 'INFO' },
    [WARN]: { importance: 2, sym: WARN, desc: 'WARN' },
    [ERROR]: { importance: 3, sym: ERROR, desc: 'ERROR' }
};
let gGlobalLevel = gLevels[INFO];
const defDateFormat = '%YYYY%MM%DD %hh:%mm:%ss.%jjj';
let gDateFormat = defDateFormat;
let gColors = false;
const color = {
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    green: '\x1b[32m',
    bold: '\x1b[1m',
    clear: '\x1b[0m'
};
exports.log = create('', (filename, msg) => Promise.resolve(undefined), (path) => Promise.resolve(path.indexOf('/') >= 0 ? false : true));
function create(_prefix, logToFile, pathExists) {
    const context = {
        level: undefined,
        prefix: _prefix,
        logToFile: logToFile,
        pathExists: pathExists
    };
    function level(newLevelSym, setGlobalLevel = false) {
        let newLevel = gLevels[newLevelSym] || gGlobalLevel;
        let oldLevel = context.level || gGlobalLevel;
        if (newLevelSym === undefined) {
            newLevel = oldLevel;
        }
        else if (newLevelSym === null) {
            context.level = undefined;
        }
        else if (gLevels[newLevelSym]) {
            if (setGlobalLevel) {
                gGlobalLevel = newLevel;
            }
            else {
                context.level = newLevel;
            }
            const msg = `new ${setGlobalLevel ? 'global' : context.prefix} log level ${newLevel.desc.toUpperCase()} (was ${oldLevel.desc.toUpperCase()})`;
            out((newLevel.sym === oldLevel.sym) ? DEBUG : INFO, msg);
        }
        else {
            out(ERROR, `unkown level ${newLevelSym.toString()}; log level remains ${oldLevel.sym.toString()}`);
        }
        return newLevel.sym;
    }
    function debug(msg, log2File = true) {
        return __awaiter(this, void 0, void 0, function* () { return yield out(DEBUG, msg, log2File); });
    }
    function info(msg, log2File = true) {
        return __awaiter(this, void 0, void 0, function* () { return yield out(INFO, msg, log2File); });
    }
    function warn(msg, log2File = true) {
        return __awaiter(this, void 0, void 0, function* () { return yield out(WARN, msg, log2File); });
    }
    function error(msg, log2File = true) {
        return __awaiter(this, void 0, void 0, function* () { return yield out(ERROR, msg, log2File); });
    }
    function format(fmtStr) {
        if (fmtStr === null) {
            gDateFormat = defDateFormat;
        }
        else if (fmtStr) {
            gDateFormat = fmtStr;
        }
        return gDateFormat;
    }
    function prefix(prf) {
        if (prf) {
            context.prefix = prf;
        }
        return context.prefix;
    }
    function out(lvl, msg, log2File = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const colors = { [ERROR]: color.red + color.bold, [WARN]: color.yellow + color.bold, [DEBUG]: color.blue, [INFO]: color.green };
            let desc = gLevels[lvl];
            const filterLevel = context.level || gGlobalLevel;
            if (desc.importance >= filterLevel.importance) {
                const dateStr = Date_1.date(gDateFormat);
                let line = (typeof msg === 'string') ? msg : inspect(msg, 0);
                const logLine = `${dateStr} ${context.prefix} ${desc.desc} ${line}`;
                const colorLine = `${colors[lvl] || ''} ${dateStr} ${context.prefix} ${desc.desc} ${color.clear} ${line}`;
                console.log(gColors ? colorLine : logLine);
                if (msg && msg.stack) {
                    console.log(msg.stack);
                }
                if (gLogFile && log2File) {
                    return yield context.logToFile(Date_1.date(gLogFile), logLine);
                }
            }
            return undefined;
        });
    }
    function logFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (file === null) {
                gLogFile = undefined;
                return yield info("disabling logfile");
            }
            else if (file === undefined) {
                return Date_1.date(gLogFile);
            }
            else if (file.indexOf('/') >= 0) {
                return yield context.pathExists(file)
                    .then((exists) => __awaiter(this, void 0, void 0, function* () {
                    if (!exists) {
                        gLogFile = undefined;
                        return yield warn(`path '${file}' doesn't exists; logfile disabled`);
                    }
                    gLogFile = file;
                    return yield info("now logging to file " + Date_1.date(file));
                }))
                    .catch(() => __awaiter(this, void 0, void 0, function* () {
                    gLogFile = undefined;
                    return yield error(`checking path ${file}; logfile disabled`);
                }));
            }
            else if (file === '') {
                file = 'log-%YYYY-%MM-%DD.txt';
            }
            else {
            }
            gLogFile = file;
            return yield info(gLogFile ? `now logging to file ${Date_1.date(gLogFile)}` : 'logfile disbaled');
        });
    }
    function config(cfg) {
        if (cfg.colors !== undefined) {
            gColors = cfg.colors;
        }
        if (cfg.format !== undefined) {
            format(cfg.format);
        }
        if (cfg.level !== undefined) {
            level(cfg.level);
        }
    }
    function inspect(msg, depth = 1, indent = '') {
        if (depth === null) {
            depth = 999;
        }
        if (msg === null) {
            return 'null';
        }
        if (msg === undefined) {
            return 'undefined';
        }
        if (typeof msg === 'function') {
            return 'function';
        }
        if (typeof msg === 'string') {
            return `'${msg}'`;
        }
        if (typeof msg === 'object') {
            if (depth < 0) {
                return (msg.length === undefined) ? '{...}' : '[...]';
            }
            if (msg.length !== undefined) {
                return `[${msg.map((e) => (e === undefined) ? '' : inspect(e, depth - 1, indent)).join(', ')}]`;
            }
            return '{\n' + Object.keys(msg).map(k => `   ${indent}${k}: ${inspect(msg[k], depth - 1, indent + '   ')}`).join(',\n') + `\n${indent}}`;
        }
        return msg.toString();
    }
    const newLog = function (prefix, logToFile = context.logToFile, pathExists = context.pathExists) {
        return create(prefix, logToFile, pathExists);
    };
    newLog.DEBUG = DEBUG;
    newLog.INFO = INFO;
    newLog.WARN = WARN;
    newLog.ERROR = ERROR;
    newLog.level = level;
    newLog.debug = debug;
    newLog.info = info;
    newLog.warn = warn;
    newLog.error = error;
    newLog.format = format;
    newLog.prefix = prefix;
    newLog.out = out;
    newLog.logFile = logFile;
    newLog.config = config;
    newLog.inspect = inspect;
    return newLog;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBK0VBLGlDQUFrQztBQUdsQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFHOUIsTUFBTSxJQUFJLEdBQUssTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRzlCLE1BQU0sSUFBSSxHQUFLLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUc5QixNQUFNLEtBQUssR0FBSSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFHL0IsSUFBSSxRQUFnQixDQUFDO0FBU3JCLE1BQU0sT0FBTyxHQUFHO0lBQ1osQ0FBQyxLQUFLLENBQUMsRUFBSyxFQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFDO0lBQ3RELENBQUMsSUFBSSxDQUFDLEVBQU0sRUFBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUcsSUFBSSxFQUFFLE1BQU0sRUFBQztJQUNyRCxDQUFDLElBQUksQ0FBQyxFQUFNLEVBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFHLElBQUksRUFBRSxNQUFNLEVBQUM7SUFDckQsQ0FBQyxLQUFLLENBQUMsRUFBSyxFQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFDO0NBQ3pELENBQUM7QUFHRixJQUFJLFlBQVksR0FBYSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFHM0MsTUFBTSxhQUFhLEdBQUcsOEJBQThCLENBQUM7QUFDckQsSUFBSSxXQUFXLEdBQU8sYUFBYSxDQUFDO0FBR3BDLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztBQUdwQixNQUFNLEtBQUssR0FBRztJQUNWLEdBQUcsRUFBSyxVQUFV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

/***/ }),

/***/ "./bin/Axis.js":
/*!*********************!*\
  !*** ./bin/Axis.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const hsutil_1 = __webpack_require__(/*! hsutil */ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/index.js");
const log = hsutil_1.log('d3.Axis');
const GraphComponent_1 = __webpack_require__(/*! ./GraphComponent */ "./bin/GraphComponent.js");
const d3Axis = __webpack_require__(/*! d3-axis */ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/d3-axis/src/index.js");
const axisWidth = 50;
const tickWidth = 10;
var Direction;
(function (Direction) {
    Direction["Horizontal"] = "hor";
    Direction["Vertical"] = "ver";
})(Direction = exports.Direction || (exports.Direction = {}));
class Axis extends GraphComponent_1.GraphComponent {
    constructor(cfg, dir) {
        super(cfg);
        this.dir = dir;
        this.svg = cfg.baseSVG.append('g').classed(`${dir}Axis`, true);
    }
    render(data) {
        const scales = this.config.scales;
        const style = this.config.defaults.Axes[this.dir];
        let axis;
        this.svg
            .attr('stroke', style.line.color)
            .attr('stroke-width', style.line.width)
            .attr('stroke-opacity', style.line.opacity);
        if (this.dir === Direction.Horizontal) {
            const yCrossing = Math.max(axisWidth, Math.min(scales.ver.scale(0), this.config.viewPort.height - axisWidth));
            axis = d3Axis.axisTop(this.config.scales.hor.scale);
            this.svg.attr("transform", `translate(0, ${yCrossing})`);
        }
        else {
            const xCrossing = Math.max(axisWidth, Math.min(scales.hor.scale(0), this.config.viewPort.width - axisWidth));
            axis = d3Axis.axisRight(this.config.scales.ver.scale);
            this.svg.attr("transform", `translate(${xCrossing}, 0)`);
        }
        axis.tickSize(tickWidth);
        this.svg.call(axis);
        this.svg.selectAll('text').transition().duration(1000)
            .attr('style', `font-family:${style.tickLabel.font.family}; font-size:${style.tickLabel.font.size}px; font-style:${style.tickLabel.font.style}; font-weight:${style.tickLabel.font.weight};`);
    }
}
exports.Axis = Axis;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXhpcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9BeGlzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBT0EsbUNBQTBDO0FBQUcsTUFBTSxHQUFHLEdBQUcsWUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3pFLHFEQUFvRDtBQUtwRCxrQ0FBMkM7QUFFM0MsTUFBTSxTQUFTLEdBQVUsRUFBRSxDQUFDO0FBQzVCLE1BQU0sU0FBUyxHQUFVLEVBQUUsQ0FBQztBQUU1QixJQUFZLFNBR1g7QUFIRCxXQUFZLFNBQVM7SUFDakIsK0JBQW1CLENBQUE7SUFDbkIsNkJBQW1CLENBQUE7QUFDdkIsQ0FBQyxFQUhXLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBR3BCO0FBRUQsTUFBYSxJQUFLLFNBQVEsK0JBQWM7SUFLcEMsWUFBWSxHQUFZLEVBQUUsR0FBYTtRQUNuQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFTO1FBQ1osTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsRCxJQUFJLElBQUksQ0FBQztRQUNULElBQUksQ0FBQyxHQUFHO2FBQ0gsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQzthQUNoQyxJQUFJLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2FBQ3RDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWhELElBQUksSUFBSSxDQUFDLEdBQUcsS0FBRyxTQUFTLENBQUMsVUFBVSxFQUFFO1lBQ2pDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDNUcsSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxnQkFBZ0IsU0FBUyxHQUFHLENBQUMsQ0FBQztTQUM1RDthQUFNO1lBQ0gsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUMzRyxJQUFJLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLGFBQWEsU0FBUyxNQUFNLENBQUMsQ0FBQztTQUM1RDtRQUNELElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQzthQUNqRCxJQUFJLENBQUMsT0FBTyxFQUFFLGVBQWUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxlQUFlLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksa0JBQWtCLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssaUJBQWlCLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDdE0sQ0FBQztDQUNKO0FBbENELG9CQWtDQyJ9

/***/ }),

/***/ "./bin/Defaults.js":
/*!*************************!*\
  !*** ./bin/Defaults.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Defaults {
    constructor(config) {
        this.axes = {};
        this.scales = {};
    }
    get Graph() {
        return { canvas: defaultRect('#fff', 2, '#ccc') };
    }
    get Plot() {
        return { area: defaultRect('#fff') };
    }
    get Series() {
        return [];
    }
    get Axes() {
        return {
            hor: {
                line: defaultLine(2),
                tickMarks: defaultLine(2),
                tickLabel: defaultText()
            },
            ver: {
                line: defaultLine(2),
                tickMarks: defaultLine(2),
                tickLabel: defaultText()
            }
        };
    }
    Scales(dataCol) {
        return this.scales[dataCol] = this.scales[dataCol] || defaultScale(0, 100);
    }
}
exports.Defaults = Defaults;
function defaultLine(width, color = '#000') {
    return {
        width: width,
        color: color,
        opacity: 1
    };
}
exports.defaultLine = defaultLine;
function defaultRect(area, borderWidth = 0, borderColor = '#fff') {
    return {
        rx: 0,
        ry: 0,
        fill: {
            color: area,
            opacity: 1
        },
        stroke: {
            width: borderWidth,
            color: borderColor,
            opacity: 1
        }
    };
}
function defaultScale(minRange, maxRange) {
    return {
        type: 'linear',
        domain: { min: 'auto', max: 'auto' },
        range: { min: minRange, max: maxRange }
    };
}
function defaultText() {
    return {
        color: '#000',
        font: {
            family: 'sans-serif',
            size: 20,
            style: 'normal',
            weight: 'normal'
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVmYXVsdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvRGVmYXVsdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUF1QkEsTUFBYSxRQUFRO0lBS2pCLFlBQVksTUFBZ0I7UUFKcEIsU0FBSSxHQUFHLEVBQUUsQ0FBQztRQUVWLFdBQU0sR0FBRyxFQUFFLENBQUM7SUFFVyxDQUFDO0lBRWhDLElBQUksS0FBSztRQUNMLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUN0RCxDQUFDO0lBRUQsSUFBSSxJQUFJO1FBQ0osT0FBTyxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ04sT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQsSUFBSSxJQUFJO1FBQWtCLE9BQU87WUFDN0IsR0FBRyxFQUFFO2dCQUNELElBQUksRUFBUSxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixTQUFTLEVBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDMUIsU0FBUyxFQUFHLFdBQVcsRUFBRTthQUM1QjtZQUNELEdBQUcsRUFBRTtnQkFDRCxJQUFJLEVBQVEsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDMUIsU0FBUyxFQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLFNBQVMsRUFBRyxXQUFXLEVBQUU7YUFDNUI7U0FDSixDQUFDO0lBQUEsQ0FBQztJQUVILE1BQU0sQ0FBQyxPQUFlO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDL0UsQ0FBQztDQUNKO0FBbkNELDRCQW1DQztBQUVELFNBQWdCLFdBQVcsQ0FBQyxLQUFZLEVBQUUsUUFBWSxNQUFNO0lBQ3hELE9BQU87UUFDSCxLQUFLLEVBQUUsS0FBSztRQUNaLEtBQUssRUFBRSxLQUFLO1FBQ1osT0FBTyxFQUFFLENBQUM7S0FDYixDQUFDO0FBQ04sQ0FBQztBQU5ELGtDQU1DO0FBUUQsU0FBUyxXQUFXLENBQUMsSUFBVSxFQUFFLGNBQW1CLENBQUMsRUFBRSxjQUFrQixNQUFNO0lBQzNFLE9BQU87UUFDSCxFQUFFLEVBQUUsQ0FBQztRQUNMLEVBQUUsRUFBRSxDQUFDO1FBQ0wsSUFBSSxFQUFFO1lBQ0YsS0FBSyxFQUFFLElBQUk7WUFDWCxPQUFPLEVBQUUsQ0FBQztTQUNiO1FBQ0QsTUFBTSxFQUFFO1lBQ0osS0FBSyxFQUFFLFdBQVc7WUFDbEIsS0FBSyxFQUFFLFdBQVc7WUFDbEIsT0FBTyxFQUFFLENBQUM7U0FDYjtLQUNKLENBQUM7QUFDTixDQUFDO0FBRUQsU0FBUyxZQUFZLENBQUMsUUFBZ0IsRUFBRSxRQUFlO0lBQWtCLE9BQU87UUFDNUUsSUFBSSxFQUFJLFFBQVE7UUFDaEIsTUFBTSxFQUFFLEVBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFDO1FBQ2xDLEtBQUssRUFBRyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRTtLQUMzQyxDQUFDO0FBQUEsQ0FBQztBQUVILFNBQVMsV0FBVztJQUNoQixPQUFPO1FBQ0gsS0FBSyxFQUFFLE1BQU07UUFDYixJQUFJLEVBQUU7WUFDRixNQUFNLEVBQUUsWUFBWTtZQUNwQixJQUFJLEVBQUksRUFBRTtZQUNWLEtBQUssRUFBRSxRQUFRO1lBQ2YsTUFBTSxFQUFFLFFBQVE7U0FDbkI7S0FDSixDQUFDO0FBQ04sQ0FBQyJ9

/***/ }),

/***/ "./bin/Graph.js":
/*!**********************!*\
  !*** ./bin/Graph.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const hsutil_1 = __webpack_require__(/*! hsutil */ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/index.js");
const log = hsutil_1.log('d3.Graph');
const d3 = __webpack_require__(/*! d3 */ "d3");
const Plot_1 = __webpack_require__(/*! ./Plot */ "./bin/Plot.js");
const Axis_1 = __webpack_require__(/*! ./Axis */ "./bin/Axis.js");
const GraphComponent_1 = __webpack_require__(/*! ./GraphComponent */ "./bin/GraphComponent.js");
const margin = 10;
log.info('Graph3D');
function createBaseSVG(cfg) {
    const base = d3.select(cfg.root);
    base.selectAll('div').remove();
    base.selectAll('svg').remove();
    const svg = base.append('svg')
        .classed('baseSVG', true)
        .attr('height', '100%')
        .attr('width', '100%')
        .attr('preserveAspectRatio', 'xMinYMin meet');
    cfg.baseSVG = svg;
    svg.append('rect')
        .classed('baseRect', true)
        .attr('x', 0)
        .attr('y', 0);
    return svg;
}
function updateBaseSVG(cfg) {
    cfg.baseSVG.attr('viewBox', `0 0 ${cfg.viewPort.width} ${cfg.viewPort.height}`);
}
class Graph extends GraphComponent_1.GraphComponent {
    constructor(root) {
        super();
        this.axes = [];
        this.cumulativeDomains = {};
        this.config.root = root;
        log.info('creating Graph');
        const base = createBaseSVG(this.config);
        updateBaseSVG(this.config);
        this.plot = new Plot_1.Plot(this.config);
        this.axes.push(new Axis_1.Axis(this.config, Axis_1.Direction.Horizontal));
        this.axes.push(new Axis_1.Axis(this.config, Axis_1.Direction.Vertical));
        window.onresize = () => this.resize();
    }
    get defaults() {
        return this.config.defaults;
    }
    resize() {
        const cfg = this.config;
        if (cfg.root.clientWidth > 0) {
            if (cfg.root.clientWidth !== cfg.client.width || cfg.root.clientHeight !== cfg.client.height) {
                log.info(`resizing svg: [${cfg.client.width} x ${cfg.client.height}] -> [${cfg.root.clientWidth} x ${cfg.root.clientHeight}]`);
                cfg.client.width = cfg.root.clientWidth;
                cfg.client.height = cfg.root.clientHeight;
                cfg.viewPort.height = cfg.viewPort.width * cfg.root.clientHeight / cfg.root.clientWidth;
                updateBaseSVG(cfg);
            }
        }
    }
    render(data) {
        this.setScales(data);
        this.drawCanvas(this.config);
        this.plot.setBorders(10, 10, 10, 10);
        this.plot.render(data);
        this.axes.forEach(a => a.render(data));
    }
    addSeries(type, x, y, ...params) {
        this.resize();
        this.config.scales.hor.dataCol = x;
        this.config.scales.ver.dataCol = y;
        this.plot.addSeries(type, x, y, ...params);
    }
    drawCanvas(cfg) {
        const canvas = cfg.defaults.Graph.canvas;
        d3.select('.baseRect')
            .attr('width', cfg.viewPort.width)
            .attr('height', cfg.viewPort.height)
            .attr('rx', canvas.rx)
            .attr('ry', canvas.ry)
            .attr('stroke', canvas.stroke.color)
            .attr('stroke-width', canvas.stroke.width)
            .attr('stroke-opacity', canvas.stroke.opacity)
            .attr('fill', canvas.fill.color)
            .attr('fill-opacity', canvas.fill.opacity);
    }
    setScales(data) {
        function expandDomain(domains, colName) {
            domains[colName] = domains[colName] || [1e90, -1e90];
            const dataDom = data.findDomain(colName);
            domains[colName][0] = Math.min(domains[colName][0], dataDom[0]);
            domains[colName][1] = Math.max(domains[colName][1], dataDom[1]);
            return domains[colName];
        }
        const hor = this.config.scales.hor;
        const ver = this.config.scales.ver;
        hor.scale = d3.scaleLinear()
            .domain(expandDomain(this.cumulativeDomains, hor.dataCol))
            .range([margin, this.config.viewPort.width - 2 * margin]);
        ver.scale = d3.scaleLinear()
            .domain(expandDomain(this.cumulativeDomains, ver.dataCol))
            .range([this.config.viewPort.height - 2 * margin, margin]);
    }
}
exports.Graph = Graph;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JhcGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvR3JhcGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFvREEsbUNBQTBDO0FBQUcsTUFBTSxHQUFHLEdBQUcsWUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzFFLHlCQUFzQztBQU90QyxpQ0FBMEM7QUFDMUMsaUNBQTBDO0FBQzFDLHFEQUFvRDtBQUVwRCxNQUFNLE1BQU0sR0FBVSxFQUFFLENBQUM7QUFFekIsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQU9wQixTQUFTLGFBQWEsQ0FBQyxHQUFhO0lBQ2hDLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDL0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUMvQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztTQUN6QixPQUFPLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQztTQUN4QixJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQztTQUN0QixJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQztTQUNyQixJQUFJLENBQUMscUJBQXFCLEVBQUUsZUFBZSxDQUFDLENBQzVDO0lBQ0wsR0FBRyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7SUFDbEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7U0FDYixPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQztTQUN6QixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztTQUNaLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDbEIsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBTUQsU0FBUyxhQUFhLENBQUMsR0FBYTtJQUNoQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDcEYsQ0FBQztBQUdELE1BQWEsS0FBTSxTQUFRLCtCQUFjO0lBS3JDLFlBQVksSUFBUTtRQUNoQixLQUFLLEVBQUUsQ0FBQztRQUpKLFNBQUksR0FBVSxFQUFFLENBQUM7UUFDakIsc0JBQWlCLEdBQXlDLEVBQUUsQ0FBQztRQUlqRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDeEIsR0FBRyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzNCLE1BQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksV0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLFdBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGdCQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLFdBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGdCQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUMxRCxNQUFNLENBQUMsUUFBUSxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBRUQsSUFBVyxRQUFRO1FBQ2YsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUNoQyxDQUFDO0lBRUQsTUFBTTtRQUNGLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDeEIsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUU7WUFDMUIsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtnQkFDMUYsR0FBRyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO2dCQUMvSCxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztnQkFDeEMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQzFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUN4RixhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDdEI7U0FDSjtJQUNMLENBQUM7SUFNTSxNQUFNLENBQUMsSUFBUztRQUNuQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFPTSxTQUFTLENBQUMsSUFBVyxFQUFFLENBQVEsRUFBRSxDQUFRLEVBQUUsR0FBRyxNQUFlO1FBQ2hFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQU1PLFVBQVUsQ0FBQyxHQUFhO1FBQzVCLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUN6QyxFQUFFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQzthQUNyQixJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO2FBQ2pDLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7YUFDbkMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDO2FBQ3JCLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQzthQUNyQixJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2FBQ25DLElBQUksQ0FBQyxjQUFjLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7YUFDekMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO2FBQzdDLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDL0IsSUFBSSxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFTyxTQUFTLENBQUMsSUFBUztRQUV2QixTQUFTLFlBQVksQ0FBQyxPQUFvQyxFQUFFLE9BQWM7WUFDdEUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JELE1BQU0sT0FBTyxHQUF3QixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzlELE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEUsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUNELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNuQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDbkMsR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsV0FBVyxFQUFFO2FBQ3ZCLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUN6RCxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFDLENBQUMsR0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzFELEdBQUcsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsRUFBRTthQUN2QixNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDekQsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFDLENBQUMsR0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUMvRCxDQUFDO0NBQ0o7QUE5RkQsc0JBOEZDIn0=

/***/ }),

/***/ "./bin/GraphComponent.js":
/*!*******************************!*\
  !*** ./bin/GraphComponent.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __webpack_require__(/*! ../../node_modules/hsutil/index */ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/index.js");
const log = index_1.log('d3.GraphComponent');
const Defaults_1 = __webpack_require__(/*! ./Defaults */ "./bin/Defaults.js");
const vpWidth = 1000;
class GraphComponent {
    constructor(cfg) {
        this.config = cfg || {
            root: undefined,
            baseSVG: undefined,
            client: {
                x: 0, y: 0,
                width: 0, height: 0
            },
            viewPort: {
                width: vpWidth,
                height: vpWidth * 0.7
            },
            defaults: undefined,
            scales: {
                hor: { dataCol: undefined, scale: undefined },
                ver: { dataCol: undefined, scale: undefined }
            }
        };
        this.config.defaults = new Defaults_1.Defaults(this.config);
    }
}
exports.GraphComponent = GraphComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JhcGhDb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvR3JhcGhDb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFNQSwyREFBK0Q7QUFBRyxNQUFNLEdBQUcsR0FBRyxXQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUN4Ryx5Q0FBMEM7QUFLMUMsTUFBTSxPQUFPLEdBQWEsSUFBSSxDQUFDO0FBRS9CLE1BQXNCLGNBQWM7SUFFaEMsWUFBWSxHQUFjO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxJQUFJO1lBQ2pCLElBQUksRUFBRSxTQUFTO1lBQ2YsT0FBTyxFQUFFLFNBQVM7WUFDbEIsTUFBTSxFQUFFO2dCQUNKLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUM7Z0JBQ1IsS0FBSyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQzthQUN0QjtZQUNELFFBQVEsRUFBRTtnQkFDTixLQUFLLEVBQUUsT0FBTztnQkFDZCxNQUFNLEVBQUUsT0FBTyxHQUFHLEdBQUc7YUFDeEI7WUFDRCxRQUFRLEVBQUUsU0FBUztZQUNuQixNQUFNLEVBQUU7Z0JBQ0osR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFDO2dCQUM1QyxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUM7YUFDL0M7U0FDSixDQUFDO1FBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxtQkFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyRCxDQUFDO0NBRUo7QUF2QkQsd0NBdUJDIn0=

/***/ }),

/***/ "./bin/Plot.js":
/*!*********************!*\
  !*** ./bin/Plot.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __webpack_require__(/*! ../../node_modules/hsutil/index */ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/index.js");
const log = index_1.log('d3.Plot');
const GraphComponent_1 = __webpack_require__(/*! ./GraphComponent */ "./bin/GraphComponent.js");
const bubble_1 = __webpack_require__(/*! ./bubble */ "./bin/bubble.js");
const DEF_RADIUS = 5;
class Plot extends GraphComponent_1.GraphComponent {
    constructor(cfg) {
        super(cfg);
        this.series = [];
        this.desc = {
            cfg: cfg,
            margin: { left: 0, top: 0, right: 0, bottom: 0 },
            plotBase: cfg.baseSVG.append('svg').classed('plotSVG', true)
        };
        const margin = this.desc.margin;
        this.desc.plotBase.append('rect').classed('plotRect', true);
        Plot.register('bubble', bubble_1.bubble);
    }
    static register(key, fn) {
        this.plotFnMap[key] = fn;
        log.info(`registered plot type '${key}'`);
    }
    setBorders(left, top, right, bottom) {
        const margin = this.desc.margin;
        margin.left = left;
        margin.right = right;
        margin.top = top;
        margin.bottom = bottom;
    }
    addSeries(type, ...params) {
        const fn = Plot.plotFnMap[type];
        const seriesKey = `${type} ${params.join(' ')}`;
        this.series[seriesKey] = [type].concat(params);
        if (fn) {
            this.series.push((data) => fn(data, this.desc, ...params));
            log.info(`added series ${this.series.length} as '${seriesKey}'`);
        }
        else {
            log.error(`unknown plot type ${type}; available types are:\n   '${Object.keys(Plot.plotFnMap).join("'\n   '")}'`);
        }
    }
    render(data) {
        this.renderPlotArea();
        this.series.forEach((s) => s(data));
    }
    renderPlotArea() {
        const margin = this.desc.margin;
        const plotArea = this.desc.cfg.defaults.Plot.area;
        this.desc.plotBase.select('.plotRect')
            .attr('x', margin.left)
            .attr('y', margin.top)
            .attr('width', this.desc.cfg.viewPort.width - margin.left - margin.right)
            .attr('height', this.desc.cfg.viewPort.height - margin.top - margin.bottom)
            .attr('rx', plotArea.rx)
            .attr('ry', plotArea.ry)
            .attr('stroke', plotArea.stroke.color)
            .attr('stroke-width', plotArea.stroke.width)
            .attr('stroke-opacity', plotArea.stroke.opacity)
            .attr('fill', plotArea.fill.color)
            .attr('fill-opacity', plotArea.fill.opacity);
    }
}
Plot.plotFnMap = {};
exports.Plot = Plot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9QbG90LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBUUEsMkRBQW1FO0FBQUcsTUFBTSxHQUFHLEdBQUcsV0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBS2xHLHFEQUFvRDtBQUdwRCxxQ0FBNEM7QUFFNUMsTUFBTSxVQUFVLEdBQVUsQ0FBQyxDQUFDO0FBRTVCLE1BQWEsSUFBSyxTQUFRLCtCQUFjO0lBZXBDLFlBQVksR0FBWTtRQUNwQixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFIUCxXQUFNLEdBQVksRUFBRSxDQUFDO1FBSXpCLElBQUksQ0FBQyxJQUFJLEdBQUc7WUFDUixHQUFHLEVBQUUsR0FBRztZQUNSLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFDLENBQUMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBQyxDQUFDLEVBQUM7WUFDM0MsUUFBUSxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDO1NBQy9ELENBQUM7UUFDRixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxlQUFNLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBbkJNLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBVSxFQUFFLEVBQVk7UUFDM0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDekIsR0FBRyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxH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

/***/ }),

/***/ "./bin/bubble.js":
/*!***********************!*\
  !*** ./bin/bubble.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const hsutil_1 = __webpack_require__(/*! hsutil */ "../../../../../../../../../../Shared/Sites/staging/apps/hsDocs/node_modules/hsutil/index.js");
const log = hsutil_1.log('d3.bubble');
const d3 = __webpack_require__(/*! d3 */ "d3");
const DEF_RADIUS = 5;
exports.bubble = (data, desc, cx, cy, r) => {
    const ix = data.colNumber(cx);
    const iy = data.colNumber(cy);
    const ir = data.colNumber(r);
    const scaleX = desc.cfg.scales.hor.scale;
    const scaleY = desc.cfg.scales.ver.scale;
    const defR = desc.cfg.defaults.Scales(r);
    const scaleR = d3.scaleLinear().domain(data.findDomain(r)).range([defR.range.min, defR.range.max]);
    const svg = desc.cfg.baseSVG;
    const circles = svg.selectAll("circle").data(data.getData());
    circles.exit().remove();
    circles.enter().append('circle');
    circles.transition().duration(1000)
        .attr("cx", d => scaleX(d[ix]))
        .attr("cy", d => scaleY(d[iy]))
        .attr("r", d => scaleR(ir === undefined ? DEF_RADIUS : d[ir]))
        .attr('fill', (d, i) => ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'][i]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnViYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2J1YmJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLG1DQUEwQztBQUFHLE1BQU0sR0FBRyxHQUFHLFlBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUMzRSx5QkFBc0M7QUFNdEMsTUFBTSxVQUFVLEdBQVUsQ0FBQyxDQUFDO0FBU2YsUUFBQSxNQUFNLEdBQWEsQ0FBQyxJQUFTLEVBQUUsSUFBYSxFQUFFLEVBQVMsRUFBRSxFQUFTLEVBQUUsQ0FBUyxFQUFFLEVBQUU7SUFDMUYsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM5QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzlCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztJQUN6QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO0lBQ3pDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QyxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsTUFBTSxDQUFZLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDOUcsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7SUFDN0IsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFFN0QsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3hCLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFakMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7U0FDOUIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUN0QyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3RDLElBQUksQ0FBQyxHQUFHLEVBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFHLFNBQVMsQ0FBQSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNuRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQzFFO0FBQ1QsQ0FBQyxDQUFDIn0=

/***/ }),

/***/ "./bin/index.js":
/*!**********************!*\
  !*** ./bin/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Graph_1 = __webpack_require__(/*! ./Graph */ "./bin/Graph.js");
exports.Graph = Graph_1.Graph;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBbUM7QUFBMUIsd0JBQUEsS0FBSyxDQUFBIn0=

/***/ }),

/***/ "d3":
/*!*********************!*\
  !*** external "d3" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = d3;

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oc0dyYXBoZDMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vaHNHcmFwaGQzLy9Vc2Vycy9TaGFyZWQvU2l0ZXMvc3RhZ2luZy9hcHBzL2hzRG9jcy9ub2RlX21vZHVsZXMvZDMtYXhpcy9zcmMvYXJyYXkuanMiLCJ3ZWJwYWNrOi8vaHNHcmFwaGQzLy9Vc2Vycy9TaGFyZWQvU2l0ZXMvc3RhZ2luZy9hcHBzL2hzRG9jcy9ub2RlX21vZHVsZXMvZDMtYXhpcy9zcmMvYXhpcy5qcyIsIndlYnBhY2s6Ly9oc0dyYXBoZDMvL1VzZXJzL1NoYXJlZC9TaXRlcy9zdGFnaW5nL2FwcHMvaHNEb2NzL25vZGVfbW9kdWxlcy9kMy1heGlzL3NyYy9pZGVudGl0eS5qcyIsIndlYnBhY2s6Ly9oc0dyYXBoZDMvL1VzZXJzL1NoYXJlZC9TaXRlcy9zdGFnaW5nL2FwcHMvaHNEb2NzL25vZGVfbW9kdWxlcy9kMy1heGlzL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9oc0dyYXBoZDMvL1VzZXJzL1NoYXJlZC9TaXRlcy9zdGFnaW5nL2FwcHMvaHNEb2NzL25vZGVfbW9kdWxlcy9oc3V0aWwvQ2hlY2tzdW0uanMiLCJ3ZWJwYWNrOi8vaHNHcmFwaGQzLy9Vc2Vycy9TaGFyZWQvU2l0ZXMvc3RhZ2luZy9hcHBzL2hzRG9jcy9ub2RlX21vZHVsZXMvaHN1dGlsL0RhdGUuanMiLCJ3ZWJwYWNrOi8vaHNHcmFwaGQzLy9Vc2Vycy9TaGFyZWQvU2l0ZXMvc3RhZ2luZy9hcHBzL2hzRG9jcy9ub2RlX21vZHVsZXMvaHN1dGlsL051bWJlci5qcyIsIndlYnBhY2s6Ly9oc0dyYXBoZDMvL1VzZXJzL1NoYXJlZC9TaXRlcy9zdGFnaW5nL2FwcHMvaHNEb2NzL25vZGVfbW9kdWxlcy9oc3V0aWwvVGltZWRQcm9taXNlcy5qcyIsIndlYnBhY2s6Ly9oc0dyYXBoZDMvL1VzZXJzL1NoYXJlZC9TaXRlcy9zdGFnaW5nL2FwcHMvaHNEb2NzL25vZGVfbW9kdWxlcy9oc3V0aWwvaW5kZXguanMiLCJ3ZWJwYWNrOi8vaHNHcmFwaGQzLy9Vc2Vycy9TaGFyZWQvU2l0ZXMvc3RhZ2luZy9hcHBzL2hzRG9jcy9ub2RlX21vZHVsZXMvaHN1dGlsL2xvZy5qcyIsIndlYnBhY2s6Ly9oc0dyYXBoZDMvLi9iaW4vQXhpcy5qcyIsIndlYnBhY2s6Ly9oc0dyYXBoZDMvLi9iaW4vRGVmYXVsdHMuanMiLCJ3ZWJwYWNrOi8vaHNHcmFwaGQzLy4vYmluL0dyYXBoLmpzIiwid2VicGFjazovL2hzR3JhcGhkMy8uL2Jpbi9HcmFwaENvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly9oc0dyYXBoZDMvLi9iaW4vUGxvdC5qcyIsIndlYnBhY2s6Ly9oc0dyYXBoZDMvLi9iaW4vYnViYmxlLmpzIiwid2VicGFjazovL2hzR3JhcGhkMy8uL2Jpbi9pbmRleC5qcyIsIndlYnBhY2s6Ly9oc0dyYXBoZDMvZXh0ZXJuYWwgXCJkM1wiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtB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Q0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLElBQUk7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsS0FBSyxHQUFHLGlCQUFpQjtBQUN0RDtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsbUJBQW1CLE9BQU8sVUFBVTtBQUN6RTtBQUNBO0FBQ0EsMkNBQTJDLE1BQU0sNkJBQTZCLDRDQUE0QztBQUMxSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQywrekg7Ozs7Ozs7Ozs7OztBQ2xFOUI7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RCxpQkFBaUIsbUJBQU8sQ0FBQywyR0FBUTtBQUNqQztBQUNBLFdBQVcsbUJBQU8sQ0FBQyxjQUFJO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLG1vRTs7Ozs7Ozs7Ozs7O0FDeEI5QjtBQUNiLDhDQUE4QyxjQUFjO0FBQzVELGNBQWMsbUJBQU8sQ0FBQywrQkFBUztBQUMvQjtBQUNBLDJDQUEyQywrTDs7Ozs7Ozs7Ozs7QUNKM0Msb0IiLCJmaWxlIjoiaHNHcmFwaGQzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9iaW4vaW5kZXguanNcIik7XG4iLCJleHBvcnQgdmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuIiwiaW1wb3J0IHtzbGljZX0gZnJvbSBcIi4vYXJyYXlcIjtcbmltcG9ydCBpZGVudGl0eSBmcm9tIFwiLi9pZGVudGl0eVwiO1xuXG52YXIgdG9wID0gMSxcbiAgICByaWdodCA9IDIsXG4gICAgYm90dG9tID0gMyxcbiAgICBsZWZ0ID0gNCxcbiAgICBlcHNpbG9uID0gMWUtNjtcblxuZnVuY3Rpb24gdHJhbnNsYXRlWCh4KSB7XG4gIHJldHVybiBcInRyYW5zbGF0ZShcIiArICh4ICsgMC41KSArIFwiLDApXCI7XG59XG5cbmZ1bmN0aW9uIHRyYW5zbGF0ZVkoeSkge1xuICByZXR1cm4gXCJ0cmFuc2xhdGUoMCxcIiArICh5ICsgMC41KSArIFwiKVwiO1xufVxuXG5mdW5jdGlvbiBudW1iZXIoc2NhbGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGQpIHtcbiAgICByZXR1cm4gK3NjYWxlKGQpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjZW50ZXIoc2NhbGUpIHtcbiAgdmFyIG9mZnNldCA9IE1hdGgubWF4KDAsIHNjYWxlLmJhbmR3aWR0aCgpIC0gMSkgLyAyOyAvLyBBZGp1c3QgZm9yIDAuNXB4IG9mZnNldC5cbiAgaWYgKHNjYWxlLnJvdW5kKCkpIG9mZnNldCA9IE1hdGgucm91bmQob2Zmc2V0KTtcbiAgcmV0dXJuIGZ1bmN0aW9uKGQpIHtcbiAgICByZXR1cm4gK3NjYWxlKGQpICsgb2Zmc2V0O1xuICB9O1xufVxuXG5mdW5jdGlvbiBlbnRlcmluZygpIHtcbiAgcmV0dXJuICF0aGlzLl9fYXhpcztcbn1cblxuZnVuY3Rpb24gYXhpcyhvcmllbnQsIHNjYWxlKSB7XG4gIHZhciB0aWNrQXJndW1lbnRzID0gW10sXG4gICAgICB0aWNrVmFsdWVzID0gbnVsbCxcbiAgICAgIHRpY2tGb3JtYXQgPSBudWxsLFxuICAgICAgdGlja1NpemVJbm5lciA9IDYsXG4gICAgICB0aWNrU2l6ZU91dGVyID0gNixcbiAgICAgIHRpY2tQYWRkaW5nID0gMyxcbiAgICAgIGsgPSBvcmllbnQgPT09IHRvcCB8fCBvcmllbnQgPT09IGxlZnQgPyAtMSA6IDEsXG4gICAgICB4ID0gb3JpZW50ID09PSBsZWZ0IHx8IG9yaWVudCA9PT0gcmlnaHQgPyBcInhcIiA6IFwieVwiLFxuICAgICAgdHJhbnNmb3JtID0gb3JpZW50ID09PSB0b3AgfHwgb3JpZW50ID09PSBib3R0b20gPyB0cmFuc2xhdGVYIDogdHJhbnNsYXRlWTtcblxuICBmdW5jdGlvbiBheGlzKGNvbnRleHQpIHtcbiAgICB2YXIgdmFsdWVzID0gdGlja1ZhbHVlcyA9PSBudWxsID8gKHNjYWxlLnRpY2tzID8gc2NhbGUudGlja3MuYXBwbHkoc2NhbGUsIHRpY2tBcmd1bWVudHMpIDogc2NhbGUuZG9tYWluKCkpIDogdGlja1ZhbHVlcyxcbiAgICAgICAgZm9ybWF0ID0gdGlja0Zvcm1hdCA9PSBudWxsID8gKHNjYWxlLnRpY2tGb3JtYXQgPyBzY2FsZS50aWNrRm9ybWF0LmFwcGx5KHNjYWxlLCB0aWNrQXJndW1lbnRzKSA6IGlkZW50aXR5KSA6IHRpY2tGb3JtYXQsXG4gICAgICAgIHNwYWNpbmcgPSBNYXRoLm1heCh0aWNrU2l6ZUlubmVyLCAwKSArIHRpY2tQYWRkaW5nLFxuICAgICAgICByYW5nZSA9IHNjYWxlLnJhbmdlKCksXG4gICAgICAgIHJhbmdlMCA9ICtyYW5nZVswXSArIDAuNSxcbiAgICAgICAgcmFuZ2UxID0gK3JhbmdlW3JhbmdlLmxlbmd0aCAtIDFdICsgMC41LFxuICAgICAgICBwb3NpdGlvbiA9IChzY2FsZS5iYW5kd2lkdGggPyBjZW50ZXIgOiBudW1iZXIpKHNjYWxlLmNvcHkoKSksXG4gICAgICAgIHNlbGVjdGlvbiA9IGNvbnRleHQuc2VsZWN0aW9uID8gY29udGV4dC5zZWxlY3Rpb24oKSA6IGNvbnRleHQsXG4gICAgICAgIHBhdGggPSBzZWxlY3Rpb24uc2VsZWN0QWxsKFwiLmRvbWFpblwiKS5kYXRhKFtudWxsXSksXG4gICAgICAgIHRpY2sgPSBzZWxlY3Rpb24uc2VsZWN0QWxsKFwiLnRpY2tcIikuZGF0YSh2YWx1ZXMsIHNjYWxlKS5vcmRlcigpLFxuICAgICAgICB0aWNrRXhpdCA9IHRpY2suZXhpdCgpLFxuICAgICAgICB0aWNrRW50ZXIgPSB0aWNrLmVudGVyKCkuYXBwZW5kKFwiZ1wiKS5hdHRyKFwiY2xhc3NcIiwgXCJ0aWNrXCIpLFxuICAgICAgICBsaW5lID0gdGljay5zZWxlY3QoXCJsaW5lXCIpLFxuICAgICAgICB0ZXh0ID0gdGljay5zZWxlY3QoXCJ0ZXh0XCIpO1xuXG4gICAgcGF0aCA9IHBhdGgubWVyZ2UocGF0aC5lbnRlcigpLmluc2VydChcInBhdGhcIiwgXCIudGlja1wiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwiZG9tYWluXCIpXG4gICAgICAgIC5hdHRyKFwic3Ryb2tlXCIsIFwiY3VycmVudENvbG9yXCIpKTtcblxuICAgIHRpY2sgPSB0aWNrLm1lcmdlKHRpY2tFbnRlcik7XG5cbiAgICBsaW5lID0gbGluZS5tZXJnZSh0aWNrRW50ZXIuYXBwZW5kKFwibGluZVwiKVxuICAgICAgICAuYXR0cihcInN0cm9rZVwiLCBcImN1cnJlbnRDb2xvclwiKVxuICAgICAgICAuYXR0cih4ICsgXCIyXCIsIGsgKiB0aWNrU2l6ZUlubmVyKSk7XG5cbiAgICB0ZXh0ID0gdGV4dC5tZXJnZSh0aWNrRW50ZXIuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgICAuYXR0cihcImZpbGxcIiwgXCJjdXJyZW50Q29sb3JcIilcbiAgICAgICAgLmF0dHIoeCwgayAqIHNwYWNpbmcpXG4gICAgICAgIC5hdHRyKFwiZHlcIiwgb3JpZW50ID09PSB0b3AgPyBcIjBlbVwiIDogb3JpZW50ID09PSBib3R0b20gPyBcIjAuNzFlbVwiIDogXCIwLjMyZW1cIikpO1xuXG4gICAgaWYgKGNvbnRleHQgIT09IHNlbGVjdGlvbikge1xuICAgICAgcGF0aCA9IHBhdGgudHJhbnNpdGlvbihjb250ZXh0KTtcbiAgICAgIHRpY2sgPSB0aWNrLnRyYW5zaXRpb24oY29udGV4dCk7XG4gICAgICBsaW5lID0gbGluZS50cmFuc2l0aW9uKGNvbnRleHQpO1xuICAgICAgdGV4dCA9IHRleHQudHJhbnNpdGlvbihjb250ZXh0KTtcblxuICAgICAgdGlja0V4aXQgPSB0aWNrRXhpdC50cmFuc2l0aW9uKGNvbnRleHQpXG4gICAgICAgICAgLmF0dHIoXCJvcGFjaXR5XCIsIGVwc2lsb24pXG4gICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gaXNGaW5pdGUoZCA9IHBvc2l0aW9uKGQpKSA/IHRyYW5zZm9ybShkKSA6IHRoaXMuZ2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIpOyB9KTtcblxuICAgICAgdGlja0VudGVyXG4gICAgICAgICAgLmF0dHIoXCJvcGFjaXR5XCIsIGVwc2lsb24pXG4gICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCkgeyB2YXIgcCA9IHRoaXMucGFyZW50Tm9kZS5fX2F4aXM7IHJldHVybiB0cmFuc2Zvcm0ocCAmJiBpc0Zpbml0ZShwID0gcChkKSkgPyBwIDogcG9zaXRpb24oZCkpOyB9KTtcbiAgICB9XG5cbiAgICB0aWNrRXhpdC5yZW1vdmUoKTtcblxuICAgIHBhdGhcbiAgICAgICAgLmF0dHIoXCJkXCIsIG9yaWVudCA9PT0gbGVmdCB8fCBvcmllbnQgPT0gcmlnaHRcbiAgICAgICAgICAgID8gKHRpY2tTaXplT3V0ZXIgPyBcIk1cIiArIGsgKiB0aWNrU2l6ZU91dGVyICsgXCIsXCIgKyByYW5nZTAgKyBcIkgwLjVWXCIgKyByYW5nZTEgKyBcIkhcIiArIGsgKiB0aWNrU2l6ZU91dGVyIDogXCJNMC41LFwiICsgcmFuZ2UwICsgXCJWXCIgKyByYW5nZTEpXG4gICAgICAgICAgICA6ICh0aWNrU2l6ZU91dGVyID8gXCJNXCIgKyByYW5nZTAgKyBcIixcIiArIGsgKiB0aWNrU2l6ZU91dGVyICsgXCJWMC41SFwiICsgcmFuZ2UxICsgXCJWXCIgKyBrICogdGlja1NpemVPdXRlciA6IFwiTVwiICsgcmFuZ2UwICsgXCIsMC41SFwiICsgcmFuZ2UxKSk7XG5cbiAgICB0aWNrXG4gICAgICAgIC5hdHRyKFwib3BhY2l0eVwiLCAxKVxuICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiB0cmFuc2Zvcm0ocG9zaXRpb24oZCkpOyB9KTtcblxuICAgIGxpbmVcbiAgICAgICAgLmF0dHIoeCArIFwiMlwiLCBrICogdGlja1NpemVJbm5lcik7XG5cbiAgICB0ZXh0XG4gICAgICAgIC5hdHRyKHgsIGsgKiBzcGFjaW5nKVxuICAgICAgICAudGV4dChmb3JtYXQpO1xuXG4gICAgc2VsZWN0aW9uLmZpbHRlcihlbnRlcmluZylcbiAgICAgICAgLmF0dHIoXCJmaWxsXCIsIFwibm9uZVwiKVxuICAgICAgICAuYXR0cihcImZvbnQtc2l6ZVwiLCAxMClcbiAgICAgICAgLmF0dHIoXCJmb250LWZhbWlseVwiLCBcInNhbnMtc2VyaWZcIilcbiAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBvcmllbnQgPT09IHJpZ2h0ID8gXCJzdGFydFwiIDogb3JpZW50ID09PSBsZWZ0ID8gXCJlbmRcIiA6IFwibWlkZGxlXCIpO1xuXG4gICAgc2VsZWN0aW9uXG4gICAgICAgIC5lYWNoKGZ1bmN0aW9uKCkgeyB0aGlzLl9fYXhpcyA9IHBvc2l0aW9uOyB9KTtcbiAgfVxuXG4gIGF4aXMuc2NhbGUgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoc2NhbGUgPSBfLCBheGlzKSA6IHNjYWxlO1xuICB9O1xuXG4gIGF4aXMudGlja3MgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGlja0FyZ3VtZW50cyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKSwgYXhpcztcbiAgfTtcblxuICBheGlzLnRpY2tBcmd1bWVudHMgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodGlja0FyZ3VtZW50cyA9IF8gPT0gbnVsbCA/IFtdIDogc2xpY2UuY2FsbChfKSwgYXhpcykgOiB0aWNrQXJndW1lbnRzLnNsaWNlKCk7XG4gIH07XG5cbiAgYXhpcy50aWNrVmFsdWVzID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRpY2tWYWx1ZXMgPSBfID09IG51bGwgPyBudWxsIDogc2xpY2UuY2FsbChfKSwgYXhpcykgOiB0aWNrVmFsdWVzICYmIHRpY2tWYWx1ZXMuc2xpY2UoKTtcbiAgfTtcblxuICBheGlzLnRpY2tGb3JtYXQgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodGlja0Zvcm1hdCA9IF8sIGF4aXMpIDogdGlja0Zvcm1hdDtcbiAgfTtcblxuICBheGlzLnRpY2tTaXplID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRpY2tTaXplSW5uZXIgPSB0aWNrU2l6ZU91dGVyID0gK18sIGF4aXMpIDogdGlja1NpemVJbm5lcjtcbiAgfTtcblxuICBheGlzLnRpY2tTaXplSW5uZXIgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodGlja1NpemVJbm5lciA9ICtfLCBheGlzKSA6IHRpY2tTaXplSW5uZXI7XG4gIH07XG5cbiAgYXhpcy50aWNrU2l6ZU91dGVyID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRpY2tTaXplT3V0ZXIgPSArXywgYXhpcykgOiB0aWNrU2l6ZU91dGVyO1xuICB9O1xuXG4gIGF4aXMudGlja1BhZGRpbmcgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodGlja1BhZGRpbmcgPSArXywgYXhpcykgOiB0aWNrUGFkZGluZztcbiAgfTtcblxuICByZXR1cm4gYXhpcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGF4aXNUb3Aoc2NhbGUpIHtcbiAgcmV0dXJuIGF4aXModG9wLCBzY2FsZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBheGlzUmlnaHQoc2NhbGUpIHtcbiAgcmV0dXJuIGF4aXMocmlnaHQsIHNjYWxlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGF4aXNCb3R0b20oc2NhbGUpIHtcbiAgcmV0dXJuIGF4aXMoYm90dG9tLCBzY2FsZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBheGlzTGVmdChzY2FsZSkge1xuICByZXR1cm4gYXhpcyhsZWZ0LCBzY2FsZSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4KSB7XG4gIHJldHVybiB4O1xufVxuIiwiZXhwb3J0IHtcbiAgYXhpc1RvcCxcbiAgYXhpc1JpZ2h0LFxuICBheGlzQm90dG9tLFxuICBheGlzTGVmdFxufSBmcm9tIFwiLi9heGlzXCI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmZ1bmN0aW9uIHNob3J0Q2hlY2tTdW0ocykge1xuICAgIHZhciBjaGsgPSAweDEyMzQ1Njc4O1xuICAgIHZhciBsZW4gPSBzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGNoayArPSAocy5jaGFyQ29kZUF0KGkpICogKGkgKyAxKSk7XG4gICAgfVxuICAgIHJldHVybiAoY2hrICYgMHhmZmZmZmZmZikudG9TdHJpbmcoMTYpO1xufVxuZXhwb3J0cy5zaG9ydENoZWNrU3VtID0gc2hvcnRDaGVja1N1bTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaVEyaGxZMnR6ZFcwdWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGN5STZXeUl1TGk5emNtTXZRMmhsWTJ0emRXMHVkSE1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3UVVGUlF5eFRRVUZuUWl4aFFVRmhMRU5CUVVNc1EwRkJVVHRKUVVOdVF5eEpRVUZKTEVkQlFVY3NSMEZCUnl4VlFVRlZMRU5CUVVNN1NVRkRja0lzU1VGQlNTeEhRVUZITEVkQlFVY3NRMEZCUXl4RFFVRkRMRTFCUVUwc1EwRkJRenRKUVVOdVFpeExRVUZMTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hEUVVGRExFZEJRVWNzUjBGQlJ5eEZRVUZGTEVOQlFVTXNSVUZCUlN4RlFVRkZPMUZCUXpGQ0xFZEJRVWNzU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJReXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRMUVVOMFF6dEpRVU5FTEU5QlFVOHNRMEZCUXl4SFFVRkhMRWRCUVVjc1ZVRkJWU3hEUVVGRExFTkJRVU1zVVVGQlVTeERRVUZETEVWQlFVVXNRMEZCUXl4RFFVRkRPMEZCUXpGRExFTkJRVU03UVVGUVJDeHpRMEZQUXlKOSIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgbW9udGhTdHIgPSBbXG4gICAgWydKYW4nLCAnSmFudWFyeSddLCBbJ0ZlYicsICdGZWJydWFyeSddLCBbJ01hcicsICdNYXJjaCddLCBbJ0FwcicsICdBcHJpbCddLCBbJ01heScsICdNYXknXSwgWydKdW4nLCAnSnVuZSddLFxuICAgIFsnSnVsJywgJ0p1bHknXSwgWydBdWcnLCAnQXVndXN0J10sIFsnU2VwJywgJ1NlcHRlbWJlciddLCBbJ09jdCcsICdPY3RvYmVyJ10sIFsnTm92JywgJ05vdmVtYmVyJ10sIFsnRGVjJywgJ0RlY2VtYmVyJ11cbl07XG5jb25zdCBkYXlTdHIgPSBbXG4gICAgWydTdW4nLCAnU3VuZGF5J10sIFsnTW9uJywgJ01vbmRheSddLCBbJ1R1ZScsICdUdWVzZGF5J10sIFsnV2VkJywgJ1dlZG5lc2RheSddLCBbJ1RodScsICdUaHVyc2RheSddLCBbJ0ZyaScsICdGcmlkYXknXSwgWydTYXQnLCAnU2F0dXJkYXknXVxuXTtcbmZ1bmN0aW9uIGZvcm1hdE51bWJlcihudW1iZXIsIGRpZ2l0cykge1xuICAgIHZhciByID0gJycgKyBudW1iZXI7XG4gICAgd2hpbGUgKHIubGVuZ3RoIDwgZGlnaXRzKSB7XG4gICAgICAgIHIgPSBcIjBcIiArIHI7XG4gICAgfVxuICAgIHJldHVybiByO1xufVxuZnVuY3Rpb24gZGF0ZShmb3JtYXRTdHJpbmcsIGRhdGUgPSBuZXcgRGF0ZSgpKSB7XG4gICAgcmV0dXJuICh0eXBlb2YgZm9ybWF0U3RyaW5nICE9PSAnc3RyaW5nJyB8fCBpc05hTihkYXRlLmdldFRpbWUoKSkpID9cbiAgICAgICAgJ2ludmFsaWQnIDpcbiAgICAgICAgZm9ybWF0U3RyaW5nXG4gICAgICAgICAgICAucmVwbGFjZSgvJVlZWVkvZywgJycgKyBkYXRlLmdldEZ1bGxZZWFyKCkpXG4gICAgICAgICAgICAucmVwbGFjZSgvJVlZL2csICcnICsgKGRhdGUuZ2V0RnVsbFllYXIoKSAlIDEwMCkpXG4gICAgICAgICAgICAucmVwbGFjZSgvJU1NTU0vZywgbW9udGhTdHJbZGF0ZS5nZXRNb250aCgpXVsxXSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC8lTU1NL2csIG1vbnRoU3RyW2RhdGUuZ2V0TW9udGgoKV1bMF0pXG4gICAgICAgICAgICAucmVwbGFjZSgvJU1NL2csIGZvcm1hdE51bWJlcihkYXRlLmdldE1vbnRoKCkgKyAxLCAyKSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC8lTS9nLCAnJyArIChkYXRlLmdldE1vbnRoKCkgKyAxKSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC8lRERERC9nLCBkYXlTdHJbZGF0ZS5nZXREYXkoKV1bMV0pXG4gICAgICAgICAgICAucmVwbGFjZSgvJURERC9nLCBkYXlTdHJbZGF0ZS5nZXREYXkoKV1bMF0pXG4gICAgICAgICAgICAucmVwbGFjZSgvJUREL2csIGZvcm1hdE51bWJlcihkYXRlLmdldERhdGUoKSwgMikpXG4gICAgICAgICAgICAucmVwbGFjZSgvJUQvZywgJycgKyBkYXRlLmdldERhdGUoKSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC8laGgvZywgZm9ybWF0TnVtYmVyKGRhdGUuZ2V0SG91cnMoKSwgMikpXG4gICAgICAgICAgICAucmVwbGFjZSgvJWgvZywgJycgKyBkYXRlLmdldEhvdXJzKCkpXG4gICAgICAgICAgICAucmVwbGFjZSgvJW1tL2csIGZvcm1hdE51bWJlcihkYXRlLmdldE1pbnV0ZXMoKSwgMikpXG4gICAgICAgICAgICAucmVwbGFjZSgvJW0vZywgJycgKyBkYXRlLmdldE1pbnV0ZXMoKSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC8lc3MvZywgZm9ybWF0TnVtYmVyKGRhdGUuZ2V0U2Vjb25kcygpLCAyKSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC8lampqL2csIGZvcm1hdE51bWJlcihkYXRlLmdldE1pbGxpc2Vjb25kcygpLCAzKSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC8lamovZywgZm9ybWF0TnVtYmVyKGRhdGUuZ2V0TWlsbGlzZWNvbmRzKCkgLyAxMCwgMikpXG4gICAgICAgICAgICAucmVwbGFjZSgvJWovZywgZm9ybWF0TnVtYmVyKGRhdGUuZ2V0TWlsbGlzZWNvbmRzKCkgLyAxMDAsIDEpKTtcbn1cbmV4cG9ydHMuZGF0ZSA9IGRhdGU7XG5leHBvcnRzLm1zID0ge1xuICAgIGZyb21NaW51dGVzOiAobWluKSA9PiAxMDAwICogNjAgKiBtaW4sXG4gICAgZnJvbUhvdXJzOiAoaCkgPT4gMTAwMCAqIDYwICogNjAgKiBoLFxuICAgIGZyb21EYXlzOiAoZCkgPT4gMTAwMCAqIDYwICogNjAgKiAyNCAqIGQsXG4gICAgZnJvbVdlZWtzOiAodykgPT4gMTAwMCAqIDYwICogNjAgKiAyNCAqIDcgKiB3LFxuICAgIHRvTWludXRlczogKG1zKSA9PiBtcyAvICgxMDAwICogNjApLFxuICAgIHRvSG91cnM6IChtcykgPT4gbXMgLyAoMTAwMCAqIDYwICogNjApLFxuICAgIHRvRGF5czogKG1zKSA9PiBtcyAvICgxMDAwICogNjAgKiA2MCAqIDI0KSxcbiAgICB0b1dlZWtzOiAobXMpID0+IG1zIC8gKDEwMDAgKiA2MCAqIDYwICogMjQgKiA3KVxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaVJHRjBaUzVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpNHVMM055WXk5RVlYUmxMblJ6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3TzBGQlpVRXNUVUZCVFN4UlFVRlJMRWRCUVVjN1NVRkRZaXhEUVVGRExFdEJRVXNzUlVGQlJTeFRRVUZUTEVOQlFVTXNSVUZCUlN4RFFVRkRMRXRCUVVzc1JVRkJSU3hWUVVGVkxFTkJRVU1zUlVGQlJTeERRVUZETEV0QlFVc3NSVUZCUlN4UFFVRlBMRU5CUVVNc1JVRkJSU3hEUVVGRExFdEJRVXNzUlVGQlJTeFBRVUZQTEVOQlFVTXNSVUZCUlN4RFFVRkRMRXRCUVVzc1JVRkJSU3hMUVVGTExFTkJRVU1zUlVGQlJTeERRVUZETEV0QlFVc3NSVUZCUlN4TlFVRk5MRU5CUVVNN1NVRkROVWNzUTBGQlF5eExRVUZMTEVWQlFVVXNUVUZCVFN4RFFVRkRMRVZCUVVVc1EwRkJReXhMUVVGTExFVkJRVVVzVVVGQlVTeERRVUZETEVWQlFVVXNRMEZCUXl4TFFVRkxMRVZCUVVVc1YwRkJWeXhEUVVGRExFVkJRVVVzUTBGQlF5eExRVUZMTEVWQlFVVXNVMEZCVXl4RFFVRkRMRVZCUVVVc1EwRkJReXhMUVVGTExFVkJRVVVzVlVGQlZTeERRVUZETEVWQlFVVXNRMEZCUXl4TFFVRkxMRVZCUVVVc1ZVRkJWU3hEUVVGRE8wTkJRVU1zUTBGQlF6dEJRVWMxU0N4TlFVRk5MRTFCUVUwc1IwRkJSenRKUVVOWUxFTkJRVU1zUzBGQlN5eEZRVUZGTEZGQlFWRXNRMEZCUXl4RlFVRkRMRU5CUVVNc1MwRkJTeXhGUVVGRkxGRkJRVkVzUTBGQlF5eEZRVUZETEVOQlFVTXNTMEZCU3l4RlFVRkZMRk5CUVZNc1EwRkJReXhGUVVGRExFTkJRVU1zUzBGQlN5eEZRVUZGTEZkQlFWY3NRMEZCUXl4RlFVRkRMRU5CUVVNc1MwRkJTeXhGUVVGRkxGVkJRVlVzUTBGQlF5eEZRVUZETEVOQlFVTXNTMEZCU3l4RlFVRkZMRkZCUVZFc1EwRkJReXhGUVVGRExFTkJRVU1zUzBGQlN5eEZRVUZGTEZWQlFWVXNRMEZCUXp0RFFVRkRMRU5CUVVNN1FVRkhNMGtzVTBGQlV5eFpRVUZaTEVOQlFVTXNUVUZCWVN4RlFVRkZMRTFCUVdFN1NVRkRPVU1zU1VGQlNTeERRVUZETEVkQlFVY3NSVUZCUlN4SFFVRkRMRTFCUVUwc1EwRkJRenRKUVVOc1FpeFBRVUZQTEVOQlFVTXNRMEZCUXl4TlFVRk5MRWRCUVVjc1RVRkJUU3hGUVVGRk8xRkJRVVVzUTBGQlF5eEhRVUZITEVkQlFVY3NSMEZCUnl4RFFVRkRMRU5CUVVNN1MwRkJSVHRKUVVNeFF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0QlFVTmlMRU5CUVVNN1FVRmpSQ3hUUVVGblFpeEpRVUZKTEVOQlFVTXNXVUZCYlVJc1JVRkJSU3hKUVVGSkxFZEJRVU1zU1VGQlNTeEpRVUZKTEVWQlFVVTdTVUZEY2tRc1QwRkJUeXhEUVVGRExFOUJRVThzV1VGQldTeExRVUZMTEZGQlFWRXNTVUZCU1N4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRExFOUJRVThzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMUZCUTJoRkxGTkJRVk1zUTBGQlFTeERRVUZETzFGQlExWXNXVUZCV1R0aFFVTlFMRTlCUVU4c1EwRkJReXhSUVVGUkxFVkJRVVVzUlVGQlJTeEhRVUZETEVsQlFVa3NRMEZCUXl4WFFVRlhMRVZCUVVVc1EwRkJRenRoUVVONFF5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RlFVRkpMRVZCUVVVc1IwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eFhRVUZYTEVWQlFVVXNSMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJRenRoUVVNNVF5eFBRVUZQTEVOQlFVTXNVVUZCVVN4RlFVRkhMRkZCUVZFc1EwRkJReXhKUVVGSkxFTkJRVU1zVVVGQlVTeEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRoUVVOb1JDeFBRVUZQTEVOQlFVTXNUMEZCVHl4RlFVRkpMRkZCUVZFc1EwRkJReXhKUVVGSkxFTkJRVU1zVVVGQlVTeEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRoUVVOb1JDeFBRVUZQTEVOQlFVTXNUVUZCVFN4RlFVRkpMRmxCUVZrc1EwRkJReXhKUVVGSkxFTkJRVU1zVVVGQlVTeEZRVUZGTEVkQlFVTXNRMEZCUXl4RlFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8yRkJRM0JFTEU5QlFVOHNRMEZCUXl4TFFVRkxMRVZCUVVrc1JVRkJSU3hIUVVGRExFTkJRVU1zU1VGQlNTeERRVUZETEZGQlFWRXNSVUZCUlN4SFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8yRkJRM2hETEU5QlFVOHNRMEZCUXl4UlFVRlJMRVZCUVVjc1RVRkJUU3hEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8yRkJRelZETEU5QlFVOHNRMEZCUXl4UFFVRlBMRVZCUVVrc1RVRkJUU3hEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8yRkJRelZETEU5QlFVOHNRMEZCUXl4TlFVRk5MRVZCUVVrc1dVRkJXU3hEUVVGRExFbEJRVWtzUTBGQlF5eFBRVUZQTEVWQlFVVXNSVUZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRoUVVOcVJDeFBRVUZQTEVOQlFVTXNTMEZCU3l4RlFVRkpMRVZCUVVVc1IwRkJReXhKUVVGSkxFTkJRVU1zVDBGQlR5eEZRVUZGTEVOQlFVTTdZVUZEYmtNc1QwRkJUeXhEUVVGRExFMUJRVTBzUlVGQlNTeFpRVUZaTEVOQlFVTXNTVUZCU1N4RFFVRkRMRkZCUVZFc1JVRkJSU3hGUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzJGQlEyeEVMRTlCUVU4c1EwRkJReXhMUVVGTExFVkJRVWNzUlVGQlJTeEhRVUZETEVsQlFVa3NRMEZCUXl4UlFVRlJMRVZCUVVVc1EwRkJRenRoUVVOdVF5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RlFVRkpMRmxCUVZrc1EwRkJReXhKUVVGSkxFTkJRVU1zVlVGQlZTeEZRVUZGTEVWQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1lVRkRjRVFzVDBGQlR5eERRVUZETEV0QlFVc3NSVUZCU1N4RlFVRkZMRWRCUVVNc1NVRkJTU3hEUVVGRExGVkJRVlVzUlVGQlJTeERRVUZETzJGQlEzUkRMRTlCUVU4c1EwRkJReXhOUVVGTkxFVkJRVWtzV1VGQldTeERRVUZETEVsQlFVa3NRMEZCUXl4VlFVRlZMRVZCUVVVc1JVRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dGhRVU53UkN4UFFVRlBMRU5CUVVNc1QwRkJUeXhGUVVGSkxGbEJRVmtzUTBGQlF5eEpRVUZKTEVOQlFVTXNaVUZCWlN4RlFVRkZMRVZCUVVNc1EwRkJReXhEUVVGRExFTkJRVU03WVVGRE1VUXNUMEZCVHl4RFFVRkRMRTFCUVUwc1JVRkJTU3haUVVGWkxFTkJRVU1zU1VGQlNTeERRVUZETEdWQlFXVXNSVUZCUlN4SFFVRkRMRVZCUVVVc1JVRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dGhRVU0xUkN4UFFVRlBMRU5CUVVNc1MwRkJTeXhGUVVGSExGbEJRVmtzUTBGQlF5eEpRVUZKTEVOQlFVTXNaVUZCWlN4RlFVRkZMRWRCUVVNc1IwRkJSeXhGUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEZWtVc1EwRkJRenRCUVhSQ1JDeHZRa0Z6UWtNN1FVRkhXU3hSUVVGQkxFVkJRVVVzUjBGQlJ6dEpRVU5rTEZkQlFWY3NSVUZCU3l4RFFVRkRMRWRCUVZVc1JVRkJSU3hGUVVGRkxFTkJRVU1zU1VGQlNTeEhRVUZETEVWQlFVVXNSMEZCUXl4SFFVRkhPMGxCUXpORExGTkJRVk1zUlVGQlR5eERRVUZETEVOQlFWRXNSVUZCU1N4RlFVRkZMRU5CUVVNc1NVRkJTU3hIUVVGRExFVkJRVVVzUjBGQlF5eEZRVUZGTEVkQlFVTXNRMEZCUXp0SlFVTTFReXhSUVVGUkxFVkJRVkVzUTBGQlF5eERRVUZSTEVWQlFVa3NSVUZCUlN4RFFVRkRMRWxCUVVrc1IwRkJReXhGUVVGRkxFZEJRVU1zUlVGQlJTeEhRVUZETEVWQlFVVXNSMEZCUXl4RFFVRkRPMGxCUXk5RExGTkJRVk1zUlVGQlR5eERRVUZETEVOQlFWRXNSVUZCU1N4RlFVRkZMRU5CUVVNc1NVRkJTU3hIUVVGRExFVkJRVVVzUjBGQlF5eEZRVUZGTEVkQlFVTXNSVUZCUlN4SFFVRkRMRU5CUVVNc1IwRkJReXhEUVVGRE8wbEJRMnBFTEZOQlFWTXNSVUZCVHl4RFFVRkRMRVZCUVZNc1JVRkJSeXhGUVVGRkxFTkJRVU1zUlVGQlJTeEhRVUZETEVOQlFVTXNTVUZCU1N4SFFVRkRMRVZCUVVVc1EwRkJRenRKUVVNMVF5eFBRVUZQTEVWQlFWTXNRMEZCUXl4RlFVRlRMRVZCUVVjc1JVRkJSU3hEUVVGRExFVkJRVVVzUjBGQlF5eERRVUZETEVsQlFVa3NSMEZCUXl4RlFVRkZMRWRCUVVNc1JVRkJSU3hEUVVGRE8wbEJReTlETEUxQlFVMHNSVUZCVlN4RFFVRkRMRVZCUVZNc1JVRkJSeXhGUVVGRkxFTkJRVU1zUlVGQlJTeEhRVUZETEVOQlFVTXNTVUZCU1N4SFFVRkRMRVZCUVVVc1IwRkJReXhGUVVGRkxFZEJRVU1zUlVGQlJTeERRVUZETzBsQlEyeEVMRTlCUVU4c1JVRkJVeXhEUVVGRExFVkJRVk1zUlVGQlJ5eEZRVUZGTEVOQlFVTXNSVUZCUlN4SFFVRkRMRU5CUVVNc1NVRkJTU3hIUVVGRExFVkJRVVVzUjBGQlF5eEZRVUZGTEVkQlFVTXNSVUZCUlN4SFFVRkRMRU5CUVVNc1EwRkJRenREUVVOMlJDeERRVUZESW4wPSIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZnVuY3Rpb24gcm91bmQobiwgZCA9IDApIHtcbiAgICBjb25zdCBmID0gTWF0aC5wb3coMTAsIGQpO1xuICAgIGNvbnN0IHIgPSBNYXRoLnJvdW5kKG4gKiBmKSAvIGY7XG4gICAgcmV0dXJuICcnICsgcjtcbn1cbmV4cG9ydHMucm91bmQgPSByb3VuZDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaVRuVnRZbVZ5TG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhNaU9sc2lMaTR2YzNKakwwNTFiV0psY2k1MGN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96dEJRVmRETEZOQlFXZENMRXRCUVVzc1EwRkJReXhEUVVGUkxFVkJRVVVzUTBGQlF5eEhRVUZETEVOQlFVTTdTVUZQYUVNc1RVRkJUU3hEUVVGRExFZEJRVWNzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4RlFVRkZMRVZCUVVNc1EwRkJReXhEUVVGRExFTkJRVU03U1VGRGVrSXNUVUZCVFN4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVkQlFVTXNRMEZCUXl4RFFVRkRMRWRCUVVNc1EwRkJReXhEUVVGRE8wbEJRelZDTEU5QlFVOHNSVUZCUlN4SFFVRkRMRU5CUVVNc1EwRkJRenRCUVVObUxFTkJRVU03UVVGV1JDeHpRa0ZWUXlKOSIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiB0aW1lb3V0KG1zKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHsgc2V0VGltZW91dChyZWplY3QsIG1zKTsgfSk7XG59XG5leHBvcnRzLnRpbWVvdXQgPSB0aW1lb3V0O1xuZnVuY3Rpb24gZGVsYXkobXMpIHtcbiAgICByZXR1cm4gKGFyZ3MpID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgcmVzb2x2ZShhcmdzKTsgfSwgbXMpO1xuICAgICAgICB9KTtcbiAgICB9O1xufVxuZXhwb3J0cy5kZWxheSA9IGRlbGF5O1xuY2xhc3MgUGFjZSB7XG4gICAgY29uc3RydWN0b3IocGFjZSA9IDEwMCwgbWF4Q29uY3VycmVudCA9IC0xKSB7XG4gICAgICAgIHRoaXMubWF4Q29uY3VycmVudCA9IC0xO1xuICAgICAgICB0aGlzLndhaXRVbnRpbCA9IDA7XG4gICAgICAgIHRoaXMud2FpdENvdW50ID0gMDtcbiAgICAgICAgdGhpcy5iZWluZ0NhbGxlZCA9IDA7XG4gICAgICAgIHRoaXMucGFjZSA9IHBhY2UgKyA1O1xuICAgICAgICB0aGlzLm1heENvbmN1cnJlbnQgPSBtYXhDb25jdXJyZW50O1xuICAgIH1cbiAgICBnZXRXYWl0Q291bnQoKSB7IHJldHVybiB0aGlzLndhaXRDb3VudDsgfVxuICAgIGdldENhbGxpbmdDb3VudCgpIHsgcmV0dXJuIHRoaXMuYmVpbmdDYWxsZWQ7IH1cbiAgICBhZGQoZm4pIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGFkZFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgaWYgKHRoaXMud2FpdFVudGlsIDwgYWRkVGltZSkge1xuICAgICAgICAgICAgICAgIHRoaXMud2FpdFVudGlsID0gYWRkVGltZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGRpZmYgPSB0aGlzLndhaXRVbnRpbCAtIGFkZFRpbWU7XG4gICAgICAgICAgICB0aGlzLndhaXRVbnRpbCArPSB0aGlzLnBhY2UgKyA1O1xuICAgICAgICAgICAgdGhpcy53YWl0Q291bnQrKztcbiAgICAgICAgICAgIHlpZWxkIGRlbGF5KGRpZmYpKCk7XG4gICAgICAgICAgICB5aWVsZCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB3YWl0TG9vcCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubWF4Q29uY3VycmVudCA8IDAgfHwgdGhpcy5iZWluZ0NhbGxlZCA8IHRoaXMubWF4Q29uY3VycmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCh3YWl0TG9vcCwgMTApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB3YWl0TG9vcCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLndhaXRDb3VudC0tO1xuICAgICAgICAgICAgdGhpcy5iZWluZ0NhbGxlZCsrO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0geWllbGQgZm4oRGF0ZS5ub3coKSAtIGFkZFRpbWUpO1xuICAgICAgICAgICAgdGhpcy5iZWluZ0NhbGxlZC0tO1xuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5QYWNlID0gUGFjZTtcbmZ1bmN0aW9uIHByb21pc2VDaGFpbih0YXNrcywgaW5pdGlhbFJlc3VsdCA9IFtdKSB7XG4gICAgcmV0dXJuIHRhc2tzLnJlZHVjZSgoY2hhaW4sIHRhc2spID0+IGNoYWluLnRoZW4oKF9yZXN1bHRzKSA9PiBQcm9taXNlLnJlc29sdmUodGFzayhfcmVzdWx0cykpLnRoZW4oKHIpID0+IHtcbiAgICAgICAgX3Jlc3VsdHMucHVzaChyKTtcbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgIH0pKSwgUHJvbWlzZS5yZXNvbHZlKGluaXRpYWxSZXN1bHQpKTtcbn1cbmV4cG9ydHMucHJvbWlzZUNoYWluID0gcHJvbWlzZUNoYWluO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pVkdsdFpXUlFjbTl0YVhObGN5NXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk0dUwzTnlZeTlVYVcxbFpGQnliMjFwYzJWekxuUnpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3T3pzN096czdRVUZYUVN4VFFVRm5RaXhQUVVGUExFTkJRVU1zUlVGQlV6dEpRVU0zUWl4UFFVRlBMRWxCUVVrc1QwRkJUeXhEUVVGRExFTkJRVU1zVDBGQlR5eEZRVUZGTEUxQlFVMHNSVUZCUlN4RlFVRkZMRWRCUVVjc1ZVRkJWU3hEUVVGRExFMUJRVTBzUlVGQlJTeEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRM3BGTEVOQlFVTTdRVUZHUkN3d1FrRkZRenRCUVhWQ1JDeFRRVUZuUWl4TFFVRkxMRU5CUVVNc1JVRkJVenRKUVVNelFpeFBRVUZQTEVOQlFVa3NTVUZCVHl4RlFVRmhMRVZCUVVVN1VVRkROMElzVDBGQlR5eEpRVUZKTEU5QlFVOHNRMEZCUXl4RFFVRkRMRTlCUVhOQ0xFVkJRVVVzUlVGQlJUdFpRVU14UXl4VlFVRlZMRU5CUVVNc1IwRkJSeXhGUVVGRkxFZEJRVWNzVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGRkxFVkJRVVVzUTBGQlF5eERRVUZETzFGQlF6ZERMRU5CUVVNc1EwRkJReXhEUVVGRE8wbEJRMUFzUTBGQlF5eERRVUZETzBGQlEwNHNRMEZCUXp0QlFVNUVMSE5DUVUxRE8wRkJZVVFzVFVGQllTeEpRVUZKTzBsQldXSXNXVUZCV1N4SlFVRkpMRWRCUVVNc1IwRkJSeXhGUVVGRkxHRkJRV0VzUjBGQlF5eERRVUZETEVOQlFVTTdVVUZZT1VJc2EwSkJRV0VzUjBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXp0UlFVVnlRaXhqUVVGVExFZEJRVk1zUTBGQlF5eERRVUZETzFGQlEzQkNMR05CUVZNc1IwRkJVeXhEUVVGRExFTkJRVU03VVVGRGNFSXNaMEpCUVZjc1IwRkJUeXhEUVVGRExFTkJRVU03VVVGUmVFSXNTVUZCU1N4RFFVRkRMRWxCUVVrc1IwRkJSeXhKUVVGSkxFZEJRVU1zUTBGQlF5eERRVUZETzFGQlEyNUNMRWxCUVVrc1EwRkJReXhoUVVGaExFZEJRVWNzWVVGQllTeERRVUZETzBsQlEzWkRMRU5CUVVNN1NVRkZSQ3haUVVGWkxFdEJRVkVzVDBGQlR5eEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNc1EwRkJRenRKUVVNMVF5eGxRVUZsTEV0QlFVc3NUMEZCVHl4SlFVRkpMRU5CUVVNc1YwRkJWeXhEUVVGRExFTkJRVU1zUTBGQlF6dEpRVkY0UXl4SFFVRkhMRU5CUVVNc1JVRkJhVU03TzFsQlEzWkRMRTFCUVUwc1QwRkJUeXhIUVVGSExFbEJRVWtzUTBGQlF5eEhRVUZITEVWQlFVVXNRMEZCUXp0WlFVTXpRaXhKUVVGSkxFbEJRVWtzUTBGQlF5eFRRVUZUTEVkQlFVY3NUMEZCVHl4RlFVRkZPMmRDUVVGRkxFbEJRVWtzUTBGQlF5eFRRVUZUTEVkQlFVY3NUMEZCVHl4RFFVRkRPMkZCUVVVN1dVRkRNMFFzVFVGQlRTeEpRVUZKTEVkQlFVY3NTVUZCU1N4RFFVRkRMRk5CUVZNc1IwRkJSeXhQUVVGUExFTkJRVU03V1VGRGRFTXNTVUZCU1N4RFFVRkRMRk5CUVZNc1NVRkJTU3hKUVVGSkxFTkJRVU1zU1VGQlNTeEhRVUZITEVOQlFVTXNRMEZCUXp0WlFVTm9ReXhKUVVGSkxFTkJRVU1zVTBGQlV5eEZRVUZGTEVOQlFVTTdXVUZEYWtJc1RVRkJUU3hMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEVWQlFVVXNRMEZCUXp0WlFVTndRaXhOUVVGTkxFbEJRVWtzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4RlFVRkZPMmRDUVVONFFpeE5RVUZOTEZGQlFWRXNSMEZCUnl4SFFVRkhMRVZCUVVVN2IwSkJRMnhDTEVsQlFVa3NTVUZCU1N4RFFVRkRMR0ZCUVdFc1IwRkJSeXhEUVVGRExFbEJRVWtzU1VGQlNTeERRVUZETEZkQlFWY3NSMEZCUnl4SlFVRkpMRU5CUVVNc1lVRkJZU3hGUVVGRk8zZENRVU5xUlN4UFFVRlBMRVZCUVVVc1EwRkJRenR4UWtGRFlqdDVRa0ZCVFR0M1FrRkRTQ3hWUVVGVkxFTkJRVU1zVVVGQlVTeEZRVUZGTEVWQlFVVXNRMEZCUXl4RFFVRkRPM0ZDUVVNMVFqdG5Ra0ZEVEN4RFFVRkRMRU5CUVVNN1owSkJRMFlzVVVGQlVTeEZRVUZGTEVOQlFVTTdXVUZEWml4RFFVRkRMRU5CUVVNc1EwRkJRenRaUVVOSUxFbEJRVWtzUTBGQlF5eFRRVUZUTEVWQlFVVXNRMEZCUXp0WlFVTnFRaXhKUVVGSkxFTkJRVU1zVjBGQlZ5eEZRVUZGTEVOQlFVTTdXVUZEYmtJc1RVRkJUU3hIUVVGSExFZEJRVWNzVFVGQlRTeEZRVUZGTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWRCUVVjc1JVRkJSU3hIUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzFsQlEzcERMRWxCUVVrc1EwRkJReXhYUVVGWExFVkJRVVVzUTBGQlF6dFpRVU51UWl4UFFVRlBMRWRCUVVjc1EwRkJRenRSUVVObUxFTkJRVU03UzBGQlFUdERRVU5LTzBGQmFrUkVMRzlDUVdsRVF6dEJRVmRFTEZOQlFXZENMRmxCUVZrc1EwRkJTU3hMUVVGeFF5eEZRVUZGTEdkQ1FVRnJRaXhGUVVGRk8wbEJRM1pHTEU5QlFVOHNTMEZCU3l4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRExFdEJRV3RDTEVWQlFVVXNTVUZCSzBJc1JVRkJaMElzUlVGQlJTeERRVVYwUml4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zVVVGQldTeEZRVUZGTEVWQlFVVXNRMEZCUXl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVWNzUlVGQlJTeEZRVUZGTzFGQlJYUkZMRkZCUVZFc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdVVUZEYWtJc1QwRkJUeXhSUVVGUkxFTkJRVU03U1VGRGNFSXNRMEZCUXl4RFFVRkRMRU5CUVVNc1JVRkRTQ3hQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEdGQlFXRXNRMEZCUXl4RFFVTnFReXhEUVVGRE8wRkJRMDRzUTBGQlF6dEJRVlpFTEc5RFFWVkRJbjA9IiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgVGltZWRQcm9taXNlc18xID0gcmVxdWlyZShcIi4vVGltZWRQcm9taXNlc1wiKTtcbmV4cG9ydHMudGltZW91dCA9IFRpbWVkUHJvbWlzZXNfMS50aW1lb3V0O1xuZXhwb3J0cy5kZWxheSA9IFRpbWVkUHJvbWlzZXNfMS5kZWxheTtcbnZhciBUaW1lZFByb21pc2VzXzIgPSByZXF1aXJlKFwiLi9UaW1lZFByb21pc2VzXCIpO1xuZXhwb3J0cy5QYWNlID0gVGltZWRQcm9taXNlc18yLlBhY2U7XG52YXIgVGltZWRQcm9taXNlc18zID0gcmVxdWlyZShcIi4vVGltZWRQcm9taXNlc1wiKTtcbmV4cG9ydHMucHJvbWlzZUNoYWluID0gVGltZWRQcm9taXNlc18zLnByb21pc2VDaGFpbjtcbnZhciBDaGVja3N1bV8xID0gcmVxdWlyZShcIi4vQ2hlY2tzdW1cIik7XG5leHBvcnRzLnNob3J0Q2hlY2tTdW0gPSBDaGVja3N1bV8xLnNob3J0Q2hlY2tTdW07XG52YXIgRGF0ZV8xID0gcmVxdWlyZShcIi4vRGF0ZVwiKTtcbmV4cG9ydHMuZGF0ZSA9IERhdGVfMS5kYXRlO1xuZXhwb3J0cy5tcyA9IERhdGVfMS5tcztcbnZhciBOdW1iZXJfMSA9IHJlcXVpcmUoXCIuL051bWJlclwiKTtcbmV4cG9ydHMucm91bmQgPSBOdW1iZXJfMS5yb3VuZDtcbnZhciBsb2dfMSA9IHJlcXVpcmUoXCIuL2xvZ1wiKTtcbmV4cG9ydHMubG9nID0gbG9nXzEubG9nO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pYVc1a1pYZ3Vhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdUxpOXpjbU12YVc1a1pYZ3VkSE1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3UVVGQlFTeHBSRUZCZFVRN1FVRkJPVU1zYTBOQlFVRXNUMEZCVHl4RFFVRkJPMEZCUVVVc1owTkJRVUVzUzBGQlN5eERRVUZCTzBGQlEzWkNMR2xFUVVGMVJEdEJRVUU1UXl3clFrRkJRU3hKUVVGSkxFTkJRVUU3UVVGRFlpeHBSRUZCZFVRN1FVRkJPVU1zZFVOQlFVRXNXVUZCV1N4RFFVRkJPMEZCUTNKQ0xIVkRRVUZyUkR0QlFVRjZReXh0UTBGQlFTeGhRVUZoTEVOQlFVRTdRVUZEZEVJc0swSkJRVGhETzBGQlFYSkRMSE5DUVVGQkxFbEJRVWtzUTBGQlFUdEJRVUZGTEc5Q1FVRkJMRVZCUVVVc1EwRkJRVHRCUVVOcVFpeHRRMEZCWjBRN1FVRkJka01zZVVKQlFVRXNTMEZCU3l4RFFVRkJPMEZCUTJRc05rSkJRVFpETzBGQlFYQkRMRzlDUVVGQkxFZEJRVWNzUTBGQlFTSjkiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgRGF0ZV8xID0gcmVxdWlyZShcIi4vRGF0ZVwiKTtcbmNvbnN0IERFQlVHID0gU3ltYm9sKCdERUJVRycpO1xuY29uc3QgSU5GTyA9IFN5bWJvbCgnSU5GTycpO1xuY29uc3QgV0FSTiA9IFN5bWJvbCgnV0FSTicpO1xuY29uc3QgRVJST1IgPSBTeW1ib2woJ0VSUk9SJyk7XG5sZXQgZ0xvZ0ZpbGU7XG5jb25zdCBnTGV2ZWxzID0ge1xuICAgIFtERUJVR106IHsgaW1wb3J0YW5jZTogMCwgc3ltOiBERUJVRywgZGVzYzogJ0RFQlVHJyB9LFxuICAgIFtJTkZPXTogeyBpbXBvcnRhbmNlOiAxLCBzeW06IElORk8sIGRlc2M6ICdJTkZPJyB9LFxuICAgIFtXQVJOXTogeyBpbXBvcnRhbmNlOiAyLCBzeW06IFdBUk4sIGRlc2M6ICdXQVJOJyB9LFxuICAgIFtFUlJPUl06IHsgaW1wb3J0YW5jZTogMywgc3ltOiBFUlJPUiwgZGVzYzogJ0VSUk9SJyB9XG59O1xubGV0IGdHbG9iYWxMZXZlbCA9IGdMZXZlbHNbSU5GT107XG5jb25zdCBkZWZEYXRlRm9ybWF0ID0gJyVZWVlZJU1NJUREICVoaDolbW06JXNzLiVqamonO1xubGV0IGdEYXRlRm9ybWF0ID0gZGVmRGF0ZUZvcm1hdDtcbmxldCBnQ29sb3JzID0gZmFsc2U7XG5jb25zdCBjb2xvciA9IHtcbiAgICByZWQ6ICdcXHgxYlszMW0nLFxuICAgIHllbGxvdzogJ1xceDFiWzMzbScsXG4gICAgYmx1ZTogJ1xceDFiWzM2bScsXG4gICAgZ3JlZW46ICdcXHgxYlszMm0nLFxuICAgIGJvbGQ6ICdcXHgxYlsxbScsXG4gICAgY2xlYXI6ICdcXHgxYlswbSdcbn07XG5leHBvcnRzLmxvZyA9IGNyZWF0ZSgnJywgKGZpbGVuYW1lLCBtc2cpID0+IFByb21pc2UucmVzb2x2ZSh1bmRlZmluZWQpLCAocGF0aCkgPT4gUHJvbWlzZS5yZXNvbHZlKHBhdGguaW5kZXhPZignLycpID49IDAgPyBmYWxzZSA6IHRydWUpKTtcbmZ1bmN0aW9uIGNyZWF0ZShfcHJlZml4LCBsb2dUb0ZpbGUsIHBhdGhFeGlzdHMpIHtcbiAgICBjb25zdCBjb250ZXh0ID0ge1xuICAgICAgICBsZXZlbDogdW5kZWZpbmVkLFxuICAgICAgICBwcmVmaXg6IF9wcmVmaXgsXG4gICAgICAgIGxvZ1RvRmlsZTogbG9nVG9GaWxlLFxuICAgICAgICBwYXRoRXhpc3RzOiBwYXRoRXhpc3RzXG4gICAgfTtcbiAgICBmdW5jdGlvbiBsZXZlbChuZXdMZXZlbFN5bSwgc2V0R2xvYmFsTGV2ZWwgPSBmYWxzZSkge1xuICAgICAgICBsZXQgbmV3TGV2ZWwgPSBnTGV2ZWxzW25ld0xldmVsU3ltXSB8fCBnR2xvYmFsTGV2ZWw7XG4gICAgICAgIGxldCBvbGRMZXZlbCA9IGNvbnRleHQubGV2ZWwgfHwgZ0dsb2JhbExldmVsO1xuICAgICAgICBpZiAobmV3TGV2ZWxTeW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbmV3TGV2ZWwgPSBvbGRMZXZlbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChuZXdMZXZlbFN5bSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgY29udGV4dC5sZXZlbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChnTGV2ZWxzW25ld0xldmVsU3ltXSkge1xuICAgICAgICAgICAgaWYgKHNldEdsb2JhbExldmVsKSB7XG4gICAgICAgICAgICAgICAgZ0dsb2JhbExldmVsID0gbmV3TGV2ZWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxldmVsID0gbmV3TGV2ZWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBtc2cgPSBgbmV3ICR7c2V0R2xvYmFsTGV2ZWwgPyAnZ2xvYmFsJyA6IGNvbnRleHQucHJlZml4fSBsb2cgbGV2ZWwgJHtuZXdMZXZlbC5kZXNjLnRvVXBwZXJDYXNlKCl9ICh3YXMgJHtvbGRMZXZlbC5kZXNjLnRvVXBwZXJDYXNlKCl9KWA7XG4gICAgICAgICAgICBvdXQoKG5ld0xldmVsLnN5bSA9PT0gb2xkTGV2ZWwuc3ltKSA/IERFQlVHIDogSU5GTywgbXNnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG91dChFUlJPUiwgYHVua293biBsZXZlbCAke25ld0xldmVsU3ltLnRvU3RyaW5nKCl9OyBsb2cgbGV2ZWwgcmVtYWlucyAke29sZExldmVsLnN5bS50b1N0cmluZygpfWApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdMZXZlbC5zeW07XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRlYnVnKG1zZywgbG9nMkZpbGUgPSB0cnVlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7IHJldHVybiB5aWVsZCBvdXQoREVCVUcsIG1zZywgbG9nMkZpbGUpOyB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaW5mbyhtc2csIGxvZzJGaWxlID0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkgeyByZXR1cm4geWllbGQgb3V0KElORk8sIG1zZywgbG9nMkZpbGUpOyB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gd2Fybihtc2csIGxvZzJGaWxlID0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkgeyByZXR1cm4geWllbGQgb3V0KFdBUk4sIG1zZywgbG9nMkZpbGUpOyB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZXJyb3IobXNnLCBsb2cyRmlsZSA9IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHsgcmV0dXJuIHlpZWxkIG91dChFUlJPUiwgbXNnLCBsb2cyRmlsZSk7IH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBmb3JtYXQoZm10U3RyKSB7XG4gICAgICAgIGlmIChmbXRTdHIgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGdEYXRlRm9ybWF0ID0gZGVmRGF0ZUZvcm1hdDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChmbXRTdHIpIHtcbiAgICAgICAgICAgIGdEYXRlRm9ybWF0ID0gZm10U3RyO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnRGF0ZUZvcm1hdDtcbiAgICB9XG4gICAgZnVuY3Rpb24gcHJlZml4KHByZikge1xuICAgICAgICBpZiAocHJmKSB7XG4gICAgICAgICAgICBjb250ZXh0LnByZWZpeCA9IHByZjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29udGV4dC5wcmVmaXg7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG91dChsdmwsIG1zZywgbG9nMkZpbGUgPSB0cnVlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBjb2xvcnMgPSB7IFtFUlJPUl06IGNvbG9yLnJlZCArIGNvbG9yLmJvbGQsIFtXQVJOXTogY29sb3IueWVsbG93ICsgY29sb3IuYm9sZCwgW0RFQlVHXTogY29sb3IuYmx1ZSwgW0lORk9dOiBjb2xvci5ncmVlbiB9O1xuICAgICAgICAgICAgbGV0IGRlc2MgPSBnTGV2ZWxzW2x2bF07XG4gICAgICAgICAgICBjb25zdCBmaWx0ZXJMZXZlbCA9IGNvbnRleHQubGV2ZWwgfHwgZ0dsb2JhbExldmVsO1xuICAgICAgICAgICAgaWYgKGRlc2MuaW1wb3J0YW5jZSA+PSBmaWx0ZXJMZXZlbC5pbXBvcnRhbmNlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0ZVN0ciA9IERhdGVfMS5kYXRlKGdEYXRlRm9ybWF0KTtcbiAgICAgICAgICAgICAgICBsZXQgbGluZSA9ICh0eXBlb2YgbXNnID09PSAnc3RyaW5nJykgPyBtc2cgOiBpbnNwZWN0KG1zZywgMCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9nTGluZSA9IGAke2RhdGVTdHJ9ICR7Y29udGV4dC5wcmVmaXh9ICR7ZGVzYy5kZXNjfSAke2xpbmV9YDtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xvckxpbmUgPSBgJHtjb2xvcnNbbHZsXSB8fCAnJ30gJHtkYXRlU3RyfSAke2NvbnRleHQucHJlZml4fSAke2Rlc2MuZGVzY30gJHtjb2xvci5jbGVhcn0gJHtsaW5lfWA7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZ0NvbG9ycyA/IGNvbG9yTGluZSA6IGxvZ0xpbmUpO1xuICAgICAgICAgICAgICAgIGlmIChtc2cgJiYgbXNnLnN0YWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG1zZy5zdGFjayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChnTG9nRmlsZSAmJiBsb2cyRmlsZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geWllbGQgY29udGV4dC5sb2dUb0ZpbGUoRGF0ZV8xLmRhdGUoZ0xvZ0ZpbGUpLCBsb2dMaW5lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gbG9nRmlsZShmaWxlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBpZiAoZmlsZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGdMb2dGaWxlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCBpbmZvKFwiZGlzYWJsaW5nIGxvZ2ZpbGVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChmaWxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gRGF0ZV8xLmRhdGUoZ0xvZ0ZpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZmlsZS5pbmRleE9mKCcvJykgPj0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCBjb250ZXh0LnBhdGhFeGlzdHMoZmlsZSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGV4aXN0cykgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ0xvZ0ZpbGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geWllbGQgd2FybihgcGF0aCAnJHtmaWxlfScgZG9lc24ndCBleGlzdHM7IGxvZ2ZpbGUgZGlzYWJsZWRgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBnTG9nRmlsZSA9IGZpbGU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCBpbmZvKFwibm93IGxvZ2dpbmcgdG8gZmlsZSBcIiArIERhdGVfMS5kYXRlKGZpbGUpKTtcbiAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKCgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgICAgICAgICAgZ0xvZ0ZpbGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCBlcnJvcihgY2hlY2tpbmcgcGF0aCAke2ZpbGV9OyBsb2dmaWxlIGRpc2FibGVkYCk7XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZmlsZSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICBmaWxlID0gJ2xvZy0lWVlZWS0lTU0tJURELnR4dCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdMb2dGaWxlID0gZmlsZTtcbiAgICAgICAgICAgIHJldHVybiB5aWVsZCBpbmZvKGdMb2dGaWxlID8gYG5vdyBsb2dnaW5nIHRvIGZpbGUgJHtEYXRlXzEuZGF0ZShnTG9nRmlsZSl9YCA6ICdsb2dmaWxlIGRpc2JhbGVkJyk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjb25maWcoY2ZnKSB7XG4gICAgICAgIGlmIChjZmcuY29sb3JzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGdDb2xvcnMgPSBjZmcuY29sb3JzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjZmcuZm9ybWF0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZvcm1hdChjZmcuZm9ybWF0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2ZnLmxldmVsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGxldmVsKGNmZy5sZXZlbCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gaW5zcGVjdChtc2csIGRlcHRoID0gMSwgaW5kZW50ID0gJycpIHtcbiAgICAgICAgaWYgKGRlcHRoID09PSBudWxsKSB7XG4gICAgICAgICAgICBkZXB0aCA9IDk5OTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobXNnID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gJ251bGwnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtc2cgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuICd1bmRlZmluZWQnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgbXNnID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2Z1bmN0aW9uJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIG1zZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBgJyR7bXNnfSdgO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgbXNnID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKGRlcHRoIDwgMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAobXNnLmxlbmd0aCA9PT0gdW5kZWZpbmVkKSA/ICd7Li4ufScgOiAnWy4uLl0nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1zZy5sZW5ndGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBgWyR7bXNnLm1hcCgoZSkgPT4gKGUgPT09IHVuZGVmaW5lZCkgPyAnJyA6IGluc3BlY3QoZSwgZGVwdGggLSAxLCBpbmRlbnQpKS5qb2luKCcsICcpfV1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICd7XFxuJyArIE9iamVjdC5rZXlzKG1zZykubWFwKGsgPT4gYCAgICR7aW5kZW50fSR7a306ICR7aW5zcGVjdChtc2dba10sIGRlcHRoIC0gMSwgaW5kZW50ICsgJyAgICcpfWApLmpvaW4oJyxcXG4nKSArIGBcXG4ke2luZGVudH19YDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbXNnLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGNvbnN0IG5ld0xvZyA9IGZ1bmN0aW9uIChwcmVmaXgsIGxvZ1RvRmlsZSA9IGNvbnRleHQubG9nVG9GaWxlLCBwYXRoRXhpc3RzID0gY29udGV4dC5wYXRoRXhpc3RzKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGUocHJlZml4LCBsb2dUb0ZpbGUsIHBhdGhFeGlzdHMpO1xuICAgIH07XG4gICAgbmV3TG9nLkRFQlVHID0gREVCVUc7XG4gICAgbmV3TG9nLklORk8gPSBJTkZPO1xuICAgIG5ld0xvZy5XQVJOID0gV0FSTjtcbiAgICBuZXdMb2cuRVJST1IgPSBFUlJPUjtcbiAgICBuZXdMb2cubGV2ZWwgPSBsZXZlbDtcbiAgICBuZXdMb2cuZGVidWcgPSBkZWJ1ZztcbiAgICBuZXdMb2cuaW5mbyA9IGluZm87XG4gICAgbmV3TG9nLndhcm4gPSB3YXJuO1xuICAgIG5ld0xvZy5lcnJvciA9IGVycm9yO1xuICAgIG5ld0xvZy5mb3JtYXQgPSBmb3JtYXQ7XG4gICAgbmV3TG9nLnByZWZpeCA9IHByZWZpeDtcbiAgICBuZXdMb2cub3V0ID0gb3V0O1xuICAgIG5ld0xvZy5sb2dGaWxlID0gbG9nRmlsZTtcbiAgICBuZXdMb2cuY29uZmlnID0gY29uZmlnO1xuICAgIG5ld0xvZy5pbnNwZWN0ID0gaW5zcGVjdDtcbiAgICByZXR1cm4gbmV3TG9nO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pYkc5bkxtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTGk0dmMzSmpMMnh2Wnk1MGN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3T3pzN08wRkJLMFZCTEdsRFFVRnJRenRCUVVkc1F5eE5RVUZOTEV0QlFVc3NSMEZCUnl4TlFVRk5MRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGSE9VSXNUVUZCVFN4SlFVRkpMRWRCUVVzc1RVRkJUU3hEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETzBGQlJ6bENMRTFCUVUwc1NVRkJTU3hIUVVGTExFMUJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0QlFVYzVRaXhOUVVGTkxFdEJRVXNzUjBGQlNTeE5RVUZOTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1FVRkhMMElzU1VGQlNTeFJRVUZuUWl4RFFVRkRPMEZCVTNKQ0xFMUJRVTBzVDBGQlR5eEhRVUZITzBsQlExb3NRMEZCUXl4TFFVRkxMRU5CUVVNc1JVRkJTeXhGUVVGRExGVkJRVlVzUlVGQlJTeERRVUZETEVWQlFVVXNSMEZCUnl4RlFVRkZMRXRCUVVzc1JVRkJSU3hKUVVGSkxFVkJRVVVzVDBGQlR5eEZRVUZETzBsQlEzUkVMRU5CUVVNc1NVRkJTU3hEUVVGRExFVkJRVTBzUlVGQlF5eFZRVUZWTEVWQlFVVXNRMEZCUXl4RlFVRkZMRWRCUVVjc1JVRkJSU3hKUVVGSkxFVkJRVWNzU1VGQlNTeEZRVUZGTEUxQlFVMHNSVUZCUXp0SlFVTnlSQ3hEUVVGRExFbEJRVWtzUTBGQlF5eEZRVUZOTEVWQlFVTXNWVUZCVlN4RlFVRkZMRU5CUVVNc1JVRkJSU3hIUVVGSExFVkJRVVVzU1VGQlNTeEZRVUZITEVsQlFVa3NSVUZCUlN4TlFVRk5MRVZCUVVNN1NVRkRja1FzUTBGQlF5eExRVUZMTEVOQlFVTXNSVUZCU3l4RlFVRkRMRlZCUVZVc1JVRkJSU3hEUVVGRExFVkJRVVVzUjBGQlJ5eEZRVUZGTEV0QlFVc3NSVUZCUlN4SlFVRkpMRVZCUVVVc1QwRkJUeXhGUVVGRE8wTkJRM3BFTEVOQlFVTTdRVUZIUml4SlFVRkpMRmxCUVZrc1IwRkJZU3hQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdRVUZITTBNc1RVRkJUU3hoUVVGaExFZEJRVWNzT0VKQlFUaENMRU5CUVVNN1FVRkRja1FzU1VGQlNTeFhRVUZYTEVkQlFVOHNZVUZCWVN4RFFVRkRPMEZCUjNCRExFbEJRVWtzVDBGQlR5eEhRVUZITEV0QlFVc3NRMEZCUXp0QlFVZHdRaXhOUVVGTkxFdEJRVXNzUjBGQlJ6dEpRVU5XTEVkQlFVY3NSVUZCU3l4VlFVRlZPMGxCUTJ4Q0xFMUJRVTBzUlVGQlJTeFZRVUZWTzBsQlEyeENMRWxCUVVrc1JVRkJTU3hWUVVGVk8wbEJRMnhDTEV0QlFVc3NSVUZCUnl4VlFVRlZPMGxCUTJ4Q0xFbEJRVWtzUlVGQlNTeFRRVUZUTzBsQlEycENMRXRCUVVzc1JVRkJSeXhUUVVGVE8wTkJRM0JDTEVOQlFVTTdRVUZ4U1Zjc1VVRkJRU3hIUVVGSExFZEJRVmNzVFVGQlRTeERRVUZETEVWQlFVVXNSVUZEYUVNc1EwRkJReXhSUVVGbExFVkJRVVVzUjBGQlZTeEZRVUZyUWl4RlFVRkZMRU5CUVVNc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eFRRVUZUTEVOQlFVTXNSVUZGTTBVc1EwRkJReXhKUVVGWExFVkJRVzFDTEVWQlFVVXNRMEZCUVN4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWxCUVVVc1EwRkJReXhEUVVGQkxFTkJRVU1zUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVOMlJpeERRVUZETzBGQlJVWXNVMEZCVXl4TlFVRk5MRU5CUVVNc1QwRkJZeXhGUVVGRkxGTkJRV2xDTEVWQlFVVXNWVUZCYVVJN1NVRkRhRVVzVFVGQlRTeFBRVUZQTEVkQlFVYzdVVUZEV2l4TFFVRkxMRVZCUVd0Q0xGTkJRVk03VVVGRGFFTXNUVUZCVFN4RlFVRk5MRTlCUVU4N1VVRkRia0lzVTBGQlV5eEZRVUZaTEZOQlFWTTdVVUZET1VJc1ZVRkJWU3hGUVVGVkxGVkJRVlU3UzBGRGFrTXNRMEZCUXp0SlFVVkdMRk5CUVZNc1MwRkJTeXhEUVVGRExGZEJRVzFDTEVWQlFVVXNZMEZCWXl4SFFVRkRMRXRCUVVzN1VVRkRjRVFzU1VGQlNTeFJRVUZSTEVkQlFVY3NUMEZCVHl4RFFVRkRMRmRCUVZjc1EwRkJReXhKUVVGSkxGbEJRVmtzUTBGQlF6dFJRVU53UkN4SlFVRkpMRkZCUVZFc1IwRkJSeXhQUVVGUExFTkJRVU1zUzBGQlN5eEpRVUZKTEZsQlFWa3NRMEZCUXp0UlFVTTNReXhKUVVGSkxGZEJRVmNzUzBGQlN5eFRRVUZUTEVWQlFVVTdXVUZETTBJc1VVRkJVU3hIUVVGSExGRkJRVkVzUTBGQlF6dFRRVU4yUWp0aFFVRk5MRWxCUVVrc1YwRkJWeXhMUVVGTExFbEJRVWtzUlVGQlJUdFpRVU0zUWl4UFFVRlBMRU5CUVVNc1MwRkJTeXhIUVVGSExGTkJRVk1zUTBGQlF6dFRRVU0zUWp0aFFVRk5MRWxCUVVrc1QwRkJUeXhEUVVGRExGZEJRVmNzUTBGQlF5eEZRVUZGTzFsQlF6ZENMRWxCUVVrc1kwRkJZeXhGUVVGRk8yZENRVUZGTEZsQlFWa3NSMEZCUnl4UlFVRlJMRU5CUVVNN1lVRkJSVHRwUWtGRE5VSTdaMEpCUVVVc1QwRkJUeXhEUVVGRExFdEJRVXNzUjBGQlJ5eFJRVUZSTEVOQlFVTTdZVUZCUlR0WlFVTnFSQ3hOUVVGTkxFZEJRVWNzUjBGQlJ5eFBRVUZQTEdOQlFXTXNRMEZCUVN4RFFVRkRMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF5eFBRVUZQTEVOQlFVTXNUVUZCVFN4alFVRmpMRkZCUVZFc1EwRkJReXhKUVVGSkxFTkJRVU1zVjBGQlZ5eEZRVUZGTEZOQlFWTXNVVUZCVVN4RFFVRkRMRWxCUVVrc1EwRkJReXhYUVVGWExFVkJRVVVzUjBGQlJ5eERRVUZETzFsQlF6ZEpMRWRCUVVjc1EwRkJReXhEUVVGRExGRkJRVkVzUTBGQlF5eEhRVUZITEV0QlFVc3NVVUZCVVN4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGQkxFTkJRVU1zUTBGQlFTeExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRWxCUVVrc1JVRkJSU3hIUVVGSExFTkJRVU1zUTBGQlF6dFRRVU14UkR0aFFVRk5PMWxCUTBnc1IwRkJSeXhEUVVGRExFdEJRVXNzUlVGQlJTeG5Ra0ZCWjBJc1YwRkJWeXhEUVVGRExGRkJRVkVzUlVGQlJTeDFRa0ZCZFVJc1VVRkJVU3hEUVVGRExFZEJRVWNzUTBGQlF5eFJRVUZSTEVWQlFVVXNSVUZCUlN4RFFVRkRMRU5CUVVNN1UwRkRkRWM3VVVGRFJDeFBRVUZQTEZGQlFWRXNRMEZCUXl4SFFVRkhMRU5CUVVNN1NVRkRlRUlzUTBGQlF6dEpRVVZFTEZOQlFXVXNTMEZCU3l4RFFVRkRMRWRCUVU4c1JVRkJSU3hSUVVGUkxFZEJRVU1zU1VGQlNUczRSRUZCYjBJc1QwRkJUeXhOUVVGTkxFZEJRVWNzUTBGQlF5eExRVUZMTEVWQlFVVXNSMEZCUnl4RlFVRkZMRkZCUVZFc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dExRVUZCTzBsQlEzaEhMRk5CUVdVc1NVRkJTU3hEUVVGRExFZEJRVThzUlVGQlJTeFJRVUZSTEVkQlFVTXNTVUZCU1RzNFJFRkJiMElzVDBGQlR5eE5RVUZOTEVkQlFVY3NRMEZCUXl4SlFVRkpMRVZCUVVVc1IwRkJSeXhGUVVGRkxGRkJRVkVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0TFFVRkJPMGxCUTNSSExGTkJRV1VzU1VGQlNTeERRVUZETEVkQlFVOHNSVUZCUlN4UlFVRlJMRWRCUVVNc1NVRkJTVHM0UkVGQmIwSXNUMEZCVHl4TlFVRk5MRWRCUVVjc1EwRkJReXhKUVVGSkxFVkJRVVVzUjBGQlJ5eEZRVUZGTEZGQlFWRXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRMUVVGQk8wbEJRM1JITEZOQlFXVXNTMEZCU3l4RFFVRkRMRWRCUVU4c1JVRkJSU3hSUVVGUkxFZEJRVU1zU1VGQlNUczRSRUZCYjBJc1QwRkJUeXhOUVVGTkxFZEJRVWNzUTBGQlF5eExRVUZMTEVWQlFVVXNSMEZCUnl4RlFVRkZMRkZCUVZFc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dExRVUZCTzBsQlJYaEhMRk5CUVZNc1RVRkJUU3hEUVVGRExFMUJRV003VVVGRE1VSXNTVUZCU1N4TlFVRk5MRXRCUVVzc1NVRkJTU3hGUVVGRk8xbEJRVVVzVjBGQlZ5eEhRVUZITEdGQlFXRXNRMEZCUXp0VFFVRkZPMkZCUTJoRUxFbEJRVWtzVFVGQlRTeEZRVUZOTzFsQlFVVXNWMEZCVnl4SFFVRkhMRTFCUVUwc1EwRkJRenRUUVVGRk8xRkJRemxETEU5QlFVOHNWMEZCVnl4RFFVRkRPMGxCUTNaQ0xFTkJRVU03U1VGRlJDeFRRVUZUTEUxQlFVMHNRMEZCUXl4SFFVRlhPMUZCUTNaQ0xFbEJRVWtzUjBGQlJ5eEZRVUZGTzFsQlFVVXNUMEZCVHl4RFFVRkRMRTFCUVUwc1IwRkJSeXhIUVVGSExFTkJRVU03VTBGQlJUdFJRVU5zUXl4UFFVRlBMRTlCUVU4c1EwRkJReXhOUVVGTkxFTkJRVU03U1VGRE1VSXNRMEZCUXp0SlFVVkVMRk5CUVdVc1IwRkJSeXhEUVVGRExFZEJRVlVzUlVGQlJTeEhRVUZQTEVWQlFVVXNVVUZCVVN4SFFVRkRMRWxCUVVrN08xbEJRMnBFTEUxQlFVMHNUVUZCVFN4SFFVRkhMRVZCUVVVc1EwRkJReXhMUVVGTExFTkJRVU1zUlVGQlJTeExRVUZMTEVOQlFVTXNSMEZCUnl4SFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFVkJRVVVzUTBGQlF5eEpRVUZKTEVOQlFVTXNSVUZCUlN4TFFVRkxMRU5CUVVNc1RVRkJUU3hIUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTEVWQlFVVXNRMEZCUXl4TFFVRkxMRU5CUVVNc1JVRkJSU3hMUVVGTExFTkJRVU1zU1VGQlNTeEZRVUZGTEVOQlFVTXNTVUZCU1N4RFFVRkRMRVZCUVVVc1MwRkJTeXhEUVVGRExFdEJRVXNzUlVGQlJTeERRVUZETzFsQlF6VklMRWxCUVVrc1NVRkJTU3hIUVVGSExFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0WlFVTjRRaXhOUVVGTkxGZEJRVmNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNTMEZCU3l4SlFVRkpMRmxCUVZrc1EwRkJRenRaUVVOc1JDeEpRVUZKTEVsQlFVa3NRMEZCUXl4VlFVRlZMRWxCUVVrc1YwRkJWeXhEUVVGRExGVkJRVlVzUlVGQlJUdG5Ra0ZETTBNc1RVRkJUU3hQUVVGUExFZEJRVWNzVjBGQlNTeERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRPMmRDUVVOc1F5eEpRVUZKTEVsQlFVa3NSMEZCUnl4RFFVRkRMRTlCUVU4c1IwRkJSeXhMUVVGTExGRkJRVkVzUTBGQlF5eERRVUZCTEVOQlFVTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRExFOUJRVThzUTBGQlF5eEhRVUZITEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUVVNN1owSkJRelZFTEUxQlFVMHNUMEZCVHl4SFFVRjNRaXhIUVVGSExFOUJRVThzU1VGQlNTeFBRVUZQTEVOQlFVTXNUVUZCVFN4SlFVRkpMRWxCUVVrc1EwRkJReXhKUVVGSkxFbEJRVWtzU1VGQlNTeEZRVUZGTEVOQlFVTTdaMEpCUTNwR0xFMUJRVTBzVTBGQlV5eEhRVUZITEVkQlFVY3NUVUZCVFN4RFFVRkRMRWRCUVVjc1EwRkJReXhKUVVGRkxFVkJRVVVzU1VGQlNTeFBRVUZQTEVsQlFVa3NUMEZCVHl4RFFVRkRMRTFCUVUwc1NVRkJTU3hKUVVGSkxFTkJRVU1zU1VGQlNTeEpRVUZKTEV0QlFVc3NRMEZCUXl4TFFVRkxMRWxCUVVrc1NVRkJTU3hGUVVGRkxFTkJRVU03WjBKQlEzaEhMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zVDBGQlR5eERRVUZCTEVOQlFVTXNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJReXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzJkQ1FVTXhReXhKUVVGSkxFZEJRVWNzU1VGQlNTeEhRVUZITEVOQlFVTXNTMEZCU3l4RlFVRkZPMjlDUVVGRkxFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNSMEZCUnl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE8ybENRVUZGTzJkQ1FVTnFSQ3hKUVVGSkxGRkJRVkVzU1VGQlNTeFJRVUZSTEVWQlFVVTdiMEpCUTNSQ0xFOUJRVThzVFVGQlRTeFBRVUZQTEVOQlFVTXNVMEZCVXl4RFFVRkRMRmRCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUlVGQlJTeFBRVUZQTEVOQlFVTXNRMEZCUXp0cFFrRkRNMFE3WVVGRFNqdFpRVU5FTEU5QlFVOHNVMEZCVXl4RFFVRkRPMUZCUTNKQ0xFTkJRVU03UzBGQlFUdEpRVVZFTEZOQlFXVXNUMEZCVHl4RFFVRkRMRWxCUVZrN08xbEJReTlDTEVsQlFVa3NTVUZCU1N4TFFVRkxMRWxCUVVrc1JVRkJSVHRuUWtGRFppeFJRVUZSTEVkQlFVY3NVMEZCVXl4RFFVRkRPMmRDUVVOeVFpeFBRVUZQTEUxQlFVMHNTVUZCU1N4RFFVRkRMRzFDUVVGdFFpeERRVUZETEVOQlFVTTdZVUZETVVNN2FVSkJRVTBzU1VGQlNTeEpRVUZKTEV0QlFVc3NVMEZCVXl4RlFVRkZPMmRDUVVNelFpeFBRVUZQTEZkQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRoUVVONlFqdHBRa0ZCVFN4SlFVRkpMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zUjBGQlJ5eERRVUZETEVsQlFVVXNRMEZCUXl4RlFVRkZPMmRDUVVNM1FpeFBRVUZQTEUxQlFVMHNUMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJReXhKUVVGSkxFTkJRVU03Y1VKQlEyaERMRWxCUVVrc1EwRkJReXhEUVVGUExFMUJRV01zUlVGQlJTeEZRVUZGTzI5Q1FVTXpRaXhKUVVGSkxFTkJRVU1zVFVGQlRTeEZRVUZGTzNkQ1FVTlVMRkZCUVZFc1IwRkJSeXhUUVVGVExFTkJRVU03ZDBKQlEzSkNMRTlCUVU4c1RVRkJUU3hKUVVGSkxFTkJRVU1zVTBGQlV5eEpRVUZKTEc5RFFVRnZReXhEUVVGRExFTkJRVU03Y1VKQlEzaEZPMjlDUVVORUxGRkJRVkVzUjBGQlJ5eEpRVUZKTEVOQlFVTTdiMEpCUTJoQ0xFOUJRVThzVFVGQlRTeEpRVUZKTEVOQlFVTXNjMEpCUVhOQ0xFZEJRVWNzVjBGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNN1owSkJRek5FTEVOQlFVTXNRMEZCUVN4RFFVRkRPM0ZDUVVORUxFdEJRVXNzUTBGQlF5eEhRVUZUTEVWQlFVVTdiMEpCUTJRc1VVRkJVU3hIUVVGSExGTkJRVk1zUTBGQlF6dHZRa0ZEY2tJc1QwRkJUeXhOUVVGTkxFdEJRVXNzUTBGQlF5eHBRa0ZCYVVJc1NVRkJTU3h2UWtGQmIwSXNRMEZCUXl4RFFVRkRPMmRDUVVOc1JTeERRVUZETEVOQlFVRXNRMEZCUXl4RFFVRkRPMkZCUTFZN2FVSkJRVTBzU1VGQlNTeEpRVUZKTEV0QlFVc3NSVUZCUlN4RlFVRkZPMmRDUVVOd1FpeEpRVUZKTEVkQlFVY3NkVUpCUVhWQ0xFTkJRVU03WVVGRGJFTTdhVUpCUVUwN1lVRkRUanRaUVVORUxGRkJRVkVzUjBGQlF5eEpRVUZKTEVOQlFVTTdXVUZEWkN4UFFVRlBMRTFCUVUwc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlFTeERRVUZETEVOQlFVTXNkVUpCUVhWQ0xGZEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJReXhyUWtGQmEwSXNRMEZCUXl4RFFVRkRPMUZCUXpsR0xFTkJRVU03UzBGQlFUdEpRVVZFTEZOQlFWTXNUVUZCVFN4RFFVRkRMRWRCUVhGRU8xRkJRMnBGTEVsQlFVa3NSMEZCUnl4RFFVRkRMRTFCUVUwc1MwRkJSeXhUUVVGVExFVkJRVVU3V1VGQlJTeFBRVUZQTEVkQlFVY3NSMEZCUnl4RFFVRkRMRTFCUVUwc1EwRkJRenRUUVVGRk8xRkJRM0pFTEVsQlFVa3NSMEZCUnl4RFFVRkRMRTFCUVUwc1MwRkJSeXhUUVVGVExFVkJRVVU3V1VGQlJTeE5RVUZOTEVOQlFVTXNSMEZCUnl4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRE8xTkJRVVU3VVVGRGJrUXNTVUZCU1N4SFFVRkhMRU5CUVVNc1MwRkJTeXhMUVVGSExGTkJRVk1zUlVGQlJ6dFpRVUZGTEV0QlFVc3NRMEZCUXl4SFFVRkhMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03VTBGQlJUdEpRVU55UkN4RFFVRkRPMGxCUlVRc1UwRkJVeXhQUVVGUExFTkJRVU1zUjBGQlR5eEZRVUZGTEV0QlFVc3NSMEZCUXl4RFFVRkRMRVZCUVVVc1RVRkJUU3hIUVVGRExFVkJRVVU3VVVGRGVFTXNTVUZCU1N4TFFVRkxMRXRCUVVjc1NVRkJTU3hGUVVGblFqdFpRVUZGTEV0QlFVc3NSMEZCUnl4SFFVRkhMRU5CUVVNN1UwRkJSVHRSUVVOb1JDeEpRVUZKTEVkQlFVY3NTMEZCU3l4SlFVRkpMRVZCUVdkQ08xbEJRVVVzVDBGQlR5eE5RVUZOTEVOQlFVTTdVMEZCUlR0UlFVTnNSQ3hKUVVGSkxFZEJRVWNzUzBGQlN5eFRRVUZUTEVWQlFWYzdXVUZCUlN4UFFVRlBMRmRCUVZjc1EwRkJRenRUUVVGRk8xRkJRM1pFTEVsQlFVa3NUMEZCVHl4SFFVRkhMRXRCUVVzc1ZVRkJWU3hGUVVGSE8xbEJRVVVzVDBGQlR5eFZRVUZWTEVOQlFVTTdVMEZCUlR0UlFVTjBSQ3hKUVVGSkxFOUJRVThzUjBGQlJ5eExRVUZMTEZGQlFWRXNSVUZCU3p0WlFVRkZMRTlCUVU4c1NVRkJTU3hIUVVGSExFZEJRVWNzUTBGQlF6dFRRVUZGTzFGQlEzUkVMRWxCUVVrc1QwRkJUeXhIUVVGSExFdEJRVXNzVVVGQlVTeEZRVUZMTzFsQlF6VkNMRWxCUVVrc1MwRkJTeXhIUVVGRExFTkJRVU1zUlVGQlJUdG5Ra0ZCUlN4UFFVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExFMUJRVTBzUzBGQlJ5eFRRVUZUTEVOQlFVTXNRMEZCUVN4RFFVRkRMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU1zUTBGQlF5eFBRVUZQTEVOQlFVTTdZVUZCUlR0WlFVTndSU3hKUVVGSkxFZEJRVWNzUTBGQlF5eE5RVUZOTEV0QlFVc3NVMEZCVXl4RlFVRkZPMmRDUVVGRkxFOUJRVThzU1VGQlNTeEhRVUZITEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJTeXhGUVVGRExFVkJRVVVzUTBGQlFTeERRVUZETEVOQlFVTXNTMEZCUnl4VFFVRlRMRU5CUVVNc1EwRkJRU3hEUVVGRExFTkJRVUVzUlVGQlJTeERRVUZCTEVOQlFVTXNRMEZCUVN4UFFVRlBMRU5CUVVNc1EwRkJReXhGUVVGRkxFdEJRVXNzUjBGQlF5eERRVUZETEVWQlFVVXNUVUZCVFN4RFFVRkRMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXp0aFFVRkZPMWxCUXpWSUxFOUJRVThzUzBGQlN5eEhRVUZITEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1RVRkJUU3hOUVVGTkxFZEJRVWNzUTBGQlF5eExRVU55UkN4UFFVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF5eEZRVUZGTEV0QlFVc3NSMEZCUXl4RFFVRkRMRVZCUVVVc1RVRkJUU3hIUVVGRExFdEJRVXNzUTBGRGVrTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEV0QlFVc3NUVUZCVFN4SFFVRkhMRU5CUVVNN1UwRkRjRU03VVVGRFJDeFBRVUZQTEVkQlFVY3NRMEZCUXl4UlFVRlJMRVZCUVVVc1EwRkJRenRKUVVNeFFpeERRVUZETzBsQlJVUXNUVUZCVFN4TlFVRk5MRWRCUVU4c1ZVRkJVeXhOUVVGaExFVkJRVVVzV1VGQmEwSXNUMEZCVHl4RFFVRkRMRk5CUVZNc1JVRkJSU3hoUVVGclFpeFBRVUZQTEVOQlFVTXNWVUZCVlR0UlFVTm9TQ3hQUVVGUExFMUJRVTBzUTBGQlF5eE5RVUZOTEVWQlFVVXNVMEZCVXl4RlFVRkZMRlZCUVZVc1EwRkJReXhEUVVGRE8wbEJRMnBFTEVOQlFVTXNRMEZCUXp0SlFVTkdMRTFCUVUwc1EwRkJReXhMUVVGTExFZEJRVTBzUzBGQlN5eERRVUZETzBsQlEzaENMRTFCUVUwc1EwRkJReXhKUVVGSkxFZEJRVThzU1VGQlNTeERRVUZETzBsQlEzWkNMRTFCUVUwc1EwRkJReXhKUVVGSkxFZEJRVThzU1VGQlNTeERRVUZETzBsQlEzWkNMRTFCUVUwc1EwRkJReXhMUVVGTExFZEJRVTBzUzBGQlN5eERRVUZETzBsQlEzaENMRTFCUVUwc1EwRkJReXhMUVVGTExFZEJRVTBzUzBGQlN5eERRVUZETzBsQlEzaENMRTFCUVUwc1EwRkJReXhMUVVGTExFZEJRVTBzUzBGQlN5eERRVUZETzBsQlEzaENMRTFCUVUwc1EwRkJReXhKUVVGSkxFZEJRVThzU1VGQlNTeERRVUZETzBsQlEzWkNMRTFCUVUwc1EwRkJReXhKUVVGSkxFZEJRVThzU1VGQlNTeERRVUZETzBsQlEzWkNMRTFCUVUwc1EwRkJReXhMUVVGTExFZEJRVTBzUzBGQlN5eERRVUZETzBsQlEzaENMRTFCUVUwc1EwRkJReXhOUVVGTkxFZEJRVXNzVFVGQlRTeERRVUZETzBsQlEzcENMRTFCUVUwc1EwRkJReXhOUVVGTkxFZEJRVXNzVFVGQlRTeERRVUZETzBsQlEzcENMRTFCUVUwc1EwRkJReXhIUVVGSExFZEJRVkVzUjBGQlJ5eERRVUZETzBsQlEzUkNMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWtzVDBGQlR5eERRVUZETzBsQlF6RkNMRTFCUVUwc1EwRkJReXhOUVVGTkxFZEJRVXNzVFVGQlRTeERRVUZETzBsQlEzcENMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWtzVDBGQlR5eERRVUZETzBsQlF6RkNMRTlCUVU4c1RVRkJUU3hEUVVGRE8wRkJRMnhDTEVOQlFVTWlmUT09IiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBoc3V0aWxfMSA9IHJlcXVpcmUoXCJoc3V0aWxcIik7XG5jb25zdCBsb2cgPSBoc3V0aWxfMS5sb2coJ2QzLkF4aXMnKTtcbmNvbnN0IEdyYXBoQ29tcG9uZW50XzEgPSByZXF1aXJlKFwiLi9HcmFwaENvbXBvbmVudFwiKTtcbmNvbnN0IGQzQXhpcyA9IHJlcXVpcmUoXCJkMy1heGlzXCIpO1xuY29uc3QgYXhpc1dpZHRoID0gNTA7XG5jb25zdCB0aWNrV2lkdGggPSAxMDtcbnZhciBEaXJlY3Rpb247XG4oZnVuY3Rpb24gKERpcmVjdGlvbikge1xuICAgIERpcmVjdGlvbltcIkhvcml6b250YWxcIl0gPSBcImhvclwiO1xuICAgIERpcmVjdGlvbltcIlZlcnRpY2FsXCJdID0gXCJ2ZXJcIjtcbn0pKERpcmVjdGlvbiA9IGV4cG9ydHMuRGlyZWN0aW9uIHx8IChleHBvcnRzLkRpcmVjdGlvbiA9IHt9KSk7XG5jbGFzcyBBeGlzIGV4dGVuZHMgR3JhcGhDb21wb25lbnRfMS5HcmFwaENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoY2ZnLCBkaXIpIHtcbiAgICAgICAgc3VwZXIoY2ZnKTtcbiAgICAgICAgdGhpcy5kaXIgPSBkaXI7XG4gICAgICAgIHRoaXMuc3ZnID0gY2ZnLmJhc2VTVkcuYXBwZW5kKCdnJykuY2xhc3NlZChgJHtkaXJ9QXhpc2AsIHRydWUpO1xuICAgIH1cbiAgICByZW5kZXIoZGF0YSkge1xuICAgICAgICBjb25zdCBzY2FsZXMgPSB0aGlzLmNvbmZpZy5zY2FsZXM7XG4gICAgICAgIGNvbnN0IHN0eWxlID0gdGhpcy5jb25maWcuZGVmYXVsdHMuQXhlc1t0aGlzLmRpcl07XG4gICAgICAgIGxldCBheGlzO1xuICAgICAgICB0aGlzLnN2Z1xuICAgICAgICAgICAgLmF0dHIoJ3N0cm9rZScsIHN0eWxlLmxpbmUuY29sb3IpXG4gICAgICAgICAgICAuYXR0cignc3Ryb2tlLXdpZHRoJywgc3R5bGUubGluZS53aWR0aClcbiAgICAgICAgICAgIC5hdHRyKCdzdHJva2Utb3BhY2l0eScsIHN0eWxlLmxpbmUub3BhY2l0eSk7XG4gICAgICAgIGlmICh0aGlzLmRpciA9PT0gRGlyZWN0aW9uLkhvcml6b250YWwpIHtcbiAgICAgICAgICAgIGNvbnN0IHlDcm9zc2luZyA9IE1hdGgubWF4KGF4aXNXaWR0aCwgTWF0aC5taW4oc2NhbGVzLnZlci5zY2FsZSgwKSwgdGhpcy5jb25maWcudmlld1BvcnQuaGVpZ2h0IC0gYXhpc1dpZHRoKSk7XG4gICAgICAgICAgICBheGlzID0gZDNBeGlzLmF4aXNUb3AodGhpcy5jb25maWcuc2NhbGVzLmhvci5zY2FsZSk7XG4gICAgICAgICAgICB0aGlzLnN2Zy5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoMCwgJHt5Q3Jvc3Npbmd9KWApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgeENyb3NzaW5nID0gTWF0aC5tYXgoYXhpc1dpZHRoLCBNYXRoLm1pbihzY2FsZXMuaG9yLnNjYWxlKDApLCB0aGlzLmNvbmZpZy52aWV3UG9ydC53aWR0aCAtIGF4aXNXaWR0aCkpO1xuICAgICAgICAgICAgYXhpcyA9IGQzQXhpcy5heGlzUmlnaHQodGhpcy5jb25maWcuc2NhbGVzLnZlci5zY2FsZSk7XG4gICAgICAgICAgICB0aGlzLnN2Zy5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoJHt4Q3Jvc3Npbmd9LCAwKWApO1xuICAgICAgICB9XG4gICAgICAgIGF4aXMudGlja1NpemUodGlja1dpZHRoKTtcbiAgICAgICAgdGhpcy5zdmcuY2FsbChheGlzKTtcbiAgICAgICAgdGhpcy5zdmcuc2VsZWN0QWxsKCd0ZXh0JykudHJhbnNpdGlvbigpLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAuYXR0cignc3R5bGUnLCBgZm9udC1mYW1pbHk6JHtzdHlsZS50aWNrTGFiZWwuZm9udC5mYW1pbHl9OyBmb250LXNpemU6JHtzdHlsZS50aWNrTGFiZWwuZm9udC5zaXplfXB4OyBmb250LXN0eWxlOiR7c3R5bGUudGlja0xhYmVsLmZvbnQuc3R5bGV9OyBmb250LXdlaWdodDoke3N0eWxlLnRpY2tMYWJlbC5mb250LndlaWdodH07YCk7XG4gICAgfVxufVxuZXhwb3J0cy5BeGlzID0gQXhpcztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaVFYaHBjeTVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpNHVMM055WXk5QmVHbHpMblJ6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3TzBGQlQwRXNiVU5CUVRCRE8wRkJRVWNzVFVGQlRTeEhRVUZITEVkQlFVY3NXVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8wRkJRM3BGTEhGRVFVRnZSRHRCUVV0d1JDeHJRMEZCTWtNN1FVRkZNME1zVFVGQlRTeFRRVUZUTEVkQlFWVXNSVUZCUlN4RFFVRkRPMEZCUXpWQ0xFMUJRVTBzVTBGQlV5eEhRVUZWTEVWQlFVVXNRMEZCUXp0QlFVVTFRaXhKUVVGWkxGTkJSMWc3UVVGSVJDeFhRVUZaTEZOQlFWTTdTVUZEYWtJc0swSkJRVzFDTEVOQlFVRTdTVUZEYmtJc05rSkJRVzFDTEVOQlFVRTdRVUZEZGtJc1EwRkJReXhGUVVoWExGTkJRVk1zUjBGQlZDeHBRa0ZCVXl4TFFVRlVMR2xDUVVGVExGRkJSM0JDTzBGQlJVUXNUVUZCWVN4SlFVRkxMRk5CUVZFc0swSkJRV003U1VGTGNFTXNXVUZCV1N4SFFVRlpMRVZCUVVVc1IwRkJZVHRSUVVOdVF5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN1VVRkRXQ3hKUVVGSkxFTkJRVU1zUjBGQlJ5eEhRVUZITEVkQlFVY3NRMEZCUXp0UlFVTm1MRWxCUVVrc1EwRkJReXhIUVVGSExFZEJRVWNzUjBGQlJ5eERRVUZETEU5QlFVOHNRMEZCUXl4TlFVRk5MRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zVDBGQlR5eERRVUZETEVkQlFVY3NSMEZCUnl4TlFVRk5MRVZCUVVVc1NVRkJTU3hEUVVGRExFTkJRVU03U1VGRGJrVXNRMEZCUXp0SlFVVkVMRTFCUVUwc1EwRkJReXhKUVVGVE8xRkJRMW9zVFVGQlRTeE5RVUZOTEVkQlFVY3NTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU03VVVGRGJFTXNUVUZCVFN4TFFVRkxMRWRCUVVjc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eFJRVUZSTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF6dFJRVU5zUkN4SlFVRkpMRWxCUVVrc1EwRkJRenRSUVVOVUxFbEJRVWtzUTBGQlF5eEhRVUZITzJGQlEwZ3NTVUZCU1N4RFFVRkRMRkZCUVZFc1JVRkJSU3hMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXp0aFFVTm9ReXhKUVVGSkxFTkJRVU1zWTBGQll5eEZRVUZGTEV0QlFVc3NRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRE8yRkJRM1JETEVsQlFVa3NRMEZCUXl4blFrRkJaMElzUlVGQlJTeExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE8xRkJSV2hFTEVsQlFVa3NTVUZCU1N4RFFVRkRMRWRCUVVjc1MwRkJSeXhUUVVGVExFTkJRVU1zVlVGQlZTeEZRVUZGTzFsQlEycERMRTFCUVUwc1UwRkJVeXhIUVVGSExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNVMEZCVXl4RlFVRkZMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zVFVGQlRTeERRVUZETEVkQlFVY3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFVkJRVVVzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4UlFVRlJMRU5CUVVNc1RVRkJUU3hIUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETEVOQlFVTTdXVUZETlVjc1NVRkJTU3hIUVVGSExFMUJRVTBzUTBGQlF5eFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPMWxCUTNCRUxFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNTVUZCU1N4RFFVRkRMRmRCUVZjc1JVRkJSU3huUWtGQlowSXNVMEZCVXl4SFFVRkhMRU5CUVVNc1EwRkJRenRUUVVNMVJEdGhRVUZOTzFsQlEwZ3NUVUZCVFN4VFFVRlRMRWRCUVVjc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eFRRVUZUTEVWQlFVVXNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1JVRkJSU3hKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEZGQlFWRXNRMEZCUXl4TFFVRkxMRWRCUVVNc1UwRkJVeXhEUVVGRExFTkJRVU1zUTBGQlF6dFpRVU16Unl4SlFVRkpMRWRCUVVjc1RVRkJUU3hEUVVGRExGTkJRVk1zUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRTFCUVUwc1EwRkJReXhIUVVGSExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdXVUZEZEVRc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEpRVUZKTEVOQlFVTXNWMEZCVnl4RlFVRkZMR0ZCUVdFc1UwRkJVeXhOUVVGTkxFTkJRVU1zUTBGQlF6dFRRVU0xUkR0UlFVTkVMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdVVUZEZWtJc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1VVRkRjRUlzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4VFFVRlRMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU1zVlVGQlZTeEZRVUZGTEVOQlFVTXNVVUZCVVN4RFFVRkRMRWxCUVVrc1EwRkJRenRoUVVOcVJDeEpRVUZKTEVOQlFVTXNUMEZCVHl4RlFVRkZMR1ZCUVdVc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4bFFVRmxMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NhMEpCUVd0Q0xFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc2FVSkJRV2xDTEV0QlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNc1NVRkJTU3hEUVVGRExFMUJRVTBzUjBGQlJ5eERRVUZETEVOQlFVTTdTVUZEZEUwc1EwRkJRenREUVVOS08wRkJiRU5FTEc5Q1FXdERReUo5IiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBEZWZhdWx0cyB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgICAgIHRoaXMuYXhlcyA9IHt9O1xuICAgICAgICB0aGlzLnNjYWxlcyA9IHt9O1xuICAgIH1cbiAgICBnZXQgR3JhcGgoKSB7XG4gICAgICAgIHJldHVybiB7IGNhbnZhczogZGVmYXVsdFJlY3QoJyNmZmYnLCAyLCAnI2NjYycpIH07XG4gICAgfVxuICAgIGdldCBQbG90KCkge1xuICAgICAgICByZXR1cm4geyBhcmVhOiBkZWZhdWx0UmVjdCgnI2ZmZicpIH07XG4gICAgfVxuICAgIGdldCBTZXJpZXMoKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgZ2V0IEF4ZXMoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBob3I6IHtcbiAgICAgICAgICAgICAgICBsaW5lOiBkZWZhdWx0TGluZSgyKSxcbiAgICAgICAgICAgICAgICB0aWNrTWFya3M6IGRlZmF1bHRMaW5lKDIpLFxuICAgICAgICAgICAgICAgIHRpY2tMYWJlbDogZGVmYXVsdFRleHQoKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZlcjoge1xuICAgICAgICAgICAgICAgIGxpbmU6IGRlZmF1bHRMaW5lKDIpLFxuICAgICAgICAgICAgICAgIHRpY2tNYXJrczogZGVmYXVsdExpbmUoMiksXG4gICAgICAgICAgICAgICAgdGlja0xhYmVsOiBkZWZhdWx0VGV4dCgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIFNjYWxlcyhkYXRhQ29sKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNjYWxlc1tkYXRhQ29sXSA9IHRoaXMuc2NhbGVzW2RhdGFDb2xdIHx8IGRlZmF1bHRTY2FsZSgwLCAxMDApO1xuICAgIH1cbn1cbmV4cG9ydHMuRGVmYXVsdHMgPSBEZWZhdWx0cztcbmZ1bmN0aW9uIGRlZmF1bHRMaW5lKHdpZHRoLCBjb2xvciA9ICcjMDAwJykge1xuICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICBvcGFjaXR5OiAxXG4gICAgfTtcbn1cbmV4cG9ydHMuZGVmYXVsdExpbmUgPSBkZWZhdWx0TGluZTtcbmZ1bmN0aW9uIGRlZmF1bHRSZWN0KGFyZWEsIGJvcmRlcldpZHRoID0gMCwgYm9yZGVyQ29sb3IgPSAnI2ZmZicpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByeDogMCxcbiAgICAgICAgcnk6IDAsXG4gICAgICAgIGZpbGw6IHtcbiAgICAgICAgICAgIGNvbG9yOiBhcmVhLFxuICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICB9LFxuICAgICAgICBzdHJva2U6IHtcbiAgICAgICAgICAgIHdpZHRoOiBib3JkZXJXaWR0aCxcbiAgICAgICAgICAgIGNvbG9yOiBib3JkZXJDb2xvcixcbiAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgfVxuICAgIH07XG59XG5mdW5jdGlvbiBkZWZhdWx0U2NhbGUobWluUmFuZ2UsIG1heFJhbmdlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogJ2xpbmVhcicsXG4gICAgICAgIGRvbWFpbjogeyBtaW46ICdhdXRvJywgbWF4OiAnYXV0bycgfSxcbiAgICAgICAgcmFuZ2U6IHsgbWluOiBtaW5SYW5nZSwgbWF4OiBtYXhSYW5nZSB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRUZXh0KCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbG9yOiAnIzAwMCcsXG4gICAgICAgIGZvbnQ6IHtcbiAgICAgICAgICAgIGZhbWlseTogJ3NhbnMtc2VyaWYnLFxuICAgICAgICAgICAgc2l6ZTogMjAsXG4gICAgICAgICAgICBzdHlsZTogJ25vcm1hbCcsXG4gICAgICAgICAgICB3ZWlnaHQ6ICdub3JtYWwnXG4gICAgICAgIH1cbiAgICB9O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pUkdWbVlYVnNkSE11YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sY3lJNld5SXVMaTl6Y21NdlJHVm1ZWFZzZEhNdWRITWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdRVUYxUWtFc1RVRkJZU3hSUVVGUk8wbEJTMnBDTEZsQlFWa3NUVUZCWjBJN1VVRktjRUlzVTBGQlNTeEhRVUZITEVWQlFVVXNRMEZCUXp0UlFVVldMRmRCUVUwc1IwRkJSeXhGUVVGRkxFTkJRVU03U1VGRlZ5eERRVUZETzBsQlJXaERMRWxCUVVrc1MwRkJTenRSUVVOTUxFOUJRVThzUlVGQlJTeE5RVUZOTEVWQlFVVXNWMEZCVnl4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRExFVkJRVVVzVFVGQlRTeERRVUZETEVWQlFVVXNRMEZCUXp0SlFVTjBSQ3hEUVVGRE8wbEJSVVFzU1VGQlNTeEpRVUZKTzFGQlEwb3NUMEZCVHl4RlFVRkZMRWxCUVVrc1JVRkJSU3hYUVVGWExFTkJRVU1zVFVGQlRTeERRVUZETEVWQlFVVXNRMEZCUXp0SlFVTjZReXhEUVVGRE8wbEJSVVFzU1VGQlNTeE5RVUZOTzFGQlEwNHNUMEZCVHl4RlFVRkZMRU5CUVVNN1NVRkRaQ3hEUVVGRE8wbEJSVVFzU1VGQlNTeEpRVUZKTzFGQlFXdENMRTlCUVU4N1dVRkROMElzUjBGQlJ5eEZRVUZGTzJkQ1FVTkVMRWxCUVVrc1JVRkJVU3hYUVVGWExFTkJRVU1zUTBGQlF5eERRVUZETzJkQ1FVTXhRaXhUUVVGVExFVkJRVWNzVjBGQlZ5eERRVUZETEVOQlFVTXNRMEZCUXp0blFrRkRNVUlzVTBGQlV5eEZRVUZITEZkQlFWY3NSVUZCUlR0aFFVTTFRanRaUVVORUxFZEJRVWNzUlVGQlJUdG5Ra0ZEUkN4SlFVRkpMRVZCUVZFc1YwRkJWeXhEUVVGRExFTkJRVU1zUTBGQlF6dG5Ra0ZETVVJc1UwRkJVeXhGUVVGSExGZEJRVmNzUTBGQlF5eERRVUZETEVOQlFVTTdaMEpCUXpGQ0xGTkJRVk1zUlVGQlJ5eFhRVUZYTEVWQlFVVTdZVUZETlVJN1UwRkRTaXhEUVVGRE8wbEJRVUVzUTBGQlF6dEpRVVZJTEUxQlFVMHNRMEZCUXl4UFFVRmxPMUZCUTJ4Q0xFOUJRVThzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNc1IwRkJSeXhKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEU5QlFVOHNRMEZCUXl4SlFVRkpMRmxCUVZrc1EwRkJReXhEUVVGRExFVkJRVVVzUjBGQlJ5eERRVUZETEVOQlFVTTdTVUZETDBVc1EwRkJRenREUVVOS08wRkJia05FTERSQ1FXMURRenRCUVVWRUxGTkJRV2RDTEZkQlFWY3NRMEZCUXl4TFFVRlpMRVZCUVVVc1VVRkJXU3hOUVVGTk8wbEJRM2hFTEU5QlFVODdVVUZEU0N4TFFVRkxMRVZCUVVVc1MwRkJTenRSUVVOYUxFdEJRVXNzUlVGQlJTeExRVUZMTzFGQlExb3NUMEZCVHl4RlFVRkZMRU5CUVVNN1MwRkRZaXhEUVVGRE8wRkJRMDRzUTBGQlF6dEJRVTVFTEd0RFFVMURPMEZCVVVRc1UwRkJVeXhYUVVGWExFTkJRVU1zU1VGQlZTeEZRVUZGTEdOQlFXMUNMRU5CUVVNc1JVRkJSU3hqUVVGclFpeE5RVUZOTzBsQlF6TkZMRTlCUVU4N1VVRkRTQ3hGUVVGRkxFVkJRVVVzUTBGQlF6dFJRVU5NTEVWQlFVVXNSVUZCUlN4RFFVRkRPMUZCUTB3c1NVRkJTU3hGUVVGRk8xbEJRMFlzUzBGQlN5eEZRVUZGTEVsQlFVazdXVUZEV0N4UFFVRlBMRVZCUVVVc1EwRkJRenRUUVVOaU8xRkJRMFFzVFVGQlRTeEZRVUZGTzFsQlEwb3NTMEZCU3l4RlFVRkZMRmRCUVZjN1dVRkRiRUlzUzBGQlN5eEZRVUZGTEZkQlFWYzdXVUZEYkVJc1QwRkJUeXhGUVVGRkxFTkJRVU03VTBGRFlqdExRVU5LTEVOQlFVTTdRVUZEVGl4RFFVRkRPMEZCUlVRc1UwRkJVeXhaUVVGWkxFTkJRVU1zVVVGQlowSXNSVUZCUlN4UlFVRmxPMGxCUVd0Q0xFOUJRVTg3VVVGRE5VVXNTVUZCU1N4RlFVRkpMRkZCUVZFN1VVRkRhRUlzVFVGQlRTeEZRVUZGTEVWQlFVTXNSMEZCUnl4RlFVRkZMRTFCUVUwc1JVRkJSU3hIUVVGSExFVkJRVVVzVFVGQlRTeEZRVUZETzFGQlEyeERMRXRCUVVzc1JVRkJSeXhGUVVGRkxFZEJRVWNzUlVGQlJTeFJRVUZSTEVWQlFVVXNSMEZCUnl4RlFVRkZMRkZCUVZFc1JVRkJSVHRMUVVNelF5eERRVUZETzBGQlFVRXNRMEZCUXp0QlFVVklMRk5CUVZNc1YwRkJWenRKUVVOb1FpeFBRVUZQTzFGQlEwZ3NTMEZCU3l4RlFVRkZMRTFCUVUwN1VVRkRZaXhKUVVGSkxFVkJRVVU3V1VGRFJpeE5RVUZOTEVWQlFVVXNXVUZCV1R0WlFVTndRaXhKUVVGSkxFVkJRVWtzUlVGQlJUdFpRVU5XTEV0QlFVc3NSVUZCUlN4UlFVRlJPMWxCUTJZc1RVRkJUU3hGUVVGRkxGRkJRVkU3VTBGRGJrSTdTMEZEU2l4RFFVRkRPMEZCUTA0c1EwRkJReUo5IiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBoc3V0aWxfMSA9IHJlcXVpcmUoXCJoc3V0aWxcIik7XG5jb25zdCBsb2cgPSBoc3V0aWxfMS5sb2coJ2QzLkdyYXBoJyk7XG5jb25zdCBkMyA9IHJlcXVpcmUoXCJkM1wiKTtcbmNvbnN0IFBsb3RfMSA9IHJlcXVpcmUoXCIuL1Bsb3RcIik7XG5jb25zdCBBeGlzXzEgPSByZXF1aXJlKFwiLi9BeGlzXCIpO1xuY29uc3QgR3JhcGhDb21wb25lbnRfMSA9IHJlcXVpcmUoXCIuL0dyYXBoQ29tcG9uZW50XCIpO1xuY29uc3QgbWFyZ2luID0gMTA7XG5sb2cuaW5mbygnR3JhcGgzRCcpO1xuZnVuY3Rpb24gY3JlYXRlQmFzZVNWRyhjZmcpIHtcbiAgICBjb25zdCBiYXNlID0gZDMuc2VsZWN0KGNmZy5yb290KTtcbiAgICBiYXNlLnNlbGVjdEFsbCgnZGl2JykucmVtb3ZlKCk7XG4gICAgYmFzZS5zZWxlY3RBbGwoJ3N2ZycpLnJlbW92ZSgpO1xuICAgIGNvbnN0IHN2ZyA9IGJhc2UuYXBwZW5kKCdzdmcnKVxuICAgICAgICAuY2xhc3NlZCgnYmFzZVNWRycsIHRydWUpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCAnMTAwJScpXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsICcxMDAlJylcbiAgICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pbllNaW4gbWVldCcpO1xuICAgIGNmZy5iYXNlU1ZHID0gc3ZnO1xuICAgIHN2Zy5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAuY2xhc3NlZCgnYmFzZVJlY3QnLCB0cnVlKVxuICAgICAgICAuYXR0cigneCcsIDApXG4gICAgICAgIC5hdHRyKCd5JywgMCk7XG4gICAgcmV0dXJuIHN2Zztcbn1cbmZ1bmN0aW9uIHVwZGF0ZUJhc2VTVkcoY2ZnKSB7XG4gICAgY2ZnLmJhc2VTVkcuYXR0cigndmlld0JveCcsIGAwIDAgJHtjZmcudmlld1BvcnQud2lkdGh9ICR7Y2ZnLnZpZXdQb3J0LmhlaWdodH1gKTtcbn1cbmNsYXNzIEdyYXBoIGV4dGVuZHMgR3JhcGhDb21wb25lbnRfMS5HcmFwaENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Iocm9vdCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmF4ZXMgPSBbXTtcbiAgICAgICAgdGhpcy5jdW11bGF0aXZlRG9tYWlucyA9IHt9O1xuICAgICAgICB0aGlzLmNvbmZpZy5yb290ID0gcm9vdDtcbiAgICAgICAgbG9nLmluZm8oJ2NyZWF0aW5nIEdyYXBoJyk7XG4gICAgICAgIGNvbnN0IGJhc2UgPSBjcmVhdGVCYXNlU1ZHKHRoaXMuY29uZmlnKTtcbiAgICAgICAgdXBkYXRlQmFzZVNWRyh0aGlzLmNvbmZpZyk7XG4gICAgICAgIHRoaXMucGxvdCA9IG5ldyBQbG90XzEuUGxvdCh0aGlzLmNvbmZpZyk7XG4gICAgICAgIHRoaXMuYXhlcy5wdXNoKG5ldyBBeGlzXzEuQXhpcyh0aGlzLmNvbmZpZywgQXhpc18xLkRpcmVjdGlvbi5Ib3Jpem9udGFsKSk7XG4gICAgICAgIHRoaXMuYXhlcy5wdXNoKG5ldyBBeGlzXzEuQXhpcyh0aGlzLmNvbmZpZywgQXhpc18xLkRpcmVjdGlvbi5WZXJ0aWNhbCkpO1xuICAgICAgICB3aW5kb3cub25yZXNpemUgPSAoKSA9PiB0aGlzLnJlc2l6ZSgpO1xuICAgIH1cbiAgICBnZXQgZGVmYXVsdHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5kZWZhdWx0cztcbiAgICB9XG4gICAgcmVzaXplKCkge1xuICAgICAgICBjb25zdCBjZmcgPSB0aGlzLmNvbmZpZztcbiAgICAgICAgaWYgKGNmZy5yb290LmNsaWVudFdpZHRoID4gMCkge1xuICAgICAgICAgICAgaWYgKGNmZy5yb290LmNsaWVudFdpZHRoICE9PSBjZmcuY2xpZW50LndpZHRoIHx8IGNmZy5yb290LmNsaWVudEhlaWdodCAhPT0gY2ZnLmNsaWVudC5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBsb2cuaW5mbyhgcmVzaXppbmcgc3ZnOiBbJHtjZmcuY2xpZW50LndpZHRofSB4ICR7Y2ZnLmNsaWVudC5oZWlnaHR9XSAtPiBbJHtjZmcucm9vdC5jbGllbnRXaWR0aH0geCAke2NmZy5yb290LmNsaWVudEhlaWdodH1dYCk7XG4gICAgICAgICAgICAgICAgY2ZnLmNsaWVudC53aWR0aCA9IGNmZy5yb290LmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgICAgIGNmZy5jbGllbnQuaGVpZ2h0ID0gY2ZnLnJvb3QuY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgICAgIGNmZy52aWV3UG9ydC5oZWlnaHQgPSBjZmcudmlld1BvcnQud2lkdGggKiBjZmcucm9vdC5jbGllbnRIZWlnaHQgLyBjZmcucm9vdC5jbGllbnRXaWR0aDtcbiAgICAgICAgICAgICAgICB1cGRhdGVCYXNlU1ZHKGNmZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVuZGVyKGRhdGEpIHtcbiAgICAgICAgdGhpcy5zZXRTY2FsZXMoZGF0YSk7XG4gICAgICAgIHRoaXMuZHJhd0NhbnZhcyh0aGlzLmNvbmZpZyk7XG4gICAgICAgIHRoaXMucGxvdC5zZXRCb3JkZXJzKDEwLCAxMCwgMTAsIDEwKTtcbiAgICAgICAgdGhpcy5wbG90LnJlbmRlcihkYXRhKTtcbiAgICAgICAgdGhpcy5heGVzLmZvckVhY2goYSA9PiBhLnJlbmRlcihkYXRhKSk7XG4gICAgfVxuICAgIGFkZFNlcmllcyh0eXBlLCB4LCB5LCAuLi5wYXJhbXMpIHtcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcbiAgICAgICAgdGhpcy5jb25maWcuc2NhbGVzLmhvci5kYXRhQ29sID0geDtcbiAgICAgICAgdGhpcy5jb25maWcuc2NhbGVzLnZlci5kYXRhQ29sID0geTtcbiAgICAgICAgdGhpcy5wbG90LmFkZFNlcmllcyh0eXBlLCB4LCB5LCAuLi5wYXJhbXMpO1xuICAgIH1cbiAgICBkcmF3Q2FudmFzKGNmZykge1xuICAgICAgICBjb25zdCBjYW52YXMgPSBjZmcuZGVmYXVsdHMuR3JhcGguY2FudmFzO1xuICAgICAgICBkMy5zZWxlY3QoJy5iYXNlUmVjdCcpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCBjZmcudmlld1BvcnQud2lkdGgpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgY2ZnLnZpZXdQb3J0LmhlaWdodClcbiAgICAgICAgICAgIC5hdHRyKCdyeCcsIGNhbnZhcy5yeClcbiAgICAgICAgICAgIC5hdHRyKCdyeScsIGNhbnZhcy5yeSlcbiAgICAgICAgICAgIC5hdHRyKCdzdHJva2UnLCBjYW52YXMuc3Ryb2tlLmNvbG9yKVxuICAgICAgICAgICAgLmF0dHIoJ3N0cm9rZS13aWR0aCcsIGNhbnZhcy5zdHJva2Uud2lkdGgpXG4gICAgICAgICAgICAuYXR0cignc3Ryb2tlLW9wYWNpdHknLCBjYW52YXMuc3Ryb2tlLm9wYWNpdHkpXG4gICAgICAgICAgICAuYXR0cignZmlsbCcsIGNhbnZhcy5maWxsLmNvbG9yKVxuICAgICAgICAgICAgLmF0dHIoJ2ZpbGwtb3BhY2l0eScsIGNhbnZhcy5maWxsLm9wYWNpdHkpO1xuICAgIH1cbiAgICBzZXRTY2FsZXMoZGF0YSkge1xuICAgICAgICBmdW5jdGlvbiBleHBhbmREb21haW4oZG9tYWlucywgY29sTmFtZSkge1xuICAgICAgICAgICAgZG9tYWluc1tjb2xOYW1lXSA9IGRvbWFpbnNbY29sTmFtZV0gfHwgWzFlOTAsIC0xZTkwXTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFEb20gPSBkYXRhLmZpbmREb21haW4oY29sTmFtZSk7XG4gICAgICAgICAgICBkb21haW5zW2NvbE5hbWVdWzBdID0gTWF0aC5taW4oZG9tYWluc1tjb2xOYW1lXVswXSwgZGF0YURvbVswXSk7XG4gICAgICAgICAgICBkb21haW5zW2NvbE5hbWVdWzFdID0gTWF0aC5tYXgoZG9tYWluc1tjb2xOYW1lXVsxXSwgZGF0YURvbVsxXSk7XG4gICAgICAgICAgICByZXR1cm4gZG9tYWluc1tjb2xOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBob3IgPSB0aGlzLmNvbmZpZy5zY2FsZXMuaG9yO1xuICAgICAgICBjb25zdCB2ZXIgPSB0aGlzLmNvbmZpZy5zY2FsZXMudmVyO1xuICAgICAgICBob3Iuc2NhbGUgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAgICAgICAuZG9tYWluKGV4cGFuZERvbWFpbih0aGlzLmN1bXVsYXRpdmVEb21haW5zLCBob3IuZGF0YUNvbCkpXG4gICAgICAgICAgICAucmFuZ2UoW21hcmdpbiwgdGhpcy5jb25maWcudmlld1BvcnQud2lkdGggLSAyICogbWFyZ2luXSk7XG4gICAgICAgIHZlci5zY2FsZSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgICAgICAgIC5kb21haW4oZXhwYW5kRG9tYWluKHRoaXMuY3VtdWxhdGl2ZURvbWFpbnMsIHZlci5kYXRhQ29sKSlcbiAgICAgICAgICAgIC5yYW5nZShbdGhpcy5jb25maWcudmlld1BvcnQuaGVpZ2h0IC0gMiAqIG1hcmdpbiwgbWFyZ2luXSk7XG4gICAgfVxufVxuZXhwb3J0cy5HcmFwaCA9IEdyYXBoO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pUjNKaGNHZ3Vhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdUxpOXpjbU12UjNKaGNHZ3VkSE1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3UVVGdlJFRXNiVU5CUVRCRE8wRkJRVWNzVFVGQlRTeEhRVUZITEVkQlFVY3NXVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRE8wRkJRekZGTEhsQ1FVRnpRenRCUVU5MFF5eHBRMEZCTUVNN1FVRkRNVU1zYVVOQlFUQkRPMEZCUXpGRExIRkVRVUZ2UkR0QlFVVndSQ3hOUVVGTkxFMUJRVTBzUjBGQlZTeEZRVUZGTEVOQlFVTTdRVUZGZWtJc1IwRkJSeXhEUVVGRExFbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0QlFVOXdRaXhUUVVGVExHRkJRV0VzUTBGQlF5eEhRVUZoTzBsQlEyaERMRTFCUVUwc1NVRkJTU3hIUVVGSExFVkJRVVVzUTBGQlF5eE5RVUZOTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8wbEJRMnBETEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTTdTVUZETDBJc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4TlFVRk5MRVZCUVVVc1EwRkJRenRKUVVNdlFpeE5RVUZOTEVkQlFVY3NSMEZCUnl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF6dFRRVU42UWl4UFFVRlBMRU5CUVVNc1UwRkJVeXhGUVVGRkxFbEJRVWtzUTBGQlF6dFRRVU40UWl4SlFVRkpMRU5CUVVNc1VVRkJVU3hGUVVGRkxFMUJRVTBzUTBGQlF6dFRRVU4wUWl4SlFVRkpMRU5CUVVNc1QwRkJUeXhGUVVGRkxFMUJRVTBzUTBGQlF6dFRRVU55UWl4SlFVRkpMRU5CUVVNc2NVSkJRWEZDTEVWQlFVVXNaVUZCWlN4RFFVRkRMRU5CUXpWRE8wbEJRMHdzUjBGQlJ5eERRVUZETEU5QlFVOHNSMEZCUnl4SFFVRkhMRU5CUVVNN1NVRkRiRUlzUjBGQlJ5eERRVUZETEUxQlFVMHNRMEZCUXl4TlFVRk5MRU5CUVVNN1UwRkRZaXhQUVVGUExFTkJRVU1zVlVGQlZTeEZRVUZGTEVsQlFVa3NRMEZCUXp0VFFVTjZRaXhKUVVGSkxFTkJRVU1zUjBGQlJ5eEZRVUZGTEVOQlFVTXNRMEZCUXp0VFFVTmFMRWxCUVVrc1EwRkJReXhIUVVGSExFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTTdTVUZEYkVJc1QwRkJUeXhIUVVGSExFTkJRVU03UVVGRFppeERRVUZETzBGQlRVUXNVMEZCVXl4aFFVRmhMRU5CUVVNc1IwRkJZVHRKUVVOb1F5eEhRVUZITEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGVExFVkJRVVVzVDBGQlR5eEhRVUZITEVOQlFVTXNVVUZCVVN4RFFVRkRMRXRCUVVzc1NVRkJTU3hIUVVGSExFTkJRVU1zVVVGQlVTeERRVUZETEUxQlFVMHNSVUZCUlN4RFFVRkRMRU5CUVVNN1FVRkRjRVlzUTBGQlF6dEJRVWRFTEUxQlFXRXNTMEZCVFN4VFFVRlJMQ3RDUVVGak8wbEJTM0pETEZsQlFWa3NTVUZCVVR0UlFVTm9RaXhMUVVGTExFVkJRVVVzUTBGQlF6dFJRVXBLTEZOQlFVa3NSMEZCVlN4RlFVRkZMRU5CUVVNN1VVRkRha0lzYzBKQlFXbENMRWRCUVhsRExFVkJRVVVzUTBGQlF6dFJRVWxxUlN4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExFbEJRVWtzUjBGQlJ5eEpRVUZKTEVOQlFVTTdVVUZEZUVJc1IwRkJSeXhEUVVGRExFbEJRVWtzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhEUVVGRE8xRkJRek5DTEUxQlFVMHNTVUZCU1N4SFFVRkhMR0ZCUVdFc1EwRkJReXhKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdVVUZEZUVNc1lVRkJZU3hEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0UlFVTXpRaXhKUVVGSkxFTkJRVU1zU1VGQlNTeEhRVUZITEVsQlFVa3NWMEZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dFJRVU5zUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEZkQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1RVRkJUU3hGUVVGRkxHZENRVUZUTEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVNMVJDeEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxGZEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RlFVRkZMR2RDUVVGVExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNRMEZCUXp0UlFVTXhSQ3hOUVVGTkxFTkJRVU1zVVVGQlVTeEhRVUZITEVkQlFVY3NSVUZCUlN4RFFVRkRMRWxCUVVrc1EwRkJReXhOUVVGTkxFVkJRVVVzUTBGQlF6dEpRVU14UXl4RFFVRkRPMGxCUlVRc1NVRkJWeXhSUVVGUk8xRkJRMllzVDBGQlR5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRkZCUVZFc1EwRkJRenRKUVVOb1F5eERRVUZETzBsQlJVUXNUVUZCVFR0UlFVTkdMRTFCUVUwc1IwRkJSeXhIUVVGSExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTTdVVUZEZUVJc1NVRkJTU3hIUVVGSExFTkJRVU1zU1VGQlNTeERRVUZETEZkQlFWY3NSMEZCUnl4RFFVRkRMRVZCUVVVN1dVRkRNVUlzU1VGQlNTeEhRVUZITEVOQlFVTXNTVUZCU1N4RFFVRkRMRmRCUVZjc1MwRkJTeXhIUVVGSExFTkJRVU1zVFVGQlRTeERRVUZETEV0QlFVc3NTVUZCU1N4SFFVRkhMRU5CUVVNc1NVRkJTU3hEUVVGRExGbEJRVmtzUzBGQlN5eEhRVUZITEVOQlFVTXNUVUZCVFN4RFFVRkRMRTFCUVUwc1JVRkJSVHRuUWtGRE1VWXNSMEZCUnl4RFFVRkRMRWxCUVVrc1EwRkJReXhyUWtGQmEwSXNSMEZCUnl4RFFVRkRMRTFCUVUwc1EwRkJReXhMUVVGTExFMUJRVTBzUjBGQlJ5eERRVUZETEUxQlFVMHNRMEZCUXl4TlFVRk5MRk5CUVZNc1IwRkJSeXhEUVVGRExFbEJRVWtzUTBGQlF5eFhRVUZYTEUxQlFVMHNSMEZCUnl4RFFVRkRMRWxCUVVrc1EwRkJReXhaUVVGWkxFZEJRVWNzUTBGQlF5eERRVUZETzJkQ1FVTXZTQ3hIUVVGSExFTkJRVU1zVFVGQlRTeERRVUZETEV0QlFVc3NSMEZCUnl4SFFVRkhMRU5CUVVNc1NVRkJTU3hEUVVGRExGZEJRVmNzUTBGQlF6dG5Ra0ZEZUVNc1IwRkJSeXhEUVVGRExFMUJRVTBzUTBGQlF5eE5RVUZOTEVkQlFVY3NSMEZCUnl4RFFVRkRMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU03WjBKQlF6RkRMRWRCUVVjc1EwRkJReXhSUVVGUkxFTkJRVU1zVFVGQlRTeEhRVUZITEVkQlFVY3NRMEZCUXl4UlFVRlJMRU5CUVVNc1MwRkJTeXhIUVVGSExFZEJRVWNzUTBGQlF5eEpRVUZKTEVOQlFVTXNXVUZCV1N4SFFVRkhMRWRCUVVjc1EwRkJReXhKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETzJkQ1FVTjRSaXhoUVVGaExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdZVUZEZEVJN1UwRkRTanRKUVVOTUxFTkJRVU03U1VGTlRTeE5RVUZOTEVOQlFVTXNTVUZCVXp0UlFVTnVRaXhKUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMUZCUTNKQ0xFbEJRVWtzUTBGQlF5eFZRVUZWTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRE8xRkJRemRDTEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1ZVRkJWU3hEUVVGRExFVkJRVVVzUlVGQlJTeEZRVUZGTEVWQlFVVXNSVUZCUlN4RlFVRkZMRVZCUVVVc1EwRkJReXhEUVVGRE8xRkJRM0pETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzFGQlEzWkNMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXl4RFFVRkRPMGxCUXpORExFTkJRVU03U1VGUFRTeFRRVUZUTEVOQlFVTXNTVUZCVnl4RlFVRkZMRU5CUVZFc1JVRkJSU3hEUVVGUkxFVkJRVVVzUjBGQlJ5eE5RVUZsTzFGQlEyaEZMRWxCUVVrc1EwRkJReXhOUVVGTkxFVkJRVVVzUTBGQlF6dFJRVU5rTEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWNzUTBGQlF5eFBRVUZQTEVkQlFVY3NRMEZCUXl4RFFVRkRPMUZCUTI1RExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1EwRkJReXhQUVVGUExFZEJRVWNzUTBGQlF5eERRVUZETzFGQlEyNURMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEVsQlFVa3NSVUZCUlN4RFFVRkRMRVZCUVVVc1EwRkJReXhGUVVGRkxFZEJRVWNzVFVGQlRTeERRVUZETEVOQlFVTTdTVUZETDBNc1EwRkJRenRKUVUxUExGVkJRVlVzUTBGQlF5eEhRVUZoTzFGQlF6VkNMRTFCUVUwc1RVRkJUU3hIUVVGSExFZEJRVWNzUTBGQlF5eFJRVUZSTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1EwRkJRenRSUVVONlF5eEZRVUZGTEVOQlFVTXNUVUZCVFN4RFFVRkRMRmRCUVZjc1EwRkJRenRoUVVOeVFpeEpRVUZKTEVOQlFVTXNUMEZCVHl4RlFVRkZMRWRCUVVjc1EwRkJReXhSUVVGUkxFTkJRVU1zUzBGQlN5eERRVUZETzJGQlEycERMRWxCUVVrc1EwRkJReXhSUVVGUkxFVkJRVVVzUjBGQlJ5eERRVUZETEZGQlFWRXNRMEZCUXl4TlFVRk5MRU5CUVVNN1lVRkRia01zU1VGQlNTeERRVUZETEVsQlFVa3NSVUZCUlN4TlFVRk5MRU5CUVVNc1JVRkJSU3hEUVVGRE8yRkJRM0pDTEVsQlFVa3NRMEZCUXl4SlFVRkpMRVZCUVVVc1RVRkJUU3hEUVVGRExFVkJRVVVzUTBGQlF6dGhRVU55UWl4SlFVRkpMRU5CUVVNc1VVRkJVU3hGUVVGRkxFMUJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRPMkZCUTI1RExFbEJRVWtzUTBGQlF5eGpRVUZqTEVWQlFVVXNUVUZCVFN4RFFVRkRMRTFCUVUwc1EwRkJReXhMUVVGTExFTkJRVU03WVVGRGVrTXNTVUZCU1N4RFFVRkRMR2RDUVVGblFpeEZRVUZGTEUxQlFVMHNRMEZCUXl4TlFVRk5MRU5CUVVNc1QwRkJUeXhEUVVGRE8yRkJRemRETEVsQlFVa3NRMEZCUXl4TlFVRk5MRVZCUVVVc1RVRkJUU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTTdZVUZETDBJc1NVRkJTU3hEUVVGRExHTkJRV01zUlVGQlJTeE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE8wbEJReTlETEVOQlFVTTdTVUZGVHl4VFFVRlRMRU5CUVVNc1NVRkJVenRSUVVWMlFpeFRRVUZUTEZsQlFWa3NRMEZCUXl4UFFVRnZReXhGUVVGRkxFOUJRV003V1VGRGRFVXNUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhIUVVGSExFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1JVRkJSU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzFsQlEzSkVMRTFCUVUwc1QwRkJUeXhIUVVGM1FpeEpRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE8xbEJRemxFTEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNSVUZCUlN4UFFVRlBMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFpRVU5vUlN4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRVZCUVVVc1QwRkJUeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdXVUZEYUVVc1QwRkJUeXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdVVUZETlVJc1EwRkJRenRSUVVORUxFMUJRVTBzUjBGQlJ5eEhRVUZITEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWNzUTBGQlF6dFJRVU51UXl4TlFVRk5MRWRCUVVjc1IwRkJSeXhKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRU5CUVVNN1VVRkRia01zUjBGQlJ5eERRVUZETEV0QlFVc3NSMEZCUnl4RlFVRkZMRU5CUVVNc1YwRkJWeXhGUVVGRk8yRkJRM1pDTEUxQlFVMHNRMEZCUXl4WlFVRlpMRU5CUVVNc1NVRkJTU3hEUVVGRExHbENRVUZwUWl4RlFVRkZMRWRCUVVjc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dGhRVU42UkN4TFFVRkxMRU5CUVVNc1EwRkJReXhOUVVGTkxFVkJRVVVzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4UlFVRlJMRU5CUVVNc1MwRkJTeXhIUVVGRExFTkJRVU1zUjBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXl4RFFVRkRPMUZCUXpGRUxFZEJRVWNzUTBGQlF5eExRVUZMTEVkQlFVY3NSVUZCUlN4RFFVRkRMRmRCUVZjc1JVRkJSVHRoUVVOMlFpeE5RVUZOTEVOQlFVTXNXVUZCV1N4RFFVRkRMRWxCUVVrc1EwRkJReXhwUWtGQmFVSXNSVUZCUlN4SFFVRkhMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03WVVGRGVrUXNTMEZCU3l4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eFJRVUZSTEVOQlFVTXNUVUZCVFN4SFFVRkRMRU5CUVVNc1IwRkJReXhOUVVGTkxFVkJRVVVzVFVGQlRTeERRVUZETEVOQlFVTXNRMEZCUXp0SlFVTXZSQ3hEUVVGRE8wTkJRMG83UVVFNVJrUXNjMEpCT0VaREluMD0iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGluZGV4XzEgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2hzdXRpbC9pbmRleFwiKTtcbmNvbnN0IGxvZyA9IGluZGV4XzEubG9nKCdkMy5HcmFwaENvbXBvbmVudCcpO1xuY29uc3QgRGVmYXVsdHNfMSA9IHJlcXVpcmUoXCIuL0RlZmF1bHRzXCIpO1xuY29uc3QgdnBXaWR0aCA9IDEwMDA7XG5jbGFzcyBHcmFwaENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoY2ZnKSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY2ZnIHx8IHtcbiAgICAgICAgICAgIHJvb3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGJhc2VTVkc6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGNsaWVudDoge1xuICAgICAgICAgICAgICAgIHg6IDAsIHk6IDAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDAsIGhlaWdodDogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZpZXdQb3J0OiB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHZwV2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB2cFdpZHRoICogMC43XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVmYXVsdHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHNjYWxlczoge1xuICAgICAgICAgICAgICAgIGhvcjogeyBkYXRhQ29sOiB1bmRlZmluZWQsIHNjYWxlOiB1bmRlZmluZWQgfSxcbiAgICAgICAgICAgICAgICB2ZXI6IHsgZGF0YUNvbDogdW5kZWZpbmVkLCBzY2FsZTogdW5kZWZpbmVkIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jb25maWcuZGVmYXVsdHMgPSBuZXcgRGVmYXVsdHNfMS5EZWZhdWx0cyh0aGlzLmNvbmZpZyk7XG4gICAgfVxufVxuZXhwb3J0cy5HcmFwaENvbXBvbmVudCA9IEdyYXBoQ29tcG9uZW50O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pUjNKaGNHaERiMjF3YjI1bGJuUXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdUxpOXpjbU12UjNKaGNHaERiMjF3YjI1bGJuUXVkSE1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3UVVGTlFTd3lSRUZCSzBRN1FVRkJSeXhOUVVGTkxFZEJRVWNzUjBGQlJ5eFhRVUZKTEVOQlFVTXNiVUpCUVcxQ0xFTkJRVU1zUTBGQlF6dEJRVU40Unl4NVEwRkJNRU03UVVGTE1VTXNUVUZCVFN4UFFVRlBMRWRCUVdFc1NVRkJTU3hEUVVGRE8wRkJSUzlDTEUxQlFYTkNMR05CUVdNN1NVRkZhRU1zV1VGQldTeEhRVUZqTzFGQlEzUkNMRWxCUVVrc1EwRkJReXhOUVVGTkxFZEJRVWNzUjBGQlJ5eEpRVUZKTzFsQlEycENMRWxCUVVrc1JVRkJSU3hUUVVGVE8xbEJRMllzVDBGQlR5eEZRVUZGTEZOQlFWTTdXVUZEYkVJc1RVRkJUU3hGUVVGRk8yZENRVU5LTEVOQlFVTXNSVUZCUXl4RFFVRkRMRVZCUVVVc1EwRkJReXhGUVVGRExFTkJRVU03WjBKQlExSXNTMEZCU3l4RlFVRkZMRU5CUVVNc1JVRkJSU3hOUVVGTkxFVkJRVVVzUTBGQlF6dGhRVU4wUWp0WlFVTkVMRkZCUVZFc1JVRkJSVHRuUWtGRFRpeExRVUZMTEVWQlFVVXNUMEZCVHp0blFrRkRaQ3hOUVVGTkxFVkJRVVVzVDBGQlR5eEhRVUZITEVkQlFVYzdZVUZEZUVJN1dVRkRSQ3hSUVVGUkxFVkJRVVVzVTBGQlV6dFpRVU51UWl4TlFVRk5MRVZCUVVVN1owSkJRMG9zUjBGQlJ5eEZRVUZGTEVWQlFVVXNUMEZCVHl4RlFVRkZMRk5CUVZNc1JVRkJSU3hMUVVGTExFVkJRVVVzVTBGQlV5eEZRVUZETzJkQ1FVTTFReXhIUVVGSExFVkJRVVVzUlVGQlJTeFBRVUZQTEVWQlFVVXNVMEZCVXl4RlFVRkZMRXRCUVVzc1JVRkJSU3hUUVVGVExFVkJRVU03WVVGREwwTTdVMEZEU2l4RFFVRkRPMUZCUTBZc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eFJRVUZSTEVkQlFVY3NTVUZCU1N4dFFrRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0SlFVTnlSQ3hEUVVGRE8wTkJSVW83UVVGMlFrUXNkME5CZFVKREluMD0iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGluZGV4XzEgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2hzdXRpbC9pbmRleFwiKTtcbmNvbnN0IGxvZyA9IGluZGV4XzEubG9nKCdkMy5QbG90Jyk7XG5jb25zdCBHcmFwaENvbXBvbmVudF8xID0gcmVxdWlyZShcIi4vR3JhcGhDb21wb25lbnRcIik7XG5jb25zdCBidWJibGVfMSA9IHJlcXVpcmUoXCIuL2J1YmJsZVwiKTtcbmNvbnN0IERFRl9SQURJVVMgPSA1O1xuY2xhc3MgUGxvdCBleHRlbmRzIEdyYXBoQ29tcG9uZW50XzEuR3JhcGhDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKGNmZykge1xuICAgICAgICBzdXBlcihjZmcpO1xuICAgICAgICB0aGlzLnNlcmllcyA9IFtdO1xuICAgICAgICB0aGlzLmRlc2MgPSB7XG4gICAgICAgICAgICBjZmc6IGNmZyxcbiAgICAgICAgICAgIG1hcmdpbjogeyBsZWZ0OiAwLCB0b3A6IDAsIHJpZ2h0OiAwLCBib3R0b206IDAgfSxcbiAgICAgICAgICAgIHBsb3RCYXNlOiBjZmcuYmFzZVNWRy5hcHBlbmQoJ3N2ZycpLmNsYXNzZWQoJ3Bsb3RTVkcnLCB0cnVlKVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBtYXJnaW4gPSB0aGlzLmRlc2MubWFyZ2luO1xuICAgICAgICB0aGlzLmRlc2MucGxvdEJhc2UuYXBwZW5kKCdyZWN0JykuY2xhc3NlZCgncGxvdFJlY3QnLCB0cnVlKTtcbiAgICAgICAgUGxvdC5yZWdpc3RlcignYnViYmxlJywgYnViYmxlXzEuYnViYmxlKTtcbiAgICB9XG4gICAgc3RhdGljIHJlZ2lzdGVyKGtleSwgZm4pIHtcbiAgICAgICAgdGhpcy5wbG90Rm5NYXBba2V5XSA9IGZuO1xuICAgICAgICBsb2cuaW5mbyhgcmVnaXN0ZXJlZCBwbG90IHR5cGUgJyR7a2V5fSdgKTtcbiAgICB9XG4gICAgc2V0Qm9yZGVycyhsZWZ0LCB0b3AsIHJpZ2h0LCBib3R0b20pIHtcbiAgICAgICAgY29uc3QgbWFyZ2luID0gdGhpcy5kZXNjLm1hcmdpbjtcbiAgICAgICAgbWFyZ2luLmxlZnQgPSBsZWZ0O1xuICAgICAgICBtYXJnaW4ucmlnaHQgPSByaWdodDtcbiAgICAgICAgbWFyZ2luLnRvcCA9IHRvcDtcbiAgICAgICAgbWFyZ2luLmJvdHRvbSA9IGJvdHRvbTtcbiAgICB9XG4gICAgYWRkU2VyaWVzKHR5cGUsIC4uLnBhcmFtcykge1xuICAgICAgICBjb25zdCBmbiA9IFBsb3QucGxvdEZuTWFwW3R5cGVdO1xuICAgICAgICBjb25zdCBzZXJpZXNLZXkgPSBgJHt0eXBlfSAke3BhcmFtcy5qb2luKCcgJyl9YDtcbiAgICAgICAgdGhpcy5zZXJpZXNbc2VyaWVzS2V5XSA9IFt0eXBlXS5jb25jYXQocGFyYW1zKTtcbiAgICAgICAgaWYgKGZuKSB7XG4gICAgICAgICAgICB0aGlzLnNlcmllcy5wdXNoKChkYXRhKSA9PiBmbihkYXRhLCB0aGlzLmRlc2MsIC4uLnBhcmFtcykpO1xuICAgICAgICAgICAgbG9nLmluZm8oYGFkZGVkIHNlcmllcyAke3RoaXMuc2VyaWVzLmxlbmd0aH0gYXMgJyR7c2VyaWVzS2V5fSdgKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxvZy5lcnJvcihgdW5rbm93biBwbG90IHR5cGUgJHt0eXBlfTsgYXZhaWxhYmxlIHR5cGVzIGFyZTpcXG4gICAnJHtPYmplY3Qua2V5cyhQbG90LnBsb3RGbk1hcCkuam9pbihcIidcXG4gICAnXCIpfSdgKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW5kZXIoZGF0YSkge1xuICAgICAgICB0aGlzLnJlbmRlclBsb3RBcmVhKCk7XG4gICAgICAgIHRoaXMuc2VyaWVzLmZvckVhY2goKHMpID0+IHMoZGF0YSkpO1xuICAgIH1cbiAgICByZW5kZXJQbG90QXJlYSgpIHtcbiAgICAgICAgY29uc3QgbWFyZ2luID0gdGhpcy5kZXNjLm1hcmdpbjtcbiAgICAgICAgY29uc3QgcGxvdEFyZWEgPSB0aGlzLmRlc2MuY2ZnLmRlZmF1bHRzLlBsb3QuYXJlYTtcbiAgICAgICAgdGhpcy5kZXNjLnBsb3RCYXNlLnNlbGVjdCgnLnBsb3RSZWN0JylcbiAgICAgICAgICAgIC5hdHRyKCd4JywgbWFyZ2luLmxlZnQpXG4gICAgICAgICAgICAuYXR0cigneScsIG1hcmdpbi50b3ApXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLmRlc2MuY2ZnLnZpZXdQb3J0LndpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5kZXNjLmNmZy52aWV3UG9ydC5oZWlnaHQgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbSlcbiAgICAgICAgICAgIC5hdHRyKCdyeCcsIHBsb3RBcmVhLnJ4KVxuICAgICAgICAgICAgLmF0dHIoJ3J5JywgcGxvdEFyZWEucnkpXG4gICAgICAgICAgICAuYXR0cignc3Ryb2tlJywgcGxvdEFyZWEuc3Ryb2tlLmNvbG9yKVxuICAgICAgICAgICAgLmF0dHIoJ3N0cm9rZS13aWR0aCcsIHBsb3RBcmVhLnN0cm9rZS53aWR0aClcbiAgICAgICAgICAgIC5hdHRyKCdzdHJva2Utb3BhY2l0eScsIHBsb3RBcmVhLnN0cm9rZS5vcGFjaXR5KVxuICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCBwbG90QXJlYS5maWxsLmNvbG9yKVxuICAgICAgICAgICAgLmF0dHIoJ2ZpbGwtb3BhY2l0eScsIHBsb3RBcmVhLmZpbGwub3BhY2l0eSk7XG4gICAgfVxufVxuUGxvdC5wbG90Rm5NYXAgPSB7fTtcbmV4cG9ydHMuUGxvdCA9IFBsb3Q7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lVR3h2ZEM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWeklqcGJJaTR1TDNOeVl5OVFiRzkwTG5SeklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN08wRkJVVUVzTWtSQlFXMUZPMEZCUVVjc1RVRkJUU3hIUVVGSExFZEJRVWNzVjBGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMEZCUzJ4SExIRkVRVUZ2UkR0QlFVZHdSQ3h4UTBGQk5FTTdRVUZGTlVNc1RVRkJUU3hWUVVGVkxFZEJRVlVzUTBGQlF5eERRVUZETzBGQlJUVkNMRTFCUVdFc1NVRkJTeXhUUVVGUkxDdENRVUZqTzBsQlpYQkRMRmxCUVZrc1IwRkJXVHRSUVVOd1FpeExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN1VVRklVQ3hYUVVGTkxFZEJRVmtzUlVGQlJTeERRVUZETzFGQlNYcENMRWxCUVVrc1EwRkJReXhKUVVGSkxFZEJRVWM3V1VGRFVpeEhRVUZITEVWQlFVVXNSMEZCUnp0WlFVTlNMRTFCUVUwc1JVRkJSU3hGUVVGRkxFbEJRVWtzUlVGQlF5eERRVUZETEVWQlFVVXNSMEZCUnl4RlFVRkRMRU5CUVVNc1JVRkJSU3hMUVVGTExFVkJRVU1zUTBGQlF5eEZRVUZGTEUxQlFVMHNSVUZCUXl4RFFVRkRMRVZCUVVNN1dVRkRNME1zVVVGQlVTeEZRVUZGTEVkQlFVY3NRMEZCUXl4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEU5QlFVOHNRMEZCUXl4VFFVRlRMRVZCUVVVc1NVRkJTU3hEUVVGRE8xTkJReTlFTEVOQlFVTTdVVUZEUml4TlFVRk5MRTFCUVUwc1IwRkJSeXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXp0UlFVTm9ReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU1zVDBGQlR5eERRVUZETEZWQlFWVXNSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenRSUVVNMVJDeEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRkZCUVZFc1JVRkJSU3hsUVVGTkxFTkJRVU1zUTBGQlF6dEpRVU53UXl4RFFVRkRPMGxCYmtKTkxFMUJRVTBzUTBGQlF5eFJRVUZSTEVOQlFVTXNSMEZCVlN4RlFVRkZMRVZCUVZrN1VVRkRNME1zU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1IwRkJSeXhGUVVGRkxFTkJRVU03VVVGRGVrSXNSMEZCUnl4RFFVRkRMRWxCUVVrc1EwRkJReXg1UWtGQmVVSXNSMEZCUnl4SFFVRkhMRU5CUVVNc1EwRkJRenRKUVVNNVF5eERRVUZETzBsQmEwSkVMRlZCUVZVc1EwRkJReXhKUVVGWExFVkJRVVVzUjBGQlZTeEZRVUZGTEV0QlFWa3NSVUZCUlN4TlFVRmhPMUZCUXpORUxFMUJRVTBzVFVGQlRTeEhRVUZITEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRE8xRkJRMmhETEUxQlFVMHNRMEZCUXl4SlFVRkpMRWRCUVU4c1NVRkJTU3hEUVVGRE8xRkJRM1pDTEUxQlFVMHNRMEZCUXl4TFFVRkxMRWRCUVUwc1MwRkJTeXhEUVVGRE8xRkJRM2hDTEUxQlFVMHNRMEZCUXl4SFFVRkhMRWRCUVZFc1IwRkJSeXhEUVVGRE8xRkJRM1JDTEUxQlFVMHNRMEZCUXl4TlFVRk5MRWRCUVVzc1RVRkJUU3hEUVVGRE8wbEJRemRDTEVOQlFVTTdTVUZQUkN4VFFVRlRMRU5CUVVNc1NVRkJWeXhGUVVGRkxFZEJRVWNzVFVGQlpUdFJRVU55UXl4TlFVRk5MRVZCUVVVc1IwRkJSeXhKUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMUZCUTJoRExFMUJRVTBzVTBGQlV5eEhRVUZITEVkQlFVY3NTVUZCU1N4SlFVRkpMRTFCUVUwc1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVVXNRMEZCUXp0UlFVTm9SQ3hKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEZOQlFWTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMUZCUXk5RExFbEJRVWtzUlVGQlJTeEZRVUZGTzFsQlEwb3NTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eEpRVUZUTEVWQlFVVXNSVUZCUlN4RFFVRkRMRVZCUVVVc1EwRkJReXhKUVVGSkxFVkJRVVVzU1VGQlNTeERRVUZETEVsQlFVa3NSVUZCUlN4SFFVRkhMRTFCUVUwc1EwRkJReXhEUVVGRExFTkJRVU03V1VGRGFFVXNSMEZCUnl4RFFVRkRMRWxCUVVrc1EwRkJReXhuUWtGQlowSXNTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhOUVVGTkxGRkJRVkVzVTBGQlV5eEhRVUZITEVOQlFVTXNRMEZCUXp0VFFVTndSVHRoUVVGTk8xbEJRMGdzUjBGQlJ5eERRVUZETEV0QlFVc3NRMEZCUXl4eFFrRkJjVUlzU1VGQlNTd3JRa0ZCSzBJc1RVRkJUU3hEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0VFFVTnlTRHRKUVVOTUxFTkJRVU03U1VGTlJDeE5RVUZOTEVOQlFVTXNTVUZCVXp0UlFVTmFMRWxCUVVrc1EwRkJReXhqUVVGakxFVkJRVVVzUTBGQlF6dFJRVU4wUWl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETEVOQlFWRXNSVUZCUlN4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTTdTVUZETDBNc1EwRkJRenRKUVVWUExHTkJRV003VVVGRGJFSXNUVUZCVFN4TlFVRk5MRWRCUVVjc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTTdVVUZEYUVNc1RVRkJUU3hSUVVGUkxFZEJRVWNzU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1VVRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTTdVVUZEYkVRc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNUVUZCVFN4RFFVRkRMRmRCUVZjc1EwRkJRenRoUVVOcVF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RlFVRkZMRTFCUVUwc1EwRkJReXhKUVVGSkxFTkJRVU03WVVGRGRFSXNTVUZCU1N4RFFVRkRMRWRCUVVjc1JVRkJSU3hOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZETzJGQlEzSkNMRWxCUVVrc1EwRkJReXhQUVVGUExFVkJRVVVzU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1VVRkJVU3hEUVVGRExFdEJRVXNzUjBGQlJ5eE5RVUZOTEVOQlFVTXNTVUZCU1N4SFFVRkhMRTFCUVUwc1EwRkJReXhMUVVGTExFTkJRVU03WVVGRGVFVXNTVUZCU1N4RFFVRkRMRkZCUVZFc1JVRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4UlFVRlJMRU5CUVVNc1RVRkJUU3hIUVVGSExFMUJRVTBzUTBGQlF5eEhRVUZITEVkQlFVY3NUVUZCVFN4RFFVRkRMRTFCUVUwc1EwRkJRenRoUVVONlJTeEpRVUZKTEVOQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1EwRkJReXhGUVVGRkxFTkJRVU03WVVGRGRrSXNTVUZCU1N4RFFVRkRMRWxCUVVrc1JVRkJSU3hSUVVGUkxFTkJRVU1zUlVGQlJTeERRVUZETzJGQlEzWkNMRWxCUVVrc1EwRkJReXhSUVVGUkxFVkJRVVVzVVVGQlVTeERRVUZETEUxQlFVMHNRMEZCUXl4TFFVRkxMRU5CUVVNN1lVRkRja01zU1VGQlNTeERRVUZETEdOQlFXTXNSVUZCUlN4UlFVRlJMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF6dGhRVU16UXl4SlFVRkpMRU5CUVVNc1owSkJRV2RDTEVWQlFVVXNVVUZCVVN4RFFVRkRMRTFCUVUwc1EwRkJReXhQUVVGUExFTkJRVU03WVVGREwwTXNTVUZCU1N4RFFVRkRMRTFCUVUwc1JVRkJSU3hSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXp0aFFVTnFReXhKUVVGSkxFTkJRVU1zWTBGQll5eEZRVUZGTEZGQlFWRXNRMEZCUXl4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03U1VGRGNrUXNRMEZCUXpzN1FVRjZSV2RDTEdOQlFWTXNSMEZCVVN4RlFVRkZMRU5CUVVNN1FVRklla01zYjBKQk5rVkRJbjA9IiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBoc3V0aWxfMSA9IHJlcXVpcmUoXCJoc3V0aWxcIik7XG5jb25zdCBsb2cgPSBoc3V0aWxfMS5sb2coJ2QzLmJ1YmJsZScpO1xuY29uc3QgZDMgPSByZXF1aXJlKFwiZDNcIik7XG5jb25zdCBERUZfUkFESVVTID0gNTtcbmV4cG9ydHMuYnViYmxlID0gKGRhdGEsIGRlc2MsIGN4LCBjeSwgcikgPT4ge1xuICAgIGNvbnN0IGl4ID0gZGF0YS5jb2xOdW1iZXIoY3gpO1xuICAgIGNvbnN0IGl5ID0gZGF0YS5jb2xOdW1iZXIoY3kpO1xuICAgIGNvbnN0IGlyID0gZGF0YS5jb2xOdW1iZXIocik7XG4gICAgY29uc3Qgc2NhbGVYID0gZGVzYy5jZmcuc2NhbGVzLmhvci5zY2FsZTtcbiAgICBjb25zdCBzY2FsZVkgPSBkZXNjLmNmZy5zY2FsZXMudmVyLnNjYWxlO1xuICAgIGNvbnN0IGRlZlIgPSBkZXNjLmNmZy5kZWZhdWx0cy5TY2FsZXMocik7XG4gICAgY29uc3Qgc2NhbGVSID0gZDMuc2NhbGVMaW5lYXIoKS5kb21haW4oZGF0YS5maW5kRG9tYWluKHIpKS5yYW5nZShbZGVmUi5yYW5nZS5taW4sIGRlZlIucmFuZ2UubWF4XSk7XG4gICAgY29uc3Qgc3ZnID0gZGVzYy5jZmcuYmFzZVNWRztcbiAgICBjb25zdCBjaXJjbGVzID0gc3ZnLnNlbGVjdEFsbChcImNpcmNsZVwiKS5kYXRhKGRhdGEuZ2V0RGF0YSgpKTtcbiAgICBjaXJjbGVzLmV4aXQoKS5yZW1vdmUoKTtcbiAgICBjaXJjbGVzLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKTtcbiAgICBjaXJjbGVzLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKVxuICAgICAgICAuYXR0cihcImN4XCIsIGQgPT4gc2NhbGVYKGRbaXhdKSlcbiAgICAgICAgLmF0dHIoXCJjeVwiLCBkID0+IHNjYWxlWShkW2l5XSkpXG4gICAgICAgIC5hdHRyKFwiclwiLCBkID0+IHNjYWxlUihpciA9PT0gdW5kZWZpbmVkID8gREVGX1JBRElVUyA6IGRbaXJdKSlcbiAgICAgICAgLmF0dHIoJ2ZpbGwnLCAoZCwgaSkgPT4gWycjZjAwJywgJyMwZjAnLCAnIzAwZicsICcjZmYwJywgJyNmMGYnLCAnIzBmZiddW2ldKTtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lZblZpWW14bExtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTGk0dmMzSmpMMkoxWW1Kc1pTNTBjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenRCUVVsQkxHMURRVUV3UXp0QlFVRkhMRTFCUVUwc1IwRkJSeXhIUVVGSExGbEJRVWtzUTBGQlF5eFhRVUZYTEVOQlFVTXNRMEZCUXp0QlFVTXpSU3g1UWtGQmMwTTdRVUZOZEVNc1RVRkJUU3hWUVVGVkxFZEJRVlVzUTBGQlF5eERRVUZETzBGQlUyWXNVVUZCUVN4TlFVRk5MRWRCUVdFc1EwRkJReXhKUVVGVExFVkJRVVVzU1VGQllTeEZRVUZGTEVWQlFWTXNSVUZCUlN4RlFVRlRMRVZCUVVVc1EwRkJVeXhGUVVGRkxFVkJRVVU3U1VGRE1VWXNUVUZCVFN4RlFVRkZMRWRCUVVjc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eEZRVUZGTEVOQlFVTXNRMEZCUXp0SlFVTTVRaXhOUVVGTkxFVkJRVVVzUjBGQlJ5eEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRE8wbEJRemxDTEUxQlFVMHNSVUZCUlN4SFFVRkhMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdTVUZETjBJc1RVRkJUU3hOUVVGTkxFZEJRVWNzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4TlFVRk5MRU5CUVVNc1IwRkJSeXhEUVVGRExFdEJRVXNzUTBGQlF6dEpRVU42UXl4TlFVRk5MRTFCUVUwc1IwRkJSeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRU5CUVVNc1MwRkJTeXhEUVVGRE8wbEJRM3BETEUxQlFVMHNTVUZCU1N4SFFVRkhMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zVVVGQlVTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRKUVVONlF5eE5RVUZOTEUxQlFVMHNSMEZCUnl4RlFVRkZMRU5CUVVNc1YwRkJWeXhGUVVGRkxFTkJRVU1zVFVGQlRTeERRVUZaTEVsQlFVa3NRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU03U1VGRE9VY3NUVUZCVFN4SFFVRkhMRWRCUVVjc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eFBRVUZQTEVOQlFVTTdTVUZETjBJc1RVRkJUU3hQUVVGUExFZEJRVWNzUjBGQlJ5eERRVUZETEZOQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEU5QlFVOHNSVUZCUlN4RFFVRkRMRU5CUVVNN1NVRkZOMFFzVDBGQlR5eERRVUZETEVsQlFVa3NSVUZCUlN4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRE8wbEJRM2hDTEU5QlFVOHNRMEZCUXl4TFFVRkxMRVZCUVVVc1EwRkJReXhOUVVGTkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdTVUZGYWtNc1QwRkJUeXhEUVVGRExGVkJRVlVzUlVGQlJTeERRVUZETEZGQlFWRXNRMEZCUXl4SlFVRkpMRU5CUVVNN1UwRkRPVUlzU1VGQlNTeERRVUZETEVsQlFVa3NSVUZCUlN4RFFVRkRMRU5CUVVNc1JVRkJSU3hEUVVGRExFMUJRVTBzUTBGQlV5eERRVUZETEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJRenRUUVVOMFF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RlFVRkZMRU5CUVVNc1EwRkJReXhGUVVGRkxFTkJRVU1zVFVGQlRTeERRVUZUTEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRE8xTkJRM1JETEVsQlFVa3NRMEZCUXl4SFFVRkhMRVZCUVVjc1EwRkJReXhEUVVGRExFVkJRVVVzUTBGQlF5eE5RVUZOTEVOQlFVTXNSVUZCUlN4TFFVRkhMRk5CUVZNc1EwRkJRU3hEUVVGRExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTXNRMEZCVXl4RFFVRkRMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF6dFRRVU51UlN4SlFVRkpMRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU1zUTBGQlF5eEZRVUZETEVOQlFVTXNSVUZCUlN4RlFVRkZMRU5CUVVNc1EwRkJReXhOUVVGTkxFVkJRVVVzVFVGQlRTeEZRVUZGTEUxQlFVMHNSVUZCUlN4TlFVRk5MRVZCUVVVc1RVRkJUU3hGUVVGRkxFMUJRVTBzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUXpGRk8wRkJRMVFzUTBGQlF5eERRVUZESW4wPSIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEdyYXBoXzEgPSByZXF1aXJlKFwiLi9HcmFwaFwiKTtcbmV4cG9ydHMuR3JhcGggPSBHcmFwaF8xLkdyYXBoO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pYVc1a1pYZ3Vhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdUxpOXpjbU12YVc1a1pYZ3VkSE1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3UVVGQlFTeHBRMEZCYlVNN1FVRkJNVUlzZDBKQlFVRXNTMEZCU3l4RFFVRkJJbjA9IiwibW9kdWxlLmV4cG9ydHMgPSBkMzsiXSwic291cmNlUm9vdCI6IiJ9