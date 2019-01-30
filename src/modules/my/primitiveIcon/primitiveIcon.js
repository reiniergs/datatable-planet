import { LightningElement, api } from 'lwc';
import { classSet } from 'lightning/utils';
import { normalizeString as normalize } from 'lightning/utilsPrivate';
import * as iconUtils from 'lightning/iconUtils';
import * as templates from './build/templates';

export default class LightningPrimitiveIcon extends LightningElement {
    @api iconName;
    @api src;
    @api svgClass;
    @api size = 'medium';
    @api variant;

    renderedCallback() {
        if (this.iconName !== this.prevIconName) {
            this.prevIconName = this.iconName;
            const svgElement = this.template.querySelector('svg');
            iconUtils.safariA11yPatch(svgElement);
        }
    }

    get name() {
        return iconUtils.getName(this.iconName);
    }

    render() {
        const [sprite, name] = this.iconName.split(':');    
        return templates[`${sprite}_${name}`];
    }

    get normalizedSize() {
        return normalize(this.size, {
            fallbackValue: 'medium',
            validValues: ['xx-small', 'x-small', 'small', 'medium', 'large'],
        });
    }

    get normalizedVariant() {
        // NOTE: Leaving a note here because I just wasted a bunch of time
        // investigating why both 'bare' and 'inverse' are supported in
        // lightning-primitive-icon. lightning-icon also has a deprecated
        // 'bare', but that one is synonymous to 'inverse'. This 'bare' means
        // that no classes should be applied. So this component needs to
        // support both 'bare' and 'inverse' while lightning-icon only needs to
        // support 'inverse'.
        return normalize(this.variant, {
            fallbackValue: '',
            validValues: ['bare', 'error', 'inverse', 'warning'],
        });
    }

    get computedClass() {
        const { normalizedSize, normalizedVariant } = this;
        const classes = classSet(this.svgClass);

        if (normalizedVariant !== 'bare') {
            classes.add('slds-icon');
        }

        switch (normalizedVariant) {
            case 'error':
                classes.add('slds-icon-text-error');
                break;
            case 'warning':
                classes.add('slds-icon-text-warning');
                break;
            case 'inverse':
            case 'bare':
                break;
            default:
                // if custom icon is set, we don't want to set
                // the text-default class
                if (!this.src) {
                    classes.add('slds-icon-text-default');
                }
        }

        if (normalizedSize !== 'medium') {
            classes.add(`slds-icon_${normalizedSize}`);
        }

        return classes.toString();
    }
}