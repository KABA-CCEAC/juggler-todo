define(['./Effect'], function (Effect) {

    var StackEffect = Effect.extend({

        name: 'StackEffect',

        direction:'left',

        fromViewTransitionProps:{duration:0.4, easing:'ease-out', delay:0.4},

        toViewTransitionProps:{duration:0.4, easing:'ease-out', delay:0},

        play:function (fromView, toView, callback, context) {

            var timeout,
                that = this,
                $toView = toView && toView.$el,
                $fromView = fromView && fromView.$el,
                activeTransitions = 0,
                transformParams,
                transformProp = that.vendorPrefix == '' ? 'transform' :
                    ['-' + that.vendorPrefix, '-', 'transform'].join(''),
                transitionProp = that.vendorPrefix == '' ? 'transition' :
                    ['-' + that.vendorPrefix, '-', 'transition'].join('');

            var transitionEndHandler = function (event) {
                if (activeTransitions >= 0) {
                    activeTransitions--;

                    var $target = $(event.target);
                    $target.css(transformProp, '');
                    $target.css(transitionProp, '');

                    if ($toView && $toView[0] == event.target) $toView.css('left', 0);

                    if (activeTransitions == 0 && callback) {
                        if (timeout) clearTimeout(timeout);
                        callback.call(context);
                    }
                }
            };

            if ($toView && that.direction === 'left') {
                activeTransitions++;

                $toView.one(that.transitionEndEvent, transitionEndHandler);

                $toView.css('left', that.direction == 'left' ? context.$el.width() : -context.$el.width());
                $toView.css(transitionProp, [transformProp, ' ',
                                             that.toViewTransitionProps.duration, 's ',
                                             that.toViewTransitionProps.easing, ' ',
                                             that.toViewTransitionProps.delay, 's'].join(''));

                // Showing the view
                $toView.css('visibility', 'visible');
                $toView.css('z-index', '100');
            } else {
                $toView.css('visibility', 'visible');
            }

            if ($fromView && that.direction === 'right') {
                activeTransitions++;

                $fromView.one(that.transitionEndEvent, transitionEndHandler);

                $fromView.css('left', 0);
                $fromView.css(transitionProp, [transformProp, ' ',
                                               that.fromViewTransitionProps.duration, 's ',
                                               that.fromViewTransitionProps.easing, ' ',
                                               that.fromViewTransitionProps.delay, 's'].join(''));
            }

            if ($fromView || $toView) {
                // This is a hack to force DOM reflow before transition starts
                context.$el.css('width');

                transformParams = 'translate3d(' + (that.direction == 'left' ? -context.$el.width() : context.$el.width()) + 'px, 0, 0)';
            }

            // This is a fallback for situations when TransitionEnd event doesn't get triggered
            var transDuration = Math.max(that.fromViewTransitionProps.duration, that.toViewTransitionProps.duration) +
                Math.max(that.fromViewTransitionProps.delay, that.toViewTransitionProps.delay);

            timeout = setTimeout(function () {
                if (activeTransitions > 0) {
                    activeTransitions = -1;

                    that.log('warn', 'Warning ' + that.transitionEndEvent + ' didn\'t trigger in expected time!', that);

                    if ($toView) {
                        $toView.off(that.transitionEndEvent, transitionEndHandler);
                        $toView.css(transitionProp, '');
                        $toView.css(transformProp, '');
                        $toView.css('left', 0);
                    }

                    if ($fromView) {
                        $fromView.css('visibility', 'hidden');
                        $fromView.off(that.transitionEndEvent, transitionEndHandler);
                        $fromView.css(transitionProp, '');
                        $fromView.css(transformProp, '');
                    }

                    callback.call(context);
                }
            }, transDuration * 1.5 * 1000);

            // var $views;
            // if ($fromView && $toView) $views = $fromView.add($toView);
            // else if ($toView) $views = $toView;
            // else if ($fromView) $views = $fromView;

            // if ($views) $views.css(transformProp, transformParams);
            if (that.direction === 'left') {
                if ($toView) $toView.css(transformProp, transformParams);
            } else {
                if ($fromView) $fromView.css(transformProp, transformParams);
            }
        }
    });

    return StackEffect;
});