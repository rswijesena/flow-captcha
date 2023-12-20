import { FCMLegacy } from "fcmlib/lib/FCMLegacy";
import { CaptchaModel } from "./CaptchaModel";
import * as React from 'react';
declare const manywho: any;

class Captcha extends FCMLegacy {
    render() {
        return(
            <CaptchaModel
                parent={this}
            />
        );
    }
}
manywho.component.register('Captcha', Captcha);