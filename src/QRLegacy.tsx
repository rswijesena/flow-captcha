import { FCMLegacy } from "fcmlib/lib/FCMLegacy";
import { BarcodeScanner } from "./BarcodeScanner";
import * as React from 'react';
declare const manywho: any;

class QRCodeReader extends FCMLegacy {
    render() {
        return(
            <BarcodeScanner
                parent={this}
            />
        );
    }
}
manywho.component.register('QRCodeReader', QRCodeReader);

