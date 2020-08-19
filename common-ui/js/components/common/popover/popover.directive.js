import controller from './popover.controller';

function popover () {
    return {
        controller,
        restrict : 'A',
        link     : (scope, element, attrs, popoverCtrl) => {
            console.warn('okokok', attrs.id);
            if (attrs.id && attrs.id.length > 0) {
                popoverCtrl.register(attrs.id);

                scope.$on('$destroy', () => {
                    popoverCtrl.deregister(attrs.id);
                });
            }
        }
    };
}

export default popover;
