import { BrowserQRCodeSvgWriter } from '@zxing/library';
import { FlowComponent } from 'flow-component-model';
import * as React from 'react';
import './css/QRCode.css';

declare const manywho: any;

class QRCodeWriter extends FlowComponent {

    writer: BrowserQRCodeSvgWriter = new BrowserQRCodeSvgWriter();

    constructor(props: any) {
        super(props);
    }

    async componentDidMount() {
        await super.componentDidMount();
    }

    render() {

        const style: React.CSSProperties = {};
        style.width = '-webkit-fill-available';
        style.height = '-webkit-fill-available';

        if (this.model.visible === false) {
            style.display = 'none';
        }
        if (this.model.width) {
            style.width = this.model.width + 'px';
        }
        if (this.model.height) {
            style.height = this.model.height + 'px';
        }

        const label: string = this.model.label || 'Historical Reporting xxx';

        const content: string = this.getStateValue() as string;
        const width: number = this.model.width || 300;
        const height: number = this.model.height || 300;
        const svgElement: any = this.writer.write(content, width, height);

        return (
            <div
                className="barcode-scanner"
                style={style}
            >
            <svg
                style={style}
                dangerouslySetInnerHTML={{__html: svgElement.innerHTML}} />
            </div>
        );
    }

}

manywho.component.register('QRCodeWriter', QRCodeWriter);

export default QRCodeWriter;
