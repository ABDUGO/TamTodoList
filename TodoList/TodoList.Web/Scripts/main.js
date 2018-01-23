﻿(function ($) {
    "use strict";

    var $html = $('html');
    var $body = $('body');
    var $sidebar = $('.sidebar');

    // Change IMG to inline SVGs...
    var svgPathCounter = 0;
    $('img[src$=".svg"]').each(function () {
        var $img = $(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        $.get(imgURL, function (data) {
            var $svg = $(data).find('svg');

            // replace PathID and all it's references to ignore conflict with other SVGs
            $svg = $($svg[0].outerHTML.replace(/path-1/g, 'path-' + svgPathCounter++));

            if (typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            if (typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass + ' replaced-svg');
            }

            $svg = $svg.removeAttr('xmlns:a');

            if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
            }

            $img.replaceWith($svg);
        }, 'xml');

    });

    // Sidebar Item Click
    $('.sidebar .sidebar-menu li.sidebar-menu-item').click(function (e) {
        var $this = $(this);

        $('.sidebar .sidebar-menu li.sidebar-menu-item').removeClass('active');
        $this.addClass('active');
    });

    // Toggle Sidebar
    var currentSidebarMode = 'opened';
    $('.sidebar .toggle-sidebar').click(function (e) {
        var isSmallSidebar = $html.hasClass('sidebar-sm');
        currentSidebarMode = !isSmallSidebar ? 'opened' : 'closed';

        $html.toggleClass('sidebar-sm');
    });

    // Mouse over/out Sidebar
    //$('.sidebar').mouseover(function (e) {
    //    $html.removeClass('sidebar-sm');
    //});

    //$('.sidebar').mouseout(function (e) {
    //    if (currentSidebarMode == 'opened')
    //        $html.addClass('sidebar-sm');
    //});

})(jQuery);