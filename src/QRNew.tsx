import { FCMNew } from "fcmlib/lib/FCMNew";
import { BarcodeScanner } from "./BarcodeScanner";
import * as React from 'react';

export default class QRCodeReader extends FCMNew {
    render() {
        return(
            <BarcodeScanner 
                parent={this}
            />
        );
    }
}