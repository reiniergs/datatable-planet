import { LightningElement, api, track } from 'lwc';

export default class PrimitiveHeader extends LightningElement {
    @api label = '';
    @api minColumnWidth = 50;
    @api maxColumnWidth = 1000;
    @api columnWidth = 0;
    @api colIndex;
    @track resizeElementXPosition;

    get headerStyles() {
        return `width: ${this.columnWidth}px`;
    }

    get resizeBarStyles() {
        return this.resizeElementXPosition ? `transform: translateX(${this.resizeElementXPosition}px)` : undefined;
    }

    handleResize(event) {
        event.returnValue = false;
        event.preventDefault();
        event.stopPropagation();

        this.lowRange = this.minColumnWidth - this.columnWidth;
        this.highRange = this.maxColumnWidth - this.columnWidth;
        this.startX = event.pageX;
        this.currentX = this.startX;
        this.touchingResizer = true;

        document.body.addEventListener('mousemove', this.onMove.bind(this));
        document.body.addEventListener('mouseup', this.onEnd.bind(this));
        document.body.addEventListener('mouseleave', this.onEnd.bind(this));

        requestAnimationFrame(this.resizing.bind(this));
    }

    onMove(event) {
        if (!this.touchingResizer) {
            return;
        }
        this.currentX = event.pageX;
    }

    onEnd() {
        if (!this.touchingResizer) {
            return;
        }
        this.touchingResizer = false;

        document.body.removeEventListener('mousemove', this.onMove.bind(this));
        document.body.removeEventListener('mouseup', this.onEnd.bind(this));
        document.body.removeEventListener('mouseleave', this.onEnd.bind(this));

        this.resizeElementXPosition = '';
        this.fireResizeEvent(this.translateX);
    }

    resizing() {
        if (!this.touchingResizer) {
            return;
        }
        requestAnimationFrame(this.resizing.bind(this));
        const translateX = this.currentX - this.startX;
        const isInRange = translateX >= this.lowRange && translateX <= this.highRange;
        if (this.lowRange === undefined || isInRange) {
            this.translateX = translateX;
            this.resizeElementXPosition = translateX;
        }
    }

    fireResizeEvent(widthDelta) {
        const actionEvent = new CustomEvent('resizecol', {
            bubbles: true,
            composed: true,
            detail: {
                colIndex: this.colIndex,
                widthDelta,
            },
        });
        this.dispatchEvent(actionEvent);
    }
}
