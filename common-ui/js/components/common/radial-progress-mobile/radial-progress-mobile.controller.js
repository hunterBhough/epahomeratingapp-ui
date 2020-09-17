import * as d3 from 'd3';

const WIDTH         = 60;
const THICKNESS     = 7;
const START_ANGLE   = 0;

const CENTER        = WIDTH / 2;
const OUTER_RADIUS  = WIDTH / 2;
const INNER_RADIUS  = OUTER_RADIUS - THICKNESS;

const TRANSFORM     = `translate(${CENTER},${CENTER})`;

/**
 * Displays an SVG radial progress element that tracks number of verified checklist items,
 * must correct items, and total progress.
 *
 * Depends on the d3 library.
 */
class RadialProgressMobileController {
    constructor ($element) {
        'ngInject';

        this.$element = $element;
    }

    /**
     * Bind progressTotal to controller for the view.
     */
    get progressTotal () {
        return this.progress.Total === 0 ? 0 : Math.ceil(((this.progress.Verified + this.progress.MustCorrect) / this.progress.Total) * 100);
    }

    /**
     * Draw background of the radial progress element.
     * If there is verified progress, draw that arc.
     * If there is must correct progress, draw that arc.
     */
    $postLink () {
        let upperHalf  = this.$element.find('svg')[0];
        let lowerHalf  = this.$element.find('svg')[1];

        let upperHalfRadial      = d3.select(upperHalf);
        let lowerHalfRadial      = d3.select(lowerHalf);


        let upperHalfcScale
            = d3
                .scaleLinear()
                .domain([0, this.predrywall.Total])
                .range([0.5 * Math.PI, 1.5 * Math.PI]);
        let lowerHalfcScale
            = d3
                .scaleLinear()
                .domain([0, this.final.Total])
                .range([-0.5 * Math.PI, 0.5 * Math.PI]);


        let upperMustCorrectEnd  = upperHalfcScale(this.predrywall.MustCorrect);
        let lowerMustCorrectEnd  = lowerHalfcScale(this.final.MustCorrect);


        let upperVerifiedStart   = upperMustCorrectEnd;
        let upperVerifiedEnd     = upperHalfcScale(this.predrywall.Verified + this.predrywall.MustCorrect);

        let lowerVerifiedStart   = lowerMustCorrectEnd;
        let lowerVerifiedEnd     = lowerHalfcScale(this.final.Verified + this.final.MustCorrect);

        // define background arc
        let backgroundUpper
            = d3.arc()
                .innerRadius(INNER_RADIUS)
                .outerRadius(OUTER_RADIUS)
                .startAngle(0.5 * Math.PI)
                .endAngle(1.5 * Math.PI);
        let backgroundLower
            = d3.arc()
                .innerRadius(INNER_RADIUS)
                .outerRadius(OUTER_RADIUS)
                .startAngle(-0.5 * Math.PI)
                .endAngle(0.5 * Math.PI);

        // append background arc to svgElement
        upperHalfRadial
            .append('path')
            .attr('d', backgroundUpper)
            .attr('class', 'radial-progress-background')
            .attr('transform', TRANSFORM);

        lowerHalfRadial
            .append('path')
            .attr('d', backgroundLower)
            .attr('class', 'radial-progress-background')
            .attr('transform', TRANSFORM);

        // only draw must correct arc if there is progress
        if (this.predrywall.MustCorrect > 0) {
            // define must correct arc
            let upperMustCorrect
                = d3.arc()
                    .innerRadius(INNER_RADIUS)
                    .outerRadius(OUTER_RADIUS)
                    .startAngle(0.5 * Math.PI)
                    .endAngle(upperMustCorrectEnd);

            // append must correct arc to svgElement
            upperHalfRadial
                .append('path')
                .attr('d', upperMustCorrect)
                .attr('class', 'radial-progress-must-correct')
                .attr('transform', TRANSFORM);
        }

        if (this.final.MustCorrect > 0) {
            // define must correct arc
            let lowerMustCorrect
                = d3.arc()
                    .innerRadius(INNER_RADIUS)
                    .outerRadius(OUTER_RADIUS)
                    .startAngle(-0.5 * Math.PI)
                    .endAngle(lowerMustCorrectEnd);

            // append must correct arc to svgElement
            lowerHalfRadial
                .append('path')
                .attr('d', lowerMustCorrect)
                .attr('class', 'radial-progress-must-correct')
                .attr('transform', TRANSFORM);
        }

        // only draw verified arc if there is progress
        if (this.predrywall.Verified > 0) {
            // define verified arc
            let upperVerified
                = d3.arc()
                    .innerRadius(INNER_RADIUS)
                    .outerRadius(OUTER_RADIUS)
                    .startAngle(upperVerifiedStart)
                    .endAngle(upperVerifiedEnd);

            // append verified arc to svgElement
            upperHalfRadial
                .append('path')
                .attr('d', upperVerified)
                .attr('class', 'radial-progress-verified')
                .attr('transform', TRANSFORM);
        }

        if (this.final.Verified > 0) {
            // define verified arc
            let lowerVerified
                = d3.arc()
                    .innerRadius(INNER_RADIUS)
                    .outerRadius(OUTER_RADIUS)
                    .startAngle(lowerVerifiedStart)
                    .endAngle(lowerVerifiedEnd);

            // append verified arc to svgElement
            lowerHalfRadial
                .append('path')
                .attr('d', lowerVerified)
                .attr('class', 'radial-progress-verified')
                .attr('transform', TRANSFORM);
        }
    }
}

export default RadialProgressMobileController;
