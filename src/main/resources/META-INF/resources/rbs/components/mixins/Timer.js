/*
 *  Copyright (c) 2015-present, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 *
 BSD License

 For react-timer-mixin software

 Copyright (c) 2015-present, Facebook, Inc. All rights reserved.

 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 * Neither the name Facebook nor the names of its contributors may be used to
 endorse or promote products derived from this software without specific
 prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
define([ "react", "underscore" ],
  function (React, _) {
    "use strict";

    var setter = function (_setter, _clearer, array) {
      return function (callback, delta) {
        var id = _setter(function () {
          _clearer.call(this, id);
          callback.apply(this, arguments);
        }.bind(this), delta);

        if (!this[ array ]) {
          this[ array ] = [ id ];
        } else {
          this[ array ].push(id);
        }
        return id;
      };
    };

    var clearer = function (_clearer, array) {
      return function (id) {
        if (this[ array ]) {
          var index = this[ array ].indexOf(id);
          if (index !== -1) {
            this[ array ].splice(index, 1);
          }
        }
        _clearer(id);
      };
    };

    var _timeouts = 'TimerMixin_timeouts';
    var _clearTimeout = clearer(window.clearTimeout, _timeouts);
    var _setTimeout = setter(window.setTimeout, _clearTimeout, _timeouts);

    var _intervals = 'TimerMixin_intervals';
    var _clearInterval = clearer(window.clearInterval, _intervals);
    var _setInterval = setter(window.setInterval, _.noop, _intervals);

    var _immediates = 'TimerMixin_immediates';
    var _clearImmediate = clearer(window.clearImmediate, _immediates);
    var _setImmediate = setter(window.setImmediate, _clearImmediate, _immediates);

    var _rafs = 'TimerMixin_rafs';
    var _cancelAnimationFrame = clearer(window.cancelAnimationFrame, _rafs);
    var _requestAnimationFrame = setter(window.requestAnimationFrame, _cancelAnimationFrame, _rafs);

    return React.createMixin({
      componentWillUnmount: function () {
        this[ _timeouts ] && this[ _timeouts ].forEach(function (id) {
          window.clearTimeout(id);
        });
        this[ _timeouts ] = null;
        this[ _intervals ] && this[ _intervals ].forEach(function (id) {
          window.clearInterval(id);
        });
        this[ _intervals ] = null;
        this[ _immediates ] && this[ _immediates ].forEach(function (id) {
          window.clearImmediate(id);
        });
        this[ _immediates ] = null;
        this[ _rafs ] && this[ _rafs ].forEach(function (id) {
          window.cancelAnimationFrame(id);
        });
        this[ _rafs ] = null;
      },

      setTimeout: _setTimeout,
      clearTimeout: _clearTimeout,

      setInterval: _setInterval,
      clearInterval: _clearInterval,

      setImmediate: _setImmediate,
      clearImmediate: _clearImmediate,

      requestAnimationFrame: _requestAnimationFrame,
      cancelAnimationFrame: _cancelAnimationFrame
    });
  });