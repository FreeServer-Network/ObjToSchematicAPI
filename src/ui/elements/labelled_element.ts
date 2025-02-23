import { BaseUIElement } from './base_element';
import { LabelElement } from './label';

export abstract class LabelledElement<Type> extends BaseUIElement<Type> {
    private _label: string;
    private _labelElement: LabelElement;

    public constructor(label: string) {
        super();
        this._label = label;
        this._labelElement = new LabelElement(label);
    }

    public generateHTML() {
        return `
            ${this._labelElement.generateHTML()}
            <div class="prop-value-container">
                ${this.generateInnerHTML()}
            </div>
        `;
    }

    protected abstract generateInnerHTML(): string;

    protected _onEnabledChanged() {
        this._labelElement.setEnabled(this.getEnabled());
    }

    public addDescription(text: string) {
        this._labelElement = new LabelElement(this._label, text);
    }
}
