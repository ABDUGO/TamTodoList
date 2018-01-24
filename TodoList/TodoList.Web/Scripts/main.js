(function ($) {
    "use strict";

    var $html = $('html');
    var $body = $('body');
    var $sidebar = $('.sidebar');

    // Change IMG to inline SVGs...
    var svgPathCounter = 0;
    $('img.svg-img[src$=".svg"]').each(function () {
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
    $('.sidebar .toggle-sidebar, .topbar .navbar-toggle').click(function (e) {
        var isSmallSidebar = $html.hasClass('sidebar-sm');
        currentSidebarMode = !isSmallSidebar ? 'opened' : 'closed';

        $('.topbar .navbar-toggle .sidebar-menu-opened-icon, .topbar .navbar-toggle .sidebar-menu-closed-icon').toggleClass('hidden');

        $html.toggleClass('sidebar-sm');

        // Just run this animation onload then remove it
        $('.site-logo').removeClass('animated zoomIn');
    });

    // Mouse over/out Sidebar
    //$('.sidebar').mouseover(function (e) {
    //    $html.removeClass('sidebar-sm');
    //});

    //$('.sidebar').mouseout(function (e) {
    //    if (currentSidebarMode == 'opened')
    //        $html.addClass('sidebar-sm');
    //});

    // Check/Uncheck Todo List Items
    $('.todo-list-item-link').click(function (e) {
        var $todoListItem = $(this).parent();
        var isDone = $todoListItem.hasClass('done');

        $todoListItem.find('.todo-list-item-icon').attr('src', (isDone ? '/Images/icon-uncheck.svg' : '/Images/icon-check.svg'));

        $todoListItem.toggleClass('done');

        // Sort by default All Undone at the top of the List
        $todoListItem.removeClass('animated bounceInUp bounceInDown');

        if (isDone) {
            $todoListItem.prependTo($todoListItem.parent());
            $todoListItem.addClass('animated bounceInDown');
        } else {
            $todoListItem.appendTo($todoListItem.parent());
            $todoListItem.addClass('animated bounceInUp');
        }

        return false;
    });

    // Add Animation On Scroll
    $('.animated').waypoint(function () {
        var $this = $($(this)[0].element);
        $this.toggleClass($this.data('animated'));
        $this.css('opacity', 1);

        this.destroy();
    }, {
            offset: '90%',
            triggerOnce: true
        });

    // Search on typing 
    $('.topbar .navbar-left .search-input').keyup(function (e) {
        var $this = $(this);
        var searchText = $this.val().trim()

        if (searchText) {

            $('.todo-container .todo-list .todo-list-item').hide();
            $('.todo-container .todo-list .todo-list-item .todo-list-item-text:contains("' + searchText.replace(/"/g, '\"') + '")').each(function () {
                var $this = $(this);
                var $todoListItem = $this.parents('.todo-list-item');
                $todoListItem.show();

                // Hightlight Matches Chars
                $this.html($this.text().replace(new RegExp(searchText, 'gi'), '<span class="search-match-highlight">' + searchText + '</span>'));

            });

        } else {
            // no search text ? reset all highlights and show all todo list items
            $('.todo-container .todo-list .todo-list-item').show();
            $('.todo-container .todo-list .todo-list-item .todo-list-item-text').each(function () {
                var $this = $(this);
                // Unhightlight all Chars
                $this.html($this.text());
            });
        }
    });

    $(window).resize(function () {
        if (screen.availWidth < 768) {
            $('.sidebar .toggle-sidebar').click();
        }
    });

    $(window).resize();

})(jQuery);