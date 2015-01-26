/*
 * Copyright 2014 University of California, Berkeley.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Author: Liang Gong (gongliang13@cs.berkeley.edu)

(function() {
    function EXP_click(x, y) {
        var ev = document.createEvent("MouseEvent");
        var el = document.elementFromPoint(x, y);
        if (el) {
            ev.initMouseEvent(
                "click",
                true /* bubble */ ,
                true /* cancelable */ ,
                window,
                null,
                x, y, 0, 0, /* coordinates */
                false, false, false, false, /* modifier keys */
                0 /*left*/ ,
                null
            );
            el.dispatchEvent(ev);
        } else {
            console.log('miss');
        }
    }

    var numClick = 20;

    for (var i = 1; i < numClick; i++) {
        EXP_click(window.innerWidth / numClick * i, window.innerWidth / numClick * i);
    }

    for (var i = 1; i < numClick; i++) {
        EXP_click(window.innerWidth - window.innerWidth / numClick * i, window.innerWidth / numClick * i);
    }
})();