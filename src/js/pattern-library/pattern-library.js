/*
 * PATTERN LIBRARY
 */





/* ==========================================================================
 * Navigation
 * ========================================================================== */

var $pl_nav = $('.js-pl-nav');

if ($pl_nav.length > 0) {

    var $pl_nav_toggle = $('.js-pl-nav-toggle');

    if ($pl_nav_toggle.length > 0) {
        $pl_nav_toggle.on('click', function (e) {
            e.preventDefault();

            $pl_nav.toggleClass('is-active');
            $pl_nav_toggle.toggleClass('is-active');
        })
    }
}
