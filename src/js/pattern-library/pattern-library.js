/*
 * PATTERN LIBRARY
 */

/* ==========================================================================
 * Clipboard
 * ========================================================================== */

var clipboard = new Clipboard('.js-pl-clipboard');

/*
 * Successfully copied to clipboard
 */

clipboard.on('success', function (e) {
    var $btn = $(e.trigger);
    var original_title = $btn.data('original-title');

    $btn.attr('data-original-title', 'Copied!'); // Update the title of the tooltip
    $btn.tooltip('show');
    e.clearSelection();
    $btn.attr('data-original-title', original_title); // Reset the tooltip title to the original
    $btn.blur();
});

/* ==========================================================================
 * Highlight
 * ========================================================================== */

var $pl_highlight = $('.js-pl-highlight');

if ($pl_highlight.length > 0) {
    $pl_highlight.each(function (i, block) {
        $(this).text($(this).html()); // Convert code to HTML character entities for syntax highlighting
        hljs.highlightBlock(block);
    });
}

/* ==========================================================================
 * Navigation
 * ========================================================================== */

var $pl_nav = $('.js-pl-nav');

if ($pl_nav.length > 0) {

    var $pl_nav_toggle = $('.js-pl-nav-toggle');

    /*
     * Toggle the navigation
     */

    if ($pl_nav_toggle.length > 0) {
        $pl_nav_toggle.on('click', function (e) {
            e.preventDefault();

            $pl_nav.toggleClass('is-active');
            $pl_nav_toggle.toggleClass('is-active');
        })
    }
}

/* ==========================================================================
 * Tooltip
 * ========================================================================== */

var $tooltip = $('.js-pl-tooltip');

if ($tooltip.length > 0) {
    $tooltip.each(function () {
        // Initialize tooltips
        $(this).tooltip({
            container: 'body'
        });
    });
}
