        $('.tab5 li').on('touchend', function() {
            var $this = $(this);
            var this_id = $this.attr('data-target');
            $this.addClass('on').siblings('li').removeClass('on');
            $('.tab5-list').each(function() {
                $(this).removeClass('on');
                $('#' + this_id).addClass('on');
            })
        })